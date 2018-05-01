const CardState = {
    OPEN: 'open',
    MATCH: 'match',
    UNMATCH: 'unmatch',
    CLOSE: 'close'
};
Object.freeze(CardState);

class Card {
    constructor(id, icon) {
        this.id = id;
        this.icon = icon;
        this.status = CardState.CLOSE;
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
            divBack.classList.add('back');
            i.classList.add('fas', icon);
            divBack.appendChild(i);
            divFlipper.appendChild(divBack);
            divFlipper.appendChild(divFront);
            divContainer.appendChild(divFlipper);
            return divContainer;
        })();
    }

    isClicable(){
        return this.status === CardState.CLOSE; // !!!! OPEN
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

    addClickHandler(clickHandler) {
        const divContainer = document.getElementById(this.id);
        divContainer.onclick = clickHandler;
    }

    //set status ____ getAnimatedName

}
export default Card;