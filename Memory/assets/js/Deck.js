class Deck {
    constructor(dimension) {
        this.dimension = dimension;
        this.cards = [];
        this.icons = makeIconsArray();
        for (let index = 0; index < this.dimension * 2; index++) {
            let cardId = index + "";
            this.cards.push(new Card(cardId, this.icons[i]));
            
        }
    }

    draw() {
        let deck =document.querySelector(".deck");
        deck.innerHTML = "";
        this.cards.forEach(card => deck.appendChild(card.render));
    }

    reset() {
        this.icons = makeIconsArray();
        this.cards = [];
        for (let index = 0; index < this.dimension * 2; index++) {
            let cardId = index + "";
            this.cards.push(new Card(cardId, this.icons[i]));
        }
    }

    closeCards() {
        this.cards.forEach(card => card.close());
    }

    setCardClickHandler(clickHandler) {
        this.cards.forEach(card => card.addClickHandler(clickHandler));
    }

}