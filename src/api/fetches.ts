import { Event42, Exam42, ExamUser } from "./interfaces.js";
import consola from "consola";

const CAMPUS_ID = process.env["INTRA_CAMPUS_ID"];
const FETCH_EVENTS_UPCOMING_DAYS = 21; // 3 weeks
// const EVENT_KINDS_FILTER = [
//   "rush",
//   "piscine",
//   "partnership", // pedago
//   "conference",
//   "meet_up",
//   "event", // event
//   "association", // association (student's club)
//   "hackathon",
//   "workshop",
//   "challenge", // speed working
//   "extern", // other
// ];

const fetchAll42 = async function (
  //@ts-ignore
  api: Fast42,
  path: string,
  params: { [key: string]: string } = {}
): Promise<any[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const pages = await api.getAllPages(path, params);
      consola.log(
        `Retrieving API items: ${pages.length} pages for path ${path}`
      );

      // Fetch all pages
      let i = 0;
      const pageItems = await Promise.all(
        //@ts-ignore
        pages.map(async (page) => {
          consola.log(`Fetching page ${++i}/${pages.length}`);
          const p = await page;
          if (p.status == 429) {
            throw new Error("Intra API rate limit exceeded");
          }
          if (p.ok) {
            const data = await p.json();
            return data;
          } else {
            throw new Error(`Intra API error: ${p.status} ${p.statusText}`);
          }
        })
      );
      return resolve(pageItems.flat());
    } catch (err) {
      return reject(err);
    }
  });
};

// const getEventDateRange = function (): string {
//   const currentDate = new Date();
//   const maxFetchDate = new Date(
//     currentDate.getTime() + 1000 * 60 * 60 * 24 * 365
//   ); // 1 year into the future
//   return `${currentDate.toISOString()},${maxFetchDate.toISOString()}`;
// };

const filterExamOrEventOnDate = function (items: Exam42[] | Event42[]) {
  // Delete events that are over the limit specified in the global variable
  const currentDate = new Date();
  const maxFetchDate = new Date(
    currentDate.getTime() + 1000 * 60 * 60 * 24 * FETCH_EVENTS_UPCOMING_DAYS
  );
  // @ts-ignore (This expression is not callable -> each member of union type has signatures, but none of those signatures are compatible with each other)
  const filteredItems = items.filter((item: Exam42 | Event42) => {
    const eventDate = new Date(item.begin_at);
    return eventDate.getTime() <= maxFetchDate.getTime();
  });
  return filteredItems;
};

export const fetchFutureExams = async function (
  //@ts-ignore
  api: Fast42
): Promise<Exam42[]> {
  try {
    const intraExams = await fetchAll42(api, `/campus/${CAMPUS_ID}/exams`, {
      "filter[future]": "true",
      sort: "-begin_at",
    });

    // Convert to Exam42 objects
    const exams42: Exam42[] = intraExams.map((item) => {
      return new Exam42(item);
    });

    // Remove exams too far into the future
    const filteredExams = filterExamOrEventOnDate(exams42) as Exam42[];

    if (filteredExams.length == 0) {
      consola.log("No exams found");
      return [];
    }

    filteredExams.sort((a, b) => {
      return a.begin_at.getTime() - b.begin_at.getTime();
    });
    consola.log(`Fetched ${filteredExams.length} exams`);
    return filteredExams;
  } catch (err) {
    consola.log(err);
    return [];
  }
};

export const fetchNextExamUser = async function (
  //@ts-ignore
  api: Fast42
): Promise<{ exam: Exam42; examUsers: ExamUser[] } | null> {
  try {
    const futureExam = await fetchFutureExams(api);

    if (futureExam.length == 0) {
      return null;
    }

    const examID = futureExam[0]!.id;

    const examUsers = await fetchAll42(api, `/exams/${examID}/exams_users`);

    consola.log(`Fetched ${examUsers.length} exams`);
    return { exam: futureExam[0]!, examUsers };
  } catch (err) {
    consola.log(err);
    return null;
  }
};

export const fetchUserFutureExam = async function (
  //@ts-ignore
  api: Fast42,
  login: string
): Promise<Exam42[] | null> {
  try {
    const userExams = await fetchAll42(
      api,
      `/users/${login.toLowerCase()}/exams`,
      {
        "filter[future]": "true",
      }
    );

    consola.debug(`Fetched ${userExams.length} exams`);
    return userExams;
  } catch (err) {
    consola.error(err);
    return null;
  }
};

export const fetchExamUserNow = async function (
  //@ts-ignore
  api: Fast42
): Promise<{ examUsers: ExamUser[]; exam: Exam42 } | null> {
  try {
    const ONE_HOUR = 1 * 60 * 60 * 1000;

    const examsNows = await fetchAll42(api, `/campus/${CAMPUS_ID}/exams`, {
      // "range[begin_at]": `2025-01-24T09:08:28.247Z,2025-01-31T10:08:28.247Z`,
      "range[begin_at]": `${new Date(
        new Date().getTime() - ONE_HOUR
      ).toISOString()},${new Date().toISOString()}`,
      "filter[future]": "false",
    });

    consola.debug(`Fetched ${examsNows.length} exams`);

    if (examsNows.length === 0) {
      return null;
    }

    const examUsers = await fetchAll42(
      api,
      `/exams/${examsNows[0].id}/exams_users`
    );

    consola.debug(`Fetched ${examUsers.length} users`);

    return { examUsers, exam: examsNows[0] };
  } catch (err) {
    consola.error(err);
    return null;
  }
};

export async function isUserRegisteredForCurrentExam(
  //@ts-ignore
  api: Fast42,
  login: string
): Promise<{ status: boolean; exam: Exam42 } | null> {
  try {
    const res = await fetchExamUserNow(api);

    if (!res) {
      return null;
    }

    const user = res.examUsers.find((user) => user.user.login === login);

    return { status: user ? true : false, exam: res.exam };
  } catch (err) {
    consola.error(err);
    return null;
  }
}
