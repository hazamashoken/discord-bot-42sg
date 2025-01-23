import { EmbedBuilder, MessageFlags, ModalSubmitInteraction } from "discord.js";
import { ExtraColor, Interaction } from "../../../Classes/index.js";

export default new Interaction<ModalSubmitInteraction>()
  .setCustomIdPrefix("modal")
  .setRun(async (interaction) => {
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("embed-title")
          .setColor(ExtraColor.EmbedGray)
          .setFields(
            {
              name: "embed-short",
              value: interaction.fields.getTextInputValue("short"),
            },
            {
              name: "embed-paragraph",
              value:
                interaction.fields.getTextInputValue("paragraph") || "`N/A`",
            }
          ),
      ],
      flags: MessageFlags.Ephemeral,
    });
  });
