class Controller {
    constructor(clickHandler) {
        this.deck = new Deck(4);
        this.deck.draw();
        this.deck.setCardClickHandler(clickHandler);
        //open CARDS
        this.moves = 0;
        this.openCards = [];
        this.setHandlers();
    }

    setHandlers() {
        const restart = document.querySelector(".restart");
        restart.addEventListener("click", function() {
            that.resetGame();
        }, false);

        /// restart after modal
    }

    updateMoves() {
        const moves = document.querySelector(".moves");
        moves.textContent = this.moves;
    }

    incMoves() {
        this.moves++;
    }

    startNewGame() {
        //// add
    }

    resetGame() {
        this.deck.reset();
        this.deck.draw();
        this.openCards = [];
        //add timer;
    }

    checkWon() {
        let won = true;
        this.deck.cards.forEach(function(card) {
            if (card.status === CardStatus.CLOSE) {
                hasWon = false;
            }
        });
        return won;
    }
//add show congrats

}