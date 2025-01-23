import {
  InteractionContextType,
  MessageFlags,
  PermissionsBitField,
} from "discord.js";
import { ChatInputCommand } from "../../../Classes/index.js";

// Example slash command
export default new ChatInputCommand()
  .setBuilder((builder) =>
    builder
      .setName("autocomplete")
      .setDescription("Demonstration of Autocomplete")
      // Allows command to be used in DMs, servers and group DMs
      .setContexts(
        InteractionContextType.BotDM,
        InteractionContextType.Guild,
        InteractionContextType.PrivateChannel
      )
      .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages)
      .addStringOption((option) =>
        option
          .setName("option1-name")
          .setDescription("option1-description")
          .setRequired(true)
          .setAutocomplete(true)
      )
  )
  .setExecute(async (interaction) => {
    interaction.reply({
      content: interaction.options.getString("option", true),

      flags: MessageFlags.Ephemeral,
    });
  })
  .setAutocomplete(async (interaction) => {
    const focusedOption = interaction.options.getFocused(true);
    let choices: string[] | undefined = undefined;

    if (focusedOption.name == "option") {
      choices = [
        "oranges",
        "bananas",
        "apples",
        "grapefruits",
        "avocados",
        "apricots",
      ];
    }

    if (!choices) return;
    const filtered = choices.filter((choice) =>
      choice.toLowerCase().startsWith(focusedOption.value.toLowerCase())
    );
    interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice })).slice(0, 14)
    );
  });
