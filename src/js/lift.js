 class Lift {
    constructor(liftNumber){
        this.liftId = `lift-${liftNumber}`
        this.currentFloor = 0;
        this.moving = MovingStatus.STATIONARY;   
    }
}