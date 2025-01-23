import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  type MessageActionRowComponentBuilder,
} from "discord.js";

// Example button (related to the /ping command)
/**
 * Creates the ping response button
 * @returns Button builder object
 */
export function getPingButton() {
  const pingButton = new ButtonBuilder()
    .setCustomId("ping")
    .setLabel("ping")
    .setStyle(ButtonStyle.Primary)
    .setDisabled(false)
    .setEmoji("🏓");
  return new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
    pingButton
  );
}
