window.BattleAnimations = {
    async spin(event, onComplete) {
      const element = event.caster.coinElement;
      const animationClassName = event.caster.team === "player" ? "battle-spin-right" : "battle-spin-left";
      element.classList.add(animationClassName);
  
      //Remove class when animation is fully complete
      element.addEventListener("animationend", () => {
        element.classList.remove(animationClassName);
      }, { once:true });
  
      //Continue battle cycle right around when the coin collide
      await utils.wait(100);
      onComplete();
    },
    
    async liquidityAttr(event, onComplete) {
        const element = event.caster.coinElement;
        const animationClassName = event.caster.team === "player" ? "battle-liquidityAttr" : "battle-liquidityAttr";
        element.classList.add(animationClassName);
    
        //Remove class when animation is fully complete
        element.addEventListener("animationend", () => {
          element.classList.remove(animationClassName);
        }, { once:true });
    
        //Continue battle cycle right around when the coin collide
        await utils.wait(100);
        onComplete();
      },

    async fud(event, onComplete) {
        const {caster} = event;
        let div = document.createElement("div");
        div.classList.add("fud-orb");
        div.classList.add(caster.team === "player" ? "battle-fud-right" : "battle-fud-left");
    
        div.innerHTML = (`
          <svg viewBox="0 0 32 32" width="32" height="32">
          <text x="1" y="45" fill="${event.color}">FUD</text>
            <text x="1" y="30" fill="${event.color}">FUD</text>
            <text x="1" y="15" fill="${event.color}">FUD</text>
          </svg>
        `);
    
        //Remove class when animation is fully complete
        div.addEventListener("animationend", () => {
          div.remove();
        });
    
        //Add to scene
        document.querySelector(".Battle").appendChild(div);
    
        await utils.wait(820);
        onComplete();
      }
  }