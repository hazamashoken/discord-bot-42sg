import {
  InteractionContextType,
  MessageFlags,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import { ChatInputCommand } from "../../../Classes/index.js";
import { getPingButton } from "../../../features/ping.js";

// Example slash command
export default new ChatInputCommand({
  builder: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong")
    // Allows command to be used in DMs, servers and group DMs
    .setContexts(
      InteractionContextType.BotDM,
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages),
  // Uncomment the below line to only have the ping command in the specified guild
  // guildIds: [process.env.GUILDID],
  execute: async (interaction) => {
    return interaction.reply({
      content: ` reply 🏓`,
      components: [getPingButton()],
      flags: MessageFlags.Ephemeral,
    });
  },
});
