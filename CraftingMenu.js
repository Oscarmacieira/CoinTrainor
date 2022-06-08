class CraftingMenu {
    constructor({ coins, onComplete}) {
      this.coins = coins;
      this.onComplete = onComplete;
    }
  
    getOptions() {
      return this.coins.map(id => {
        const base = Coins[id];
        return {
          label: base.name,
          description: base.description,
          handler: () => {
            playerState.addCoin(id);
            this.close();
          }
        }
      })
    }
  
    createElement() {
      this.element = document.createElement("div");
      this.element.classList.add("CraftingMenu");
      this.element.classList.add("overlayMenu");
      this.element.innerHTML = (`
        <h2>Create a Coin</h2>
      `)
    }
  
    close() {
      this.keyboardMenu.end();
      this.element.remove();
      this.onComplete();
    }
  
  
    init(container) {
      this.createElement();
      this.keyboardMenu = new KeyboardMenu({
        descriptionContainer: container
      })
      this.keyboardMenu.init(this.element)
      this.keyboardMenu.setOptions(this.getOptions())
  
      container.appendChild(this.element);
    }
  }