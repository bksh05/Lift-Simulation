class Driver {
  constructor(
    numberOfFloors,
    numberOfLifts,
    floorWidth,
    floorHeight = 100,
    liftWidth = 70
  ) {
    this.areLiftMoving = false;
    this.numberOfLifts = numberOfLifts;
    this.numberOfFloors = numberOfFloors;
    this.floorHeight = Math.min(floorHeight, 100);
    this.floorWidth = floorWidth;
    this.liftHeight = this.floorHeight - 10;
    this.liftWidth = Math.min(liftWidth, 70);
    this.request = []; // TODO: Use queue to make it faster and handle more number of request.
    this.processing = new Set();
    this.lifts = [];
  }

  createBuilding(root) {

    const building = document.createElement("div");
    building.classList.add("building");
    Array.from({ length: this.numberOfFloors }).forEach((_, index) => {
     
      building.appendChild(this.createFloor(index));

    });
    const liftCanal = this.createLifts();
    building.appendChild(liftCanal);
    root.appendChild(building);
  }

  createFloor(floorIndex) {
    const floorNumber = this.numberOfFloors - floorIndex - 1;
    const floorId = `floor-${floorNumber}`;
    const floor = document.createElement("div");
    floor.classList.add("floor");
    floor.setAttribute("id", floorId);
    floor.setAttribute("data-floor-number", floorNumber);
    floor.style.height = `${this.floorHeight}px`;
    floor.appendChild(this.createButtonControllers(floorNumber));
    return floor;
  }

  createButtonControllers(floorNumber) {
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    if (floorNumber < this.numberOfFloors - 1) {
      const upButton = document.createElement("button");
      const upButtonImage = document.createElement("img");
      upButtonImage.setAttribute("src", "images/up.svg");
      upButton.appendChild(upButtonImage);
      upButton.classList.add("up-button");
      upButton.addEventListener("click", () => {
        this.addLiftRequestAtFloor(floorNumber);
      });
      buttonContainer.appendChild(upButton);
    }

    if (floorNumber !== 0) {
      const downButton = document.createElement("button");
      const downButtonImage = document.createElement("img");
      downButtonImage.setAttribute("src", "images/down.svg");
      downButton.appendChild(downButtonImage);
      downButton.classList.add("down-button");
      downButton.addEventListener("click", () => {
        this.addLiftRequestAtFloor(floorNumber);
      });
      buttonContainer.appendChild(downButton);
    }
    return buttonContainer;
  }

  createLifts() {
    const liftCanal = document.createElement("div");
    liftCanal.classList.add("liftCanal");

    this.lifts = Array.from({ length: this.numberOfLifts }).map((_, index) => {
      const lift = new Lift(index);
      const liftDOM = document.createElement("div");
      liftDOM.classList.add("lift");
      liftDOM.setAttribute("id", lift.liftId);
      liftDOM.style.width = `${this.liftWidth}px`;
      liftDOM.style.height = `${this.liftHeight}px`;
      liftDOM.style.marginTop =
        calculateMarginForLift(
          this.numberOfFloors,
          0,
          this.floorHeight,
          this.liftHeight
        ) + "px";
      lift.DOMElement = liftDOM;
      liftCanal.appendChild(liftDOM);
      return lift;
    });

    return liftCanal;
  }

  addLiftRequestAtFloor(floorNumber) {
    if (this.processing.has(floorNumber) || this.request.findIndex(fn => fn === floorNumber) > -1) {
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
    this.lifts.forEach((lift) => {
      if (lift.status === LiftStatus.STATIONARY) {
        if (this.request.length > 0) {
          shouldContinue = true;
          const targetFloor = this.request.shift();
          this.processing.add(targetFloor);
          if (lift.currentFloor > targetFloor) {
            lift.updateLiftStatus(LiftStatus.DOWN, targetFloor);
          } else {
            lift.updateLiftStatus(LiftStatus.UP, targetFloor);
          }
        }
      } else if (lift.status === LiftStatus.UP) {
        shouldContinue = true;
        const liftDOM = lift.DOMElement;
        const targetFloorHeight = calculateMarginForLift(
          this.numberOfFloors,
          lift.targetFloor,
          this.floorHeight,
          this.liftHeight
        );
        const currentMargin = liftDOM.style.marginTop;
        const currentFloorHeight = +currentMargin.substring(
          0,
          currentMargin.length - 2
        );

        if (+targetFloorHeight.toFixed(3) < +currentFloorHeight.toFixed(3)) {
          const newMarginTop = Math.max(
            currentFloorHeight - this.floorHeight / 100,
            targetFloorHeight
          );
          liftDOM.style.marginTop = `${newMarginTop}px`;
        } else {
          lift.updateCurrentFloor(lift.targetFloor);
          lift.updateLiftStatus(LiftStatus.OPENING, lift.targetFloor);
        }
      } else if (lift.status === LiftStatus.DOWN) {
        shouldContinue = true;
        const liftDOM = lift.DOMElement;
        const targetFloorHeight = calculateMarginForLift(
          this.numberOfFloors,
          lift.targetFloor,
          this.floorHeight,
          this.liftHeight
        );
        const currentMargin = liftDOM.style.marginTop;
        const currentFloorHeight = +currentMargin.substring(
          0,
          currentMargin.length - 2
        );

        if (+targetFloorHeight.toFixed(3) > +currentFloorHeight.toFixed(3)) {
          const newMarginTop = Math.min(
            currentFloorHeight + this.floorHeight / 100,
            targetFloorHeight
          );
          liftDOM.style.marginTop = `${newMarginTop}px`;
        } else {
          lift.updateCurrentFloor(lift.targetFloor);
          lift.updateLiftStatus(LiftStatus.OPENING, lift.targetFloor);
        }
      } else if (lift.status === LiftStatus.OPENING) {
        shouldContinue = true;
        const liftDOM = lift.DOMElement;
        liftDOM.classList.add("lift--open");

        if (Date.now() - lift.liftOpenStartTime >= 2500) {
          lift.updateLiftStatus(LiftStatus.CLOSING, lift.targetFloor);
        }
      } else if (lift.status === LiftStatus.CLOSING) {
        shouldContinue = true;
        const liftDOM = lift.DOMElement;
        liftDOM.classList.remove("lift--open");

        if (Date.now() - lift.liftOpenStartTime >= 5000) {
          this.processing.delete(lift.targetFloor);
          lift.updateLiftStatus(LiftStatus.STATIONARY, -1);
        }
      }
    });

    if (shouldContinue || this.request.length > 0) {
      window.requestAnimationFrame(this.moveLift.bind(this));
    } else {
      this.areLiftMoving = false;
    }
  }
}
