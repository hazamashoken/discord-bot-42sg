import {
  EmbedBuilder,
  InteractionContextType,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import { ChatInputCommand } from "../../../Classes/index.js";
import { api } from "../../../intra.js";
import { fetchNextExamUser } from "../../../api/fetches.js";
import consola from "consola";

const CMD_CHANNELID = process.env["CMD_CHANNELID"];

export default new ChatInputCommand({
  builder: new SlashCommandBuilder()
    .setName("exam-next")
    .setDescription("Get next exams info")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages),
  guildIds: [process.env["GUILDID"]!],
  execute: async (interaction) => {
    if (interaction.channelId !== CMD_CHANNELID) {
      await interaction.reply({
        content: `This command is not available here.`,
        ephemeral: true,
      });
      return;
    }
    await interaction.deferReply();

    const examUser = await fetchNextExamUser(api!);

    consola.log(examUser ? examUser.examUsers : "No exams found");

    if (!examUser) {
      await interaction.editReply({
        content: "No exams found",
      });
      return;
    }

    const userMsg =
      examUser.examUsers.length > 0
        ? examUser.examUsers.map((user) => user.user.login + "\n")
        : "No users subscribed";

    const embedExam = new EmbedBuilder()
      .setTitle(
        `${
          examUser.exam.name
        }: ${examUser.exam.begin_at.toDateString()} ${examUser.exam.begin_at.toLocaleTimeString()}`
      )
      .setDescription(`${userMsg}`);
    await interaction.editReply({
      embeds: [embedExam],
    });
  },
});
