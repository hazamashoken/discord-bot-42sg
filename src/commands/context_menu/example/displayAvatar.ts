import {
  ApplicationCommandType,
  EmbedBuilder,
  GuildMember,
  InteractionContextType,
  type UserContextMenuCommandInteraction,
} from "discord.js";
import { ContextMenuCommand, ExtraColor } from "../../../Classes/index.js";

// Example user context menu

export default new ContextMenuCommand()
  .setBuilder((builder) =>
    builder
      .setName("Display Avatar")
      .setType(ApplicationCommandType.User) // Specify the context menu type
      // Allows command to be used in DMs, servers and group DMs
      .setContexts(InteractionContextType.Guild)
  )
  //@ts-ignore
  .setExecute(async (interaction: UserContextMenuCommandInteraction) => {
    const member = interaction.targetMember as GuildMember;
    const embed = new EmbedBuilder()
      .setTitle(member.displayName)
      .setImage(member.displayAvatarURL({ size: 4096 }))
      .setColor(ExtraColor.EmbedGray)
      .setFooter({ text: `ID: ${member.id}` });
    return interaction.reply({ embeds: [embed] });
  });
