import {
  GuildMember,
  InteractionContextType,
  MessageFlags,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import { ChatInputCommand } from "../../../Classes/index.js";
import { logger as defaultLogger } from "../../../logger.js";
import { payUserAlt } from '../../../api/fetches.js';
import { api } from '../../../intra.js';

const CMD_CHANNELID = process.env["CMD_CHANNELID"];

const logger = defaultLogger.child({command: "pay-alt"});

export default new ChatInputCommand({
  builder: new SlashCommandBuilder()
    .setName("pay-alt")
    .setDescription("pay user in alt")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages)
    .addStringOption((option) => option.setName("login").setDescription("Login").setRequired(true))
    .addIntegerOption((option) => option.setName("amount").setDescription("Amount to pay").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("Reason for payment").setRequired(true)),
  guildIds: [process.env["GUILDID"]!],
  execute: async (interaction) => {



    // @ts-ignore it have name ok ?
    logger.info({ user: { username: interaction.user.username, tag: interaction.user.tag}, channel: interaction.channel.name });

    if (interaction.channelId !== CMD_CHANNELID) {
      await interaction.reply({
        content: `This command is not available here.`,
        flags: MessageFlags.Ephemeral
      });
      return;
    }
    const member = interaction.member as GuildMember;


    if (!member) {
      await interaction.reply({
        content: `You must be in a guild to use this command.`,
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    if (!member.roles.cache.has(process.env["STAFF_ROLEID"]!)) {
      await interaction.reply({
        content: `You must be bocal to run this command.`,
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    await interaction.deferReply({
      flags: MessageFlags.Ephemeral
    });

    const login = interaction.options.getString("login", true);
    const amount = interaction.options.getInteger("amount", true);
    const reason = interaction.options.getString("reason", true);

    try {
      await payUserAlt(api, login, amount, reason);
    } catch (error) {
      await interaction.editReply({
        content: `Failed to pay user ${login}. Please check the logs.`,
      });
      return;
    }

    await interaction.editReply({
      content: `You have successfully pay ${login} : ${amount}`,
    })
  },
});
