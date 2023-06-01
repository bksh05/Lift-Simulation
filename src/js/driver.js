class Driver{
    constructor(numberOfLifts){
        this.numberOfLifts = numberOfLifts;
        this.lifts = this.createLifts(numberOfLifts);

    }

    createLifts(numberOfLifts){
        return Array.from({length: numberOfLifts}).map((_, index) => {
            return new Lift(index);
        })
    }

}