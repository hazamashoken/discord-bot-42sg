import { Events } from "discord.js";
import { Client, Event } from "../../Classes/index.js";
import consola from "consola";

export default new Event({
  name: Events.ClientReady,
  once: true,
  execute: async (client: Client) => {
    consola.log(
      `\nReady! Logged in as ${client.user?.tag} (${client.user?.id})\n`
    );
  },
});
