import { Events } from "discord.js";
import { Event } from "../../Classes/index.js";
import consola from "consola";

export default new Event({
  name: Events.Warn,
  execute: async (info: string) => consola.warn(info),
});
