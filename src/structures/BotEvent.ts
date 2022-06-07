import Bot from "../Bot";

export default interface BotEvent {
    name: string,
    execute(bot: Bot, ...args): void
}
