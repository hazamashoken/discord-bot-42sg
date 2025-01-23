import {
  ActionRowBuilder,
  InteractionContextType,
  type MessageActionRowComponentBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import { ChatInputCommand } from "../../../Classes/index.js";

/** TODO: add examples of more select menus */

// Example slash command
export default new ChatInputCommand({
  builder: new SlashCommandBuilder()
    .setName("select-menu")
    .setDescription("Select Menu Example")
    // Allows command to be used in DMs, servers and group DMs
    .setContexts(
      InteractionContextType.BotDM,
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("string")
        .setDescription("Example of a String Select Menu")
    ),
}).setExecute(async (interaction) => {
  let row: ActionRowBuilder<MessageActionRowComponentBuilder>;
  switch (interaction.options.getSubcommand(true)) {
    case "string":
      row =
        new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId("string")
            .setPlaceholder("menu-string-placeholder")
            .addOptions(
              new StringSelectMenuOptionBuilder()
                .setLabel("menu-string-first-label")
                .setDescription("menu-string-first-description")
                .setValue("first_option")
                .setEmoji("1️⃣"),
              new StringSelectMenuOptionBuilder()
                .setLabel("menu-string-second-label")
                .setDescription("menu-string-second-description")
                .setValue("second_option")
                .setEmoji("2️⃣")
            )
        );

      return interaction.reply({ components: [row], ephemeral: true });
    default:
      break;
  }
});
