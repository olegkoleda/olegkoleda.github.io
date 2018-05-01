const CardState = {
    OPEN: 'open',
    MATCH: 'match',
    UNMATCH: 'unmatch',
    CLOSE: 'close'
};
Object.freeze(CardState);

class Card {
    constructor(id, icon, shirt) {
        this.id = id;
        this.icon = icon;
        this.status = CardState.CLOSE;
        this.shirt = shirt;
        this.render = (function () {
            const divContainer = document.createElement('div');
            const divFlipper = document.createElement('div');
            const divFront = document.createElement('div');
            const divBack = document.createElement('div');
            const i = document.createElement('i');
            divContainer.classList.add('flip-container');
            divContainer.id = id;
            divFlipper.classList.add('flipper');
            divFront.classList.add('front');
            divFront.classList.add(shirt);
            divBack.classList.add('back');
            i.classList.add('fab', icon);
            divBack.appendChild(i);
            divFlipper.appendChild(divBack);
            divFlipper.appendChild(divFront);
            divContainer.appendChild(divFlipper);
            return divContainer;
        })();
    }

    isClicable(){
        return this.status === CardState.CLOSE;
    }
    // Match cards
    isMatched(someCard){
        return this.icon === someCard.icon; 
    }
    // Show card ???
    show() {
        const divContainer = document.getElementById(this.id);
        divContainer.classList.add('flip');
        this.status = CardState.OPEN;
    }
    // Close card ???
    close() {
        const divContainer = document.getElementById(this.id);
        divContainer.classList.remove('flip');
        this.status = CardState.CLOSE;
    }

    hide() {
        const divContainer = document.getElementById(this.id);
        divContainer.classList.add('hide');
        this.status = CardState.MATCH;
    }

    changeShirt(newShirt) {
        const divContainer = document.getElementById(this.id).firstElementChild.lastElementChild;
        divContainer.classList.remove(this.shirt);
        divContainer.classList.add(newShirt);
        this.shirt = newShirt;
    }

    addClickHandler(clickHandler) {
        const divContainer = document.getElementById(this.id);
        divContainer.onclick = clickHandler;
    }
}

// Shuffle function from http://stackoverflow.com/a/2450976
var shuffle = function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// array of icons fas
var makeIconsArray = function makeIconsArray(count) {
    const iconsArray = [
        'fa-android',
        'fa-apple',
        'fa-angular',
        'fa-bitcoin',
        'fa-bluetooth',
        'fa-codepen',
        'fa-css3-alt',
        'fa-discord',
        'fa-drupal',
        'fa-earlybirds',
        'fa-edge',
        'fa-firefox',
        'fa-facebook-f',
        'fa-fort-awesome',
        'fa-fly',
        'fa-freebsd',
        'fa-github-alt',
        'fa-google',
        'fa-gitkraken',
        'fa-grunt'
    ];
    let cloneSymbolsArray = iconsArray.slice(0, count);
    return shuffle(iconsArray.slice(0, count).concat(cloneSymbolsArray)); // x2
}

var storeScore = function (fullName, score) {
    let oldScore = JSON.parse(localStorage.getItem("score")) || [];
    oldScore.push([fullName, score]);
    oldScore.sort((a, b) => b[1] - a[1]);
    let result = JSON.stringify(oldScore.slice(0, 9));
    localStorage.setItem("score", result);
}

var getScore = function () {
    return JSON.parse(localStorage.getItem("score"));
}

//*******CLASS DECK */
class Deck {
    constructor(dimension, shirt) {
        this.dimension = dimension;
        this.cards = [];
        this.shirt = shirt;
        this.icons = makeIconsArray(this.dimension);
        for (let index = 0; index < this.dimension * 2; index++) {
            let cardId = index + "";
            this.cards.push(new Card(cardId, this.icons[index], this.shirt));
        }
    }

    draw() {
        let deck = document.querySelector(".deck");
        deck.innerHTML = "";
        this.cards.forEach(card => deck.appendChild(card.render));
    }

    reset() {
        this.icons = makeIconsArray(this.dimension);
        this.cards = [];
        for (let index = 0; index < this.dimension * 2; index++) {
            let cardId = index + "";
            this.cards.push(new Card(cardId, this.icons[index], this.shirt));
        }
    }

    closeCards() {
        this.cards.forEach(card => card.close());
    }

    setCardClickHandler(clickHandler) {
        this.cards.forEach(card => card.addClickHandler(clickHandler));
    }
}

    // Class Timer

class Timer {
    constructor(el) {
        this.timeValue = '';
        this.el = el;
        this.running = false;
        this.intervalID = null;
    }

    start() {
        if (!this.running){
            this.running = true;
            this.beginTime = new Date().getTime();
        // use bind(this) to change the context of setInterval
            this.intervalID = setInterval(this.update.bind(this), 1000);  }   
    }

    stop() {
        if (this.running) {
            this.endTime = new Date().getTime();
            this.update();
            clearInterval(this.intervalID);}
    }

    getElapsedTime() {
        this.currentTime = new Date().getTime();
        return this.currentTime - this.beginTime; // calculate time elapsed
    }

    reset() {
        this.timeValue = '';
        this.el.textContent = '';
        if (this.intervalID) clearInterval(this.intervalID);
    }

    getDuration() {
        return this.timeValue;
    }

    update() {
        this.currentTime = new Date().getTime();
        this.timeValue = ''; // reset
        
        const duration = this.currentTime - this.beginTime; // calculate time elapsed
        const hh = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // 0 ~ 23
        const mm = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60)); // 0 ~ 59
        const ss = Math.floor((duration % (1000 * 60)) / 1000); // 0 ~ 59
        
        if (hh) this.timeValue = hh + ` hours `;
        if (mm) this.timeValue = mm + ` mins `;
        this.timeValue += (ss < 10 ? ('0' + ss) : ss) + ' sec';
        
        this.el.textContent = this.timeValue;
    }
}

// class Player

class Player {
    constructor(firstName, lastName, email) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        localStorage.setItem(this.email, this.getfullName());
    }
    getfullName() {
         return `${this.firstName} ${this.lastName}`;
    }
}

// class CONTROLLER
class Controller {
    constructor(clickHandler) {
        this.deck = new Deck(6, "bg-0");
        this.deck.draw();
        this.deck.setCardClickHandler(clickHandler);
        //open CARDS
        this.moves = 0;
        this.openCards = [];
        this.player = null;
        this.setHandlers();
        const timerElement = document.querySelector(".timer");
        this.timer = new Timer(timerElement);
    }

    setHandlers() {
        let that = this;
        // register Player
        const register = document.querySelector("#start");
        const restart = document.querySelector(".restart");
        const restartModal = document.querySelector(".restart-modal");
        //complexity
        const easy = document.querySelector(".easy");
        const medium = document.querySelector(".medium");
        const hard = document.querySelector(".hard");
        //shirts
        const shirt0 = document.querySelector(".bg-0");
        const shirt1 = document.querySelector(".bg-1");
        const shirt2 = document.querySelector(".bg-2");
        //player
        const player = document.querySelector(".player");
        //get show Scoreboard
        const scoreBoard = document.querySelector(".score");
        const scoreBoardClose = document.querySelector("#close-score");

        // //register button
        register.addEventListener("click", function(e) {
            const form = document.querySelector("form");
            e.preventDefault();
            if (form.checkValidity()) {
            that.registerPlayer();}

        }, false);

        //restart button
        restart.addEventListener("click", function() {
            that.resetGame();
        }, false);

        //restart in modal-button
        restartModal.addEventListener("click", function() {
            that.resetGameModal();
        }, false);

        // change complexity
        easy.addEventListener("click", function() {
            that.setComplexity(4);
        }, false);

        medium.addEventListener("click", function() {
            that.setComplexity(6);
        }, false);

        hard.addEventListener("click", function() {
            that.setComplexity(8);
        }, false);

         // change shirt
         shirt0.addEventListener("click", function() {
            that.setCardsShirt("bg-0");
        }, false);
        shirt1.addEventListener("click", function() {
            that.setCardsShirt("bg-1");
        }, false);
        shirt2.addEventListener("click", function() {
            that.setCardsShirt("bg-2");
        }, false);

        //cange player
        player.addEventListener("click", function() {
            that.showRules();
        }, false);

        scoreBoard.addEventListener("click", function() {
            that.showScore();
        }, false);

        scoreBoardClose.addEventListener("click", function() {
            console.log("work here");
            that.hideScore();
        }, false);
    }

    registerPlayer() {
        console.log(
            "e boy "
        );
        const  firstName = document.querySelector("#firstName");
        const  lastName = document.querySelector("#lastName");
        const  email = document.querySelector("#email");
        this.player = new Player(firstName.value, lastName.value, email.value);
        this.updatePlayer();
        this.hideRules();
    }

    updateMoves() {
        const moves = document.querySelector(".moves");
        moves.textContent = this.moves;
    }

    updatePlayer() {
        const player = document.querySelector(".player");
        player.innerHTML = this.player.getfullName();
    }

    incMoves() {
        this.moves++;
    }

    startNewGame() {
        //// add
    }

    resetGame() {
        this.timer.stop();
        const timerElement = document.querySelector(".timer");  
        timerElement.innerHTML = "0 sec";
        this.timer = new Timer(timerElement);
        this.deck.reset();
        this.deck.draw();
        this.deck.setCardClickHandler(clickHandler);
        this.openCards = [];
        this.moves = 0;
        this.updateMoves();
    }

    resetGameModal() {
        this.hideCongrats();
        this.resetGame();
    }

    checkWon() {
        let won = true;
        this.deck.cards.forEach(function(card) {
            if (card.status === CardState.CLOSE) {
                won = false;
            }
        });
        return won;
    }

    setComplexity(newCoplex) {
        this.timer.stop();
        const timerElement = document.querySelector(".timer");  
        timerElement.innerHTML = "0 sec";
        this.deck = new Deck(newCoplex, this.deck.shirt);
        this.deck.dimension = newCoplex;
        this.resetGame();
    }

    setCardsShirt(newShirt) {
        this.deck.cards.forEach(card => card.changeShirt(newShirt));
        this.deck.shirt = newShirt; 
    }

    //add hide rules  
    hideRules() {
        const rulesModal = document.querySelector(".modal-rules");
        rulesModal.classList.add("hide-modal"); 
    }

    showRules() {
        const rulesModal = document.querySelector(".modal-rules");
        rulesModal.classList.remove("hide-modal"); 
        
    }

    //add show congrats
    showCongrats(playTime, playMoves, playScore) {
        const congratsModal = document.querySelector(".modal-congrats"); 
        congratsModal.querySelector("p").innerHTML =
        `You win in ${playTime} with ${playMoves} moves!
        SCORE: ${playScore}!!!`;
        congratsModal.classList.remove("hide-modal"); 
        congratsModal.classList.add("show"); 
    }

    hideCongrats() {
        const congratsModal = document.querySelector(".modal-congrats");
        congratsModal.classList.add("hide-modal"); 
    }

    // show and hide scoreboard
    hideScore() {
        const scoreBoard = document.querySelector(".modal-score");
        scoreBoard.classList.add("hide-modal"); 
    }

    showScore() {
        const scoreBoard = document.querySelector(".modal-score");
        
        scoreBoard.classList.remove("hide-modal"); 
        scoreBoard.classList.add("show"); 
        
    }
}


// handler for CARDS

function clickHandler(event) {
    const div = event.target.parentElement.parentElement;
    const card = controller.deck.cards[div.id];

    if (card.isClicable() && controller.openCards.length !== 2) {
        if(!controller.timer.getDuration()){
            controller.timer.start();
        }
        card.show();

        //check if openCards is empty
        if (!controller.openCards.length) {
            controller.openCards.push(card);
        }
        // else check two cards
        else {
            controller.incMoves();
            controller.updateMoves();
            controller.openCards.push(card);
            const firstCard = controller.openCards[0];

            //not match
            if (!card.isMatched(firstCard)) {
                setTimeout(function() {
                    card.close();
                    firstCard.close();
                    controller.openCards = [];
                }, 600);
            }
            // get matched
            else {
                card.hide();
                firstCard.hide();
                controller.openCards = [];
                if (controller.checkWon()) {
                    controller.timer.stop();
                    const score = Math.floor((controller.deck.dimension / controller.moves ) * 1000) / 10;
                    controller.showCongrats(controller.timer.getDuration(), controller.moves, score);
                    storeScore(controller.player.getfullName(), score);
                    console.log(controller.timer.getElapsedTime());
                    console.log(controller.moves);
                    console.log(`VIKA ${controller.player.getfullName()} score ${score}`);
                }
            }
        }
    } else {
        console.log("card not clickable");
    }
}

const controller = new Controller(clickHandler);