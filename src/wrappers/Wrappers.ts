export class Wrappers {
    static hypixel = {
        guild: import('./hypixel/guild'),
        player: import('./hypixel/player'),
        status: import('./hypixel/status')
    }
    static mojang = {
        player: import('./mojang/mojangPlayer'),
        profile: import('./mojang/mojangProfile')
    }
    static sk1er = {
        guild: import('./sk1er/sk1erGuild')
    }
    static ashcon = {
        player: import('./ashcon/ashconPlayer')
    }
    static slothpixel = {
        skyblock: import('./slothpixel/slothpixelSkyblock')
    }
    static shiiyu = {
        skyblock: import('./shiiyu/shiiyuSkyblock')
    }

}