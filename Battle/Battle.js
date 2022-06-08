class Battle {
  constructor({ enemy, onComplete }) {
    this.enemy = enemy;
    this.onComplete = onComplete;

    this.combatants = {
      //        "player1": new Combatant({
      //            ...Coins.o001,
      //            team: "player",
      //            hp: 40,
      //            maxHp: 50,
      //            xp: 95,
      //            maxXp: 100,
      //            level: 1,
      //            status: {type: "bearish"},
      //            isPlayerControlled: true
      //        }, this),
      //        "player2": new Combatant({
      //            ...Coins.o002,
      //           team: "player",
      //           hp: 40,
      //           maxHp: 50,
      //           xp: 35,
      //            maxXp: 100,
      //            level: 1,
      //            status: null,
      //            isPlayerControlled: true
      //        }, this),
      //       "enemy1": new Combatant({
      //           ...Coins.m001,
      //           team: "enemy",
      //           hp: 1,
      //           maxHp: 50,
      //           xp: 20,
      //           maxXp: 100,
      //           level: 1,
      //      }, this),
      //      "enemy2": new Combatant({
      //          ...Coins.d001,
      //          team: "enemy",
      //          hp: 50,
      //          maxHp: 50,
      //          xp: 30,
      //           maxXp: 100,
      //           level: 1,
      //       }, this)
    };
    this.activeCombatants = {
      player: null,
      enemy: null,
    };

    //Dynamically add the Player team
    window.playerState.lineup.forEach((id) => {
      this.addCombatant(id, "player", window.playerState.coins[id]);
    });
    //Now the enemy team
    Object.keys(this.enemy.coins).forEach((key) => {
      this.addCombatant("e_" + key, "enemy", this.enemy.coins[key]);
    });

    //Start empty
    this.items = [];

    //Add in player items
    window.playerState.items.forEach((item) => {
      this.items.push({
        ...item,
        team: "player",
      });
    });

    this.usedInstanceIds = {};
  }

  addCombatant(id, team, config) {
    this.combatants[id] = new Combatant(
      {
        ...Coins[config.coinId],
        ...config,
        team,
        isPlayerControlled: team === "player",
      },
      this
    );

    //Populate first active coin

    this.activeCombatants[team] = this.activeCombatants[team] || id;
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("Battle");
    this.element.innerHTML = `
        <div class="Battle_hero">
            <img src="${"./images/characters/people/hero.png"}" alt="Hero" />
        </div>
        <div class="Battle_enemy">
            <img src="${this.enemy.src}" alt="${this.enemy.src}" />
        </div>
        `;
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);

    this.playerTeam = new Team("player", "Hero");
    this.enemyTeam = new Team("enemy", "elon");

    Object.keys(this.combatants).forEach((key) => {
      let combatant = this.combatants[key];
      combatant.id = key;
      combatant.init(this.element);

      //Add to correct team
      if (combatant.team === "player") {
        this.playerTeam.combatants.push(combatant);
      } else if (combatant.team === "enemy") {
        this.enemyTeam.combatants.push(combatant);
      }
    });

    this.playerTeam.init(this.element);
    this.enemyTeam.init(this.element);

    this.turnCycle = new TurnCycle({
      battle: this,
      onNewEvent: (event) => {
        return new Promise((resolve) => {
          const battleEvent = new BattleEvent(event, this);
          battleEvent.init(resolve);
        });
      },
      onWinner: (winner) => {
        if (winner === "player") {
          const playerState = window.playerState;
          Object.keys(playerState.coins).forEach((id) => {
            const playerStateCoin = playerState.coins[id];
            const combatant = this.combatants[id];
            if (combatant) {
              playerStateCoin.hp = combatant.hp;
              playerStateCoin.xp = combatant.xp;
              playerStateCoin.maxXp = combatant.maxXp;
              playerStateCoin.level = combatant.level;
            }
          });

          //Get rid of player used items
          playerState.items = playerState.items.filter((item) => {
            return !this.usedInstanceIds[item.instanceId];
          });

          //Send signal to update
          utils.emitEvent("PlayerStateUpdated");
        }

        this.element.remove();
        this.onComplete(winner === "player");
      },
    });
    this.turnCycle.init();
  }
}
