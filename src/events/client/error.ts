import { Events } from "discord.js";
import { Event } from "../../Classes/index.js";
import { logger } from "../../logger.js";

export default new Event({
  name: Events.Error,
  execute: (error: Error) => {
    logger.error(error)
  },
});
