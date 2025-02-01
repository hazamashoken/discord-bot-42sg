import Fast42 from "@codam/fast42";
import { logger } from "./logger.js";

async function setUpIntraAPI() {
  //@ts-ignore
  let api: Fast42 | undefined = undefined;

  try {
    logger.info(`Using Intra API UID: ${process.env["INTRA_API_UID"]}`);
    //@ts-ignore
    api = await new Fast42([
      {
        client_id: process.env["INTRA_API_UID"]!,
        client_secret: process.env["INTRA_API_SECRET"]!,
      },
    ]).init();
  } catch (err) {
    logger.warn(
      "Could not initialize Intra API, some features might not work"
    );
    logger.error(err);
    api = undefined; // unset api
  }
  return api;
}
export const api = await setUpIntraAPI();
