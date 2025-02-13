import {
  EmbedBuilder,
  InteractionContextType,
  MessageFlags,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import { ChatInputCommand } from "../../../Classes/index.js";
import { api } from "../../../intra.js";
import { isUserRegisteredForCurrentExam } from "../../../api/fetches.js";
import { logger as defaultLogger } from "../../../logger.js";

const CMD_CHANNELID = process.env["CMD_CHANNELID"];

const logger = defaultLogger.child({command: "exam"});

export default new ChatInputCommand({
  builder: new SlashCommandBuilder()
    .setName("exam")
    .setDescription("Check if user is registered for the current exam")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages)
    .addStringOption((option) =>
      option.setName("login").setDescription("User login").setRequired(true)
    ),
  guildIds: [process.env["GUILDID"]!],
  execute: async (interaction) => {

    // @ts-ignore it have name ok ?
    logger.info({ user: { username: interaction.user.username, tag: interaction.user.tag}, channel: interaction.channel.name });

    if (interaction.channelId !== CMD_CHANNELID) {
      await interaction.reply({
        content: `This command is not available here.`,
        ephemeral: true,
      });
      return;
    }
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const login = interaction.options.getString("login", true);

    const res = await isUserRegisteredForCurrentExam(api!, login);

    if (res === null) {
      await interaction.editReply({
        content: `No active exams found`,
      });
      return;
    }

    const GREEN_TICK =
      "https://w7.pngwing.com/pngs/270/706/png-transparent-check-mark-computer-icons-green-tick-mark-angle-text-logo-thumbnail.png";
    const RED_CROSS =
      "https://p7.hiclipart.com/preview/833/287/785/check-mark-international-red-cross-and-red-crescent-movement-american-red-cross-clip-art-red-cross-mark-download-png-thumbnail.jpg";
    const thumbnailUrl = res.status ? GREEN_TICK : RED_CROSS;
    const embedExam = new EmbedBuilder()
      .setTitle(`User: ${login.toLowerCase()}`)
      .setDescription(
        `Exam: ${res.exam.name}\nTime: ${new Date(
          res.exam.begin_at
        ).toLocaleString()}\nRegister: ${res.status ? "Yes" : "No"}`
      )
      .setThumbnail(thumbnailUrl);

    await interaction.editReply({
      embeds: [embedExam],
    });
  },
});
