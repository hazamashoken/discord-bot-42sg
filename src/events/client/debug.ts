import { Events } from "discord.js";
import { Event } from "../../Classes/index.js";
import consola from "consola";

export default new Event({
  name: Events.Debug,
  execute: async (info: string) => {
    if (info.startsWith("[WS => ")) {
      return;
    }
    consola.debug(info);
  },
});
