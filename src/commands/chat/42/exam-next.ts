import {
  EmbedBuilder,
  InteractionContextType,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import { logger as defaultLogger } from "../../../logger.js";
import { ChatInputCommand } from "../../../Classes/index.js";
import { api } from "../../../intra.js";
import { fetchNextExamUser } from "../../../api/fetches.js";

const CMD_CHANNELID = process.env["CMD_CHANNELID"];

const logger = defaultLogger.child({command: "exam-next"});

export default new ChatInputCommand({
  builder: new SlashCommandBuilder()
    .setName("exam-next")
    .setDescription("Get next exams info")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages),
  guildIds: [process.env["GUILDID"]!],
  execute: async (interaction) => {
    
    //@ts-ignore it have name ok ?
    logger.info({ user: { username: interaction.user.username, tag: interaction.user.tag}, channel: interaction.channel.name });
    
    if (interaction.channelId !== CMD_CHANNELID) {
      await interaction.reply({
        content: `This command is not available here.`,
        ephemeral: true,
      });
      return;
    }
    await interaction.deferReply();

    const examUser = await fetchNextExamUser(api!);

    logger.debug(examUser ? examUser.examUsers : "No exams found");

    if (!examUser) {
      await interaction.editReply({
        content: "No exams found",
      });
      return;
    }

    const userMsg =
      examUser.examUsers.length > 0
        ? examUser.examUsers.map((user) => user.user.login).sort((a, b) => a.localeCompare(b) ).join("\n")
        : "No users subscribed";

    // logger.info(userMsg);

    const embedExam = new EmbedBuilder()
      .setTitle(
        `${
          examUser.exam.name
        }: ${examUser.exam.begin_at.toDateString()} ${examUser.exam.begin_at.toLocaleTimeString()}: ${examUser.examUsers.length} users`
      )
      .setDescription(`${userMsg}`);

    await interaction.editReply({
      embeds: [embedExam],
    });
  },
});
