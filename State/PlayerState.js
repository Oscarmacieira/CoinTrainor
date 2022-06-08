class PlayerState {
    constructor() {
        this.coins = {
            "c1": {
            coinId: "o001",
            hp: 50,
            maxHp: 50,
            xp: 0,
            maxXp: 100,
            level: 1,
            status: null,
            },
         //    "c2": {
         //    coinId: "o002",
         //    hp: 50,
         //    maxHp: 50,
          //   xp: 75,
         //    maxXp: 100,
         //    level: 1,
         //    status: null,
         //    },
         //    "c3": {
         //        coinId: "d001",
         //        hp: 50,
         //        maxHp: 50,
         //        xp: 75,
          //       maxXp: 100,
         //        level: 1,
         //        status: null,
        //    }
            
        }
        this.lineup = ["c1"];
        this.items = [
            { actionId: "item_recoverHp", instanceId: "item1" },
            { actionId: "item_recoverStatus", instanceId: "item2" },
            { actionId: "item_recoverStatus", instanceId: "item3" },
            { actionId: "item_recoverHp", instanceId: "item4" },
            { actionId: "item_recoverHp", instanceId: "item5" },
        ]

        this.storyFlags = {
           // TALKED_TO_ELON: true
        };

    }


    addCoin(coinId) {
        const newId = `p${Date.now()}`+Math.floor(Math.random() * 99999);
        this.coins[newId] = {
            coinId,
            hp: 50,
            maxHp: 50,
            xp: 0,
            maxXp: 100,
            level: 1,
            status: null,
        }
        if (this.lineup.length < 3) {
            this.lineup.push(newId)
        }
        utils.emitEvent("LineupChanged");
        console.log(this)
    }

    swapLineup(oldId, incomingId) {
        const oldIndex = this.lineup.indexOf(oldId);
        this.lineup[oldIndex] = incomingId;
        utils.emitEvent("LineupChanged");
      }
    
      moveToFront(futureFrontId) {
        this.lineup = this.lineup.filter(id => id !== futureFrontId);
        this.lineup.unshift(futureFrontId);
        utils.emitEvent("LineupChanged");
      }

  }
  window.playerState = new PlayerState();