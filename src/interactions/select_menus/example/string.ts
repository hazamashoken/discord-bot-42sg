import { StringSelectMenuInteraction } from "discord.js";
import { Interaction } from "../../../Classes/index.js";

export default new Interaction<StringSelectMenuInteraction>()
  .setCustomIdPrefix("string")
  .setRun(async (interaction) => {
    interaction.update({
      content: "string-reply",
      components: [],
    });
  });
