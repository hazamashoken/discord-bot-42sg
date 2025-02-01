import {
  EmbedBuilder,
  InteractionContextType,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import { ChatInputCommand } from "../../../Classes/index.js";
import { api } from "../../../intra.js";
import { fetchUserFutureExam } from "../../../api/fetches.js";
import { logger as defaultLogger } from "../../../logger.js";

const CMD_CHANNELID = process.env["CMD_CHANNELID"];

const logger = defaultLogger.child({ command: "exam-user" });

export default new ChatInputCommand({
  builder: new SlashCommandBuilder()
    .setName("exam-user")
    .setDescription("Get Intra user exam info")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages)
    .addStringOption((option) =>
      option.setName("login").setDescription("User login").setRequired(true)
    ),
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

    const login = interaction.options.getString("login", true);

    const exams = await fetchUserFutureExam(api!, login);

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
