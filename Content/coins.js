window.CoinTypes = {
    normal: "normal",
    og: "OG",
    meme: "meme",
    defi: "defi",
    layer: "L1",
}

window.Coins = {
    "o001": {
        name: "Bitcoin",
        description: "Digital sound money",
        type: CoinTypes.og,
        src: "./images/characters/coins/o001.png",
        icon: "./images/icons/og.png",
        actions: [ "bullishStatus", "bearishStatus", "damage1" ],
    },
    "o002": {
        name: "Ethereum",
        description: "Behold the first generation of smartcontracts",
        type: CoinTypes.og,
        src: "./images/characters/coins/o002.png",
        icon: "./images/icons/og.png",
        actions: [ "damage1", "bullishStatus", "bearishStatus" ],
    },
    "m001": {
        name: "Dogecoin",
        description: "King of all meme",
        type: CoinTypes.meme,
        src: "./images/characters/coins/m001.png",
        icon: "./images/icons/meme.png",
        actions: [ "damage1" ],
    },
    "d001": {
        name: "Curve",
        description: "Venerated DeFi emperor",
        type: CoinTypes.defi,
        src: "./images/characters/coins/d001.png",
        icon: "./images/icons/defi.png",
        actions: [ "damage1" ],
    }
}