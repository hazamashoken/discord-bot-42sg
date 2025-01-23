import { ButtonInteraction, MessageFlags } from "discord.js";
import { Interaction } from "../../../Classes/index.js";
import { getPingButton } from "../../../features/ping.js";

// Example interaction (related to the /ping command)
export default new Interaction<ButtonInteraction>()
  .setCustomIdPrefix("ping")
  .setRun(async (interaction) => {
    interaction.reply({
      content: `ping 🏓`,
      components: [getPingButton(interaction.locale)],
      flags: MessageFlags.Ephemeral,
    });
  });
