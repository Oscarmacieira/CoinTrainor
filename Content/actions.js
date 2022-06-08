window.Actions = {
    damage1: {
        name: "Vampire Attack",
        description: "Entices users and liquidity from your opponent",
        success: [
            { type: "textMessage", text:"{CASTER} uses {ACTION}!" },
            { type: "animation", animation:"spin" },
            { type: "stateChange", damage: 10 },
        ]
    },
    bullishStatus: {
        name: "Liquidity Attraction",
        description: "3 round of increased APY",
        targetType: "friendly",
        success: [
            { type: "textMessage", text:"{CASTER} uses {ACTION}!" },
            { type: "animation", animation:"liquidityAttr" },
            { type: "stateChange", status: { type: "bullish", expiresIn: 3 } }
        ]
    },
    bearishStatus: {
        name: "FUD",
        description: "China is banning your opponent for 2 round.",
        success: [
            { type: "textMessage", text:"{CASTER} uses {ACTION}!" },
            { type: "animation", animation:"fud", color:"#ff0000" },
            { type: "stateChange", status: { type: "bearish", expiresIn: 3 } },
            { type: "textMessage", text:"FUD is all around {TARGET}!" }
        ]
    },
      //Items
    item_recoverStatus: {
        name: "MACD reset",
        description: "Resolve market trend",
        targetType: "friendly",
        success: [
            { type: "textMessage", text: "{CASTER} uses a {ACTION}!"},
            { type: "stateChange", status: null },
            { type: "textMessage", text: "Feeling new!", },
        ]
     },
    item_recoverHp: {
        name: "Marketing Campaign",
        targetType: "friendly",
        success: [
            { type:"textMessage", text: "{CASTER} sprinkles on some {ACTION}!", },
            { type:"stateChange", recover: 10, },
            { type:"textMessage", text: "{CASTER} recovers cred score!", },
        ]
    },
    
   
}