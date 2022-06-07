import ServicesBot from "./Bot";

require('dotenv').config();
const { TOKEN } = process.env;
console.log("starting bot");
export const bot = new ServicesBot({ presence: { activities: [{ name: "Omen Services", type: "WATCHING" }] }, intents: ["GUILD_MESSAGES", "DIRECT_MESSAGES", "GUILDS", "GUILD_MESSAGE_REACTIONS", "GUILD_MESSAGE_TYPING", "GUILD_MEMBERS"], partials: ["REACTION", "MESSAGE"], rejectOnRateLimit: (e) => ((e.limit == 10) && (e.method == 'patch')), failIfNotExists: false });

bot.login(TOKEN);