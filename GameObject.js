class GameObject{
    constructor(config){
        this.id = null; 
        this.isMounted = false;
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.direction = config.direction || "down";
        this.sprite = new Sprite({
            gameObject: this,
            src: config.src || "images/characters/people/hero.png",
        });

        this.behaviorLoop = config.behaviorLoop || [];
        this.behaviorLoopIndex = 0;

        this.talking = config.talking || [];

    }

    mount(map) {
        this.isMounted = true;
        map.addWall(this.x, this.y);

        // if theree is behavior than start after a delay

        setTimeout(() => {
            this.doBehaviorEvent(map);
        }, 10)
    }

    update(){
    }

    async doBehaviorEvent(map) {

        // dont fo anything if there is a cutgscene or nothing.
        if (map.isCutscenePlaying || this.behaviorLoop.length === 0 || this.isStanding) {
            return;
        }

        //setting  up event with relevent info.
        let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
        eventConfig.who = this.id;

        // create an event instance out of index config.
        const eventHandler = new OverworldEvent({ map, event: eventConfig});
        await eventHandler.init(); 

        // set the next event to fire
        this.behaviorLoopIndex += 1;
        if (this.behaviorLoopIndex === this.behaviorLoop.length) {
            this.behaviorLoopIndex = 0;
        }

        //go again!
        this.doBehaviorEvent(map);

    }
}