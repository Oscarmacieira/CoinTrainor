class OverworldMap {
    constructor(config){
        this.overworld = null;
        this.gameObjects = config.gameObjects;
        this.cutsceneSpaces = config.cutsceneSpaces || {};

        this.walls = config.walls || {};

        this.lowerImage = new Image();
        this.lowerImage.src = config.lowerSrc;

        this.upperImage = new Image();
        this.upperImage.src = config.upperSrc;

        this.isCutscenePlaying = false;
        this.isPaused = false;
    }

    drawLowerImage(ctx, cameraPerson){
        ctx.drawImage(
            this.lowerImage,
             utils.withGrid(10.5) - cameraPerson.x, 
             utils.withGrid(6) - cameraPerson.y
        )
    }

    drawUpperImage(ctx, cameraPerson){
        ctx.drawImage(
            this.upperImage,
             utils.withGrid(10.5) - cameraPerson.x, 
             utils.withGrid(6) - cameraPerson.y
        )
    }

    isSpaceTaken(currentX, currentY, direction) {
        const {x, y} = utils.nextPosition(currentX, currentY, direction);
        return this.walls[`${x},${y}`] || false;
    }

    mountObjects() {
        Object.keys(this.gameObjects).forEach(key => {

            let object = this.gameObjects[key];
            object.id = key;
            //TODO: object to be mount?

            object.mount(this);
        })
    }

    async startCutscene(events) {
        this.isCutscenePlaying = true;
    
        for (let i=0; i<events.length; i++) {
            const eventHandler = new OverworldEvent({
                event: events[i],
                map: this,
            })
            const result = await eventHandler.init();
            if (result === "LOST_BATTLE") {
                break;
            }
        }

        this.isCutscenePlaying = false;

        // reset NPC to have idle beehavior
        Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this))
    }

    checkForActionCutscene() {
        const hero = this.gameObjects["hero"];
        const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
        const match = Object.values(this.gameObjects).find(object => {
        return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
        });
        if (!this.isCutscenePlaying && match && match.talking.length) {
    
        const relevantScenario = match.talking.find(scenario => {
            return (scenario.required || []).every(sf => {
            return playerState.storyFlags[sf]
            })
        })
        relevantScenario && this.startCutscene(relevantScenario.events)
        }
    }

    checkForFootstepCutscene() {
        const hero = this.gameObjects["hero"];
        const match = this.cutsceneSpaces[ `${hero.x},${hero.y}` ];
        if (!this.isCutscenePlaying && match) {
            this.startCutscene( match[0].events )
        }
    }

    addWall(x,y) {
        this.walls[`${x},${y}`] = true;
    }
    removeWall(x,y) {
        delete this.walls[`${x},${y}`]
    }
    moveWall(wasX, wasY, direction) {
        this.removeWall(wasX, wasY);
        const {x,y} = utils.nextPosition(wasX, wasY, direction);
        this.addWall(x,y);
    }

}

window.OverworldMaps = {
    DemoRoom: {
        id: "DemoRoom",
        lowerSrc: "images/maps/DemoLower.png",
        upperSrc: "images/maps/DemoUpper.png",
        gameObjects:{
            hero: new Person({
                isPlayerControlled: true,
                x:utils.withGrid(6),
                y:utils.withGrid(1)
            }),
            npcA: new Person({
                x:utils.withGrid(3),
                y:utils.withGrid(4),
                src: "images/characters/people/npc1.png",
                behaviorLoop: [
                   { type: "walk", direction: "right"  },
                   { type: "walk", direction: "right"  },
                   { type: "stand", direction: "up", time: 2600 },
                   { type: "walk", direction: "left"  },
                   { type: "stand", direction: "up", time: 1600 },
                   { type: "walk", direction: "right"  },
                   { type: "stand", direction: "up", time: 1600 },
                   { type: "walk", direction: "left"  },
                   { type: "walk", direction: "left"  },
                   { type: "stand", direction: "up", time: 1200 },
                ],
                talking: [
                    {
                        events: [
                            { type: "textMessage", text: "Professor Nakamoto said he was on a great mission." },
                            { type: "textMessage", text: "Might better to not disturb him." },
                            { type: "addStoryFlag", flag: "TALKED_TO_ELON" },
                        //    { who:"hero", type: "walk", direction:"left" },
                            { who:"hero", type: "walk", direction:"left" },
                        ]
                    }
                ]
                

            }),
            npcB: new Person({
                x:utils.withGrid(7),
                y:utils.withGrid(3),
                src: "images/characters/people/npc2.png",
                //behaviorLoop: [
                //    { type: "walk", direction: "right"  },
                //    { type: "stand", direction: "up", time: 600 },
                //    { type: "walk", direction: "left"  },
                //    { type: "stand", direction: "up", time: 700 },
                //],
                talking: [
                    {
                        required: ["TALKED_TO_ELON"],
                        events: [
                        { type: "textMessage", text: "Isn't Satoshi a genius?", faceHero: "npcA" },
                        ]
                    },
                    {
                        events: [
                            { type: "textMessage", text: "The market is crashing Anon.", faceHero:"npcB" },
                            { type: "textMessage", text: "Can I borrow you money to do leverage?" },
                            { who:"hero", type: "walk", direction:"down" },
                            { who:"hero", type: "walk", direction:"left" },
                            { who:"npcB", type: "stand", direction:"down" },
                            { type:"battle", enemyId: "hasheur" },
                            { type: "addStoryFlag", flag: "DEFEATED_HASHEUR" },
                            { type: "textMessage", text: "Anyway... I am here for the tech." },

                        ]
                    }
                ]

            }),
            coinStone: new CoinStone({
                x: utils.withGrid(1),
                y: utils.withGrid(2),
                storyFlag: "USED_COIN_STONE",
                coins: ["o001", "m001"],
            }),
            
        },
        walls: {
          //  "16,16": true
          [utils.asGridCoord(4,6)] : true,
          [utils.asGridCoord(5,6)] : true,
          [utils.asGridCoord(6,6)] : true,
          [utils.asGridCoord(7,6)] : true,
          [utils.asGridCoord(8,6)] : true,
          [utils.asGridCoord(9,6)] : true,

          [utils.asGridCoord(6,0)] : true,
          [utils.asGridCoord(5,2)] : true,
          [utils.asGridCoord(7,2)] : true,
        
          [utils.asGridCoord(1,1)] : true,
          [utils.asGridCoord(2,1)] : true,
          [utils.asGridCoord(3,1)] : true,
          [utils.asGridCoord(4,1)] : true,
          [utils.asGridCoord(5,1)] : true,
          [utils.asGridCoord(7,1)] : true,
          [utils.asGridCoord(8,1)] : true,

          [utils.asGridCoord(9,2)] : true,
          [utils.asGridCoord(9,3)] : true,
          [utils.asGridCoord(10,4)] : true,
          [utils.asGridCoord(10,5)] : true,

          [utils.asGridCoord(10,7)] : true,
          [utils.asGridCoord(10,8)] : true,
          [utils.asGridCoord(9,9)] : true,
          [utils.asGridCoord(8,9)] : true,
          [utils.asGridCoord(7,9)] : true,
          [utils.asGridCoord(6,9)] : true,
          [utils.asGridCoord(5,9)] : true,
          [utils.asGridCoord(5,9)] : true,
          [utils.asGridCoord(3,9)] : true,
          [utils.asGridCoord(4,10)] : true, //entry
          
          [utils.asGridCoord(0,2)] : true,

          [utils.asGridCoord(1,3)] : true,
          [utils.asGridCoord(1,4)] : true,
          [utils.asGridCoord(1,5)] : true,

          [utils.asGridCoord(0,6)] : true,
          [utils.asGridCoord(0,7)] : true,
          [utils.asGridCoord(1,8)] : true,
          [utils.asGridCoord(2,8)] : true,
          [utils.asGridCoord(3,8)] : true,  
        },
        cutsceneSpaces: {
            [utils.asGridCoord(6,2)]: [
                {
                    events: [
                        {who: "npcB", type:"walk", direction: "left"},
                        {who: "npcB", type:"stand", direction: "up", time: 500},
                        {type:"textMessage", text:"Sorry Anon, this place is not for you!"},
                        {who: "npcB", type:"walk", direction: "right"},
                        {who: "npcB", type:"stand", direction: "down"},
                        {who: "hero", type:"walk", direction: "down"},
                        {who: "hero", type:"walk", direction: "left"},


                    ]
                }
            ],
            [utils.asGridCoord(4,9)]: [
                {
                    events: [
                        { 
                            type: "changeMap",
                            map: "Desk",
                            x: utils.withGrid(4),
                            y: utils.withGrid(9), 
                            direction: "up"
                        }
                    ]
                }
            ]
        }
    },
    
    Desk: {
        id: "Desk",
        lowerSrc: "images/maps/DeskLower.png",
        upperSrc: "images/maps/DeskUpper.png",
        gameObjects:{
            hero: new Person({
                isPlayerControlled: true,
                x:utils.withGrid(4),
                y:utils.withGrid(9)
            }),
            npcA: new Person({
                x:utils.withGrid(10),
                y:utils.withGrid(7),
                src: "images/characters/people/npc1.png",
                talking: [
                    {
                        events: [
                            { type: "textMessage", text: "I don't know you.", faceHero:"npcA" },
                        ]
                    }
                ]
            })  
        },
        cutsceneSpaces: {
            [utils.asGridCoord(4,10)]: [
                {
                    events: [
                        { 
                            type: "changeMap", 
                            map: "Street",
                            x: utils.withGrid(28),
                            y: utils.withGrid(8), 
                            direction: "down"
                        }
                    ]
                }
            ]
        }
    },
    Street: {
        id: "Street",
        lowerSrc: "images/maps/StreetLower.png",
        upperSrc: "images/maps/StreetUpper.png",
        gameObjects: {
            hero: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(30),
                y: utils.withGrid(10),
            })
        },
        cutsceneSpaces: {
            [utils.asGridCoord(28,8)]: [
                {
                    events: [
                        { 
                            type: "changeMap",
                            map: "Desk",
                            x: utils.withGrid(4),
                            y: utils.withGrid(9), 
                            direction: "up"
                        }
                    ]
                }
            ]
        }
    }
}