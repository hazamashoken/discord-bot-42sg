import {
  ActionRowBuilder,
  ChatInputCommandInteraction,
  InteractionContextType,
  ModalBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { ChatInputCommand } from "../../../Classes/index.js";

// Example slash command

export default new ChatInputCommand({
  builder: new SlashCommandBuilder()
    .setName("modal")
    .setDescription("Demonstration of modal")
    // Allows command to be used in DMs, servers and group DMs
    .setContexts(
      InteractionContextType.BotDM,
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages),
  //@ts-ignore
  execute,
});

/**
 * Function runs when modal command is used
 * @param interaction the interaction form the client event
 * @returns a void promise
 */
async function execute(interaction: ChatInputCommandInteraction) {
  return interaction.showModal(
    new ModalBuilder()
      .setCustomId("modal")
      .setTitle("modal-title")
      .addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(
          new TextInputBuilder()
            .setCustomId("short")
            .setLabel("modal-short-label")
            .setPlaceholder("modal-short-placeholder")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        ),
        new ActionRowBuilder<TextInputBuilder>().addComponents(
          new TextInputBuilder()
            .setCustomId("paragraph")
            .setLabel("modal-paragraph-label")
            .setPlaceholder("modal-paragraph-placeholder")
            .setMaxLength(500)
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false)
        )
      )
  );
}
