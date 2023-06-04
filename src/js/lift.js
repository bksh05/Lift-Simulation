class Lift {
  constructor(liftNumber) {
    this.liftId = `lift-${liftNumber}`;
    this.currentFloor = 0;
    this.targetFloor = -1;
    this.status = LiftStatus.STATIONARY;
    this.DOMElement = null;
    this.liftOpenStartTime = null;
  }

  updateLiftStatus = (status, targetFloor) => {
    if (status === LiftStatus.OPENING) {
      this.liftOpenStartTime = Date.now();
    } else if (status !== LiftStatus.CLOSING) {
      this.liftOpenStartTime = null;
    }

    this.status = status;
    this.targetFloor = targetFloor;
  };

  updateCurrentFloor = (currentFloor) => {
    this.currentFloor = currentFloor;
  };
}
