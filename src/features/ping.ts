import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Locale,
  type MessageActionRowComponentBuilder,
} from "discord.js";

// Example button (related to the /ping command)
/**
 * Creates the ping response button
 * @param locale the locale of the interaction where the button was requested
 * @returns Button builder object
 */
export function getPingButton(locale: Locale) {
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
