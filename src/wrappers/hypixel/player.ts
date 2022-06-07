
import fetch from "node-fetch";
const KEYS = process.env.HYPIXEL_KEYS!.split(/,/g);
const main = `http://api.hypixel.net/player?key=${KEYS[Math.floor(Math.random() * (KEYS.length - 1))]}&uuid=`;
const mojang = `https://api.mojang.com/users/profiles/minecraft/`;
import { getRank, getPlusColor, getEmojiRank, getFormattedRank, getPlusColorMC, getSk1erRank, getEmojiRankFromFormatted, getLevel } from './functions/general';


export default async function get(query) {
    return new Promise<any>(async res => {
        if (!query) return res({ displayname: query, exists: false })

        if (query.length <= 16) {
            let $uuid = await fetch(mojang + query);
            try {
                let uuid = await $uuid.json();
                query = uuid.id;
            } catch (e) {
                res({ displayname: query, exists: false })
            }
        } else {
            query = query.replace(/-/g, "");
        }
        let unparsed = await fetch(main + query)
        let data = await unparsed.json().catch(e => ({ outage: true }));;
        if (data.outage) return res({ outage: true })
        if (!data.player) return res({ displayname: query, exists: false });
        data.player.rank = getRank(data.player)
        data.player.color = getPlusColor(data.player.rankPlusColor, data.player.rank)
        data.player.emojiRank = getEmojiRank(data.player)

        data.player.mcPlusColor = getPlusColorMC(data.player.rank, data.player.rankPlusColor)
        data.player.formattedRank = getFormattedRank(data.player.rank, data.player.mcPlusColor)
        data.player.level = getLevel(data.player.networkExp)
        res(data.player)
    })
}
// const BASE = 10000;
// const GROWTH = 2500;
// const HALF_GROWTH = 0.5 * GROWTH;
// const REVERSE_PQ_PREFIX = -(BASE - 0.5 * GROWTH) / GROWTH;
// const REVERSE_CONST = REVERSE_PQ_PREFIX * REVERSE_PQ_PREFIX;
// const GROWTH_DIVIDES_2 = 2 / GROWTH;