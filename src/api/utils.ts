import fs from "fs";
import { Exam42 } from "./interfaces.js";
import dns from "dns";
import consola from "consola";

export const EXAM_MODE_ENABLED =
  process.env.EXAM_MODE_ENABLED === "true" || false;

export const parseIpRanges = function (ipRanges: string): string[] {
  return ipRanges
    .split(",")
    .map((range) => range.trim())
    .filter((range) => range.length > 0);
};

export const ipToHostName = async function (
  ip: string
): Promise<string | null> {
  try {
    const result = await dns.promises.reverse(ip);
    return result[0];
  } catch (err) {
    consola.error(err);
    return null;
  }
};

export const hostNameToIp = async function (
  hostName: string
): Promise<string | null> {
  try {
    const result = await dns.promises.lookup(hostName);
    return result.address;
  } catch (err) {
    consola.error(err);
    return null;
  }
};

export const getCurrentExams = function (exams: Exam42[]): Exam42[] {
  const now = new Date();
  return exams.filter((exam) => exam.begin_at < now && exam.end_at > now);
};

export const getMessageForHostName = async function (
  hostName: string
): Promise<string> {
  if (hostName === "unknown") {
    consola.warn("Hostname is unknown, unable to find messages for host");
    return "";
  }
  const hostIp = await hostNameToIp(hostName);
  if (!hostIp) {
    consola.warn(
      `Could not parse IP address from hostname "${hostName}", unable to find messages for host`
    );
    return "";
  }

  try {
    // Read messages.json
    // TODO: implement caching for messages
    const messagesJson = JSON.parse(fs.readFileSync("messages.json", "utf8"));
    if (!messagesJson) {
      consola.warn(
        "Could not parse messages.json, unable to find messages for host"
      );
      return "";
    }

    // Find messages for host
    // Any message with a key that the hostname starts with will be returned
    const hostMessages = Object.entries(messagesJson)
      .filter(([key]) => hostName.startsWith(key))
      .map(([, message]) => message);

    // Combine all messages into one
    return hostMessages.join("\n\n");
  } catch (error) {
    consola.error(error);
    return "";
  }
};
