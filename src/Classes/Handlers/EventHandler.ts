import { Client, Collection } from "discord.js";
import assert from "node:assert/strict";
import { Event } from "../Event.js";

export class EventHandler {
  readonly client: Client;

  protected events: Collection<string, Event> = new Collection();

  protected validateEvent(event: Event) {
    assert(typeof event.name !== "undefined");
    assert(typeof event.execute !== "undefined");
  }

  /**
   * Add Event to Event handler
   * @param event event to add to handler
   */
  add(event: Event) {
    this.validateEvent(event);
    //@ts-ignore
    if (event.once) this.client.once(event.name, event.execute);
    //@ts-ignore
    else this.client.on(event.name, event.execute);
    //@ts-ignore
    this.events.set(event.name, event);
  }

  get size() {
    return this.events.size;
  }

  constructor(client: Client) {
    this.client = client;
  }
}
