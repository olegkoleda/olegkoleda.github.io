class Player {
    constructor(firstName, lastName, email) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.score = null;
    }

    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }

    get score() {
        return this.score;
    }

    set score(newScore) {
        this.score =  newScore;
    }
}