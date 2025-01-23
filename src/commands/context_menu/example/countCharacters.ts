import {
  ApplicationCommandType,
  InteractionContextType,
  MessageFlags,
  type MessageContextMenuCommandInteraction,
} from "discord.js";
import { ContextMenuCommand } from "../../../Classes/index.js";

// Example message context menu

export default new ContextMenuCommand()
  .setBuilder((builder) =>
    builder
      .setName("Count characters")

      .setType(ApplicationCommandType.Message) // Specify the context menu type
      // Allows command to be used in servers
      .setContexts(InteractionContextType.Guild)
  )
  //@ts-ignore
  .setExecute(async (interaction: MessageContextMenuCommandInteraction) => {
    const message = interaction.targetMessage,
      length = message.content.length;
    return interaction.reply({
      content: `${length} characters`,
      flags: MessageFlags.Ephemeral,
    });
  });
