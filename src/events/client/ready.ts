import { Events } from "discord.js";
import { Client, Event } from "../../Classes/index.js";
import { logger } from "../../logger.js";

export default new Event({
  name: Events.ClientReady,
  once: true,
  execute: async (client: Client) => {
    logger.info(
      `\nReady! Logged in as ${client.user?.tag} (${client.user?.id})\n`
    );
  },
});
