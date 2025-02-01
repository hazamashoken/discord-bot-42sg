import { Events } from "discord.js";
import { Event } from "../../Classes/index.js";
import { logger } from "../../logger.js";

export default new Event({
  name: Events.Debug,
  execute: async (info: string) => {
    if (info.startsWith("[WS => ")) {
      return;
    }
    logger.debug(info);
  },
});
