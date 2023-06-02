class Driver {
    constructor(numberOfFloors, numberOfLifts, floorHeight = 100) {
        this.areLiftMoving = false;
        this.numberOfLifts = numberOfLifts;
        this.numberOfFloors = numberOfFloors
        this.floorHeight = floorHeight;
        this.liftHeight = floorHeight - 10;
        this.request = []; // TODO: Use queue to make it faster and handle more number of request.
        this.processing = new Set();
        this.lifts = this.createLifts(numberOfLifts);
    }

    createLifts(numberOfLifts) {
        return Array.from({ length: numberOfLifts }).map((_, index) => {
            return new Lift(index);
        })
    }

    addLiftRequestAtFloor(floorNumber) {
        if (this.processing.has(floorNumber)) {
            return;
        }

        this.request.push(floorNumber);
        if (!this.areLiftMoving) {
            this.areLiftMoving = true;
            window.requestAnimationFrame(this.moveLift.bind(this));
        }
    }
    


    moveLift() {
        let shouldContinue = false;
        this.lifts.forEach(lift => {
            if (lift.status === LiftStatus.STATIONARY) {
                if (this.request.length > 0) {
                    shouldContinue = true;
                    const targetFloor = this.request.shift();
                    this.processing.add(targetFloor)
                    if (lift.currentFloor > targetFloor) {
                        lift.updateLiftStatus(LiftStatus.DOWN, targetFloor);
                    }
                    else {
                        lift.updateLiftStatus(LiftStatus.UP, targetFloor);
                    }
                }
            }
            else if (lift.status === LiftStatus.UP) {
                shouldContinue = true;
                const liftDOM = document.getElementById(lift.liftId);
                const targetFloorHeight = calculateMarginForLift(this.numberOfFloors, lift.targetFloor, this.floorHeight, this.liftHeight);
                const currentMargin = liftDOM.style.marginTop;
                const currentFloorHeight = +currentMargin.substring(0, currentMargin.length - 2);


                if (targetFloorHeight < currentFloorHeight) {
                    const newMarginTop = Math.max(currentFloorHeight - (this.floorHeight / 100), targetFloorHeight);
                    liftDOM.style.marginTop = `${newMarginTop}px`;
                }
                else {
                    lift.updateCurrentFloor(lift.targetFloor);
                    this.processing.delete(lift.targetFloor)
                    lift.updateLiftStatus(LiftStatus.STATIONARY, -1)
                }
            }
            else if (lift.status === LiftStatus.DOWN) {
                shouldContinue = true;
                const liftDOM = document.getElementById(lift.liftId);
                const targetFloorHeight = calculateMarginForLift(this.numberOfFloors, lift.targetFloor, this.floorHeight, this.liftHeight);
                const currentMargin = liftDOM.style.marginTop;
                const currentFloorHeight = +currentMargin.substring(0, currentMargin.length - 2);


                if (targetFloorHeight > currentFloorHeight) {
                    const newMarginTop = Math.min(currentFloorHeight + (this.floorHeight / 100), targetFloorHeight);
                    liftDOM.style.marginTop = `${newMarginTop}px`;
                }
                else{
                    lift.updateCurrentFloor(lift.targetFloor);
                    this.processing.delete(lift.targetFloor)
                    lift.updateLiftStatus(LiftStatus.STATIONARY, -1)

                }
            }
        })

        if (shouldContinue || this.request.length > 0) {
            window.requestAnimationFrame(this.moveLift.bind(this));
        } else {
            this.areLiftMoving = false;
        }

    }

}