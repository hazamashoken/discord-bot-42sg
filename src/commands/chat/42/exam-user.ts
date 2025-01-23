import {
  EmbedBuilder,
  InteractionContextType,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import { ChatInputCommand } from "../../../Classes/index.js";
import { api } from "../../../intra.js";
import { fetchUserFutureExam } from "../../../api/fetches.js";
import consola from "consola";

export default new ChatInputCommand({
  builder: new SlashCommandBuilder()
    .setName("exam-user")
    .setDescription("Get Intra user exam info")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages)
    .addStringOption((option) =>
      option.setName("login").setDescription("User login").setRequired(true)
    ),
  guildIds: [process.env.GUILDID!],
  execute: async (interaction) => {
    await interaction.deferReply();

    const login = interaction.options.getString("login", true);

    const exams = await fetchUserFutureExam(api, login);

    if (!exams) {
      await interaction.editReply({
        content: `No exams for ${login.toLowerCase()} found`,
      });
      return;
    }

    const embedExam = new EmbedBuilder()
      .setTitle(`User: ${login.toLowerCase()}`)
      .setDescription(
        `${exams
          .map((exam) => new Date(exam.begin_at).toDateString() + "\n")
          .join("")}`
      );

    await interaction.editReply({
      embeds: [embedExam],
    });
  },
});
