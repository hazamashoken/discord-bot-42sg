import { Events } from "discord.js";
import { Event } from "../../Classes/index.js";
import consola from "consola";

export default new Event({
  name: Events.Error,
  execute: (error: Error) => consola.error(error),
});
