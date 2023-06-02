 class Lift {
    constructor(liftNumber){
        this.liftId = `lift-${liftNumber}`
        this.currentFloor = 0;
        this.targetFloor = -1;
        this.status = LiftStatus.STATIONARY;   
    }

    updateLiftStatus = (status, targetFloor) => {
        this.status = status;
        this.targetFloor = targetFloor
    }

    updateCurrentFloor = (currentFloor) => {
        this.currentFloor = currentFloor;
    }
}