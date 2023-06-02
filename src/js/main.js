const root = document.querySelector('#root');
const liftInputField = document.querySelector('#lift-input--field');
const floorInputField = document.querySelector('#floor-input--field');


const formSubmitHandler = (event) => {
    event.preventDefault();
    const numberOfFLoors = +floorInputField.value;
    const numberOfLifts = +floorInputField.value;
    initLiftSimulator(numberOfFLoors, numberOfLifts)
}


const createButtonControllers = (driver,floorNumber, up = true, down = true) => {
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container')

    if (up) {
        const upButton = document.createElement('button');
        const upButtonImage = document.createElement('img');
        upButtonImage.setAttribute('src', 'images/up.svg');
        upButton.appendChild(upButtonImage);
        upButton.classList.add('up-button');
        upButton.addEventListener('click', () => {
            driver.addLiftRequestAtFloor(floorNumber)
        })
        buttonContainer.appendChild(upButton);

    }

    if (down) {
        const downButton = document.createElement('button');
        const downButtonImage = document.createElement('img');
        downButtonImage.setAttribute('src', 'images/down.svg');
        downButton.appendChild(downButtonImage);
        downButton.classList.add('down-button');
        downButton.addEventListener('click', () => {
            driver.addLiftRequestAtFloor(floorNumber)
        })
        buttonContainer.appendChild(downButton);

    }
    return buttonContainer;
}

const createFloor = (floorIndex, numberOfFloors, driver) => {
    const floorNumber = numberOfFloors - floorIndex - 1
    const floorId = `floor-${floorNumber}`;
    const floor = document.createElement('div');
    floor.classList.add('floor');
    floor.setAttribute('id', floorId);
    floor.setAttribute('data-floor-number', floorNumber)
    floor.appendChild(createButtonControllers(driver,floorNumber,floorNumber < numberOfFloors - 1, floorNumber !== 0));
    return floor;

}

const createBuilding = (numberOfFLoors, driver) => {
    root.innerHTML = "";
    const building = document.createElement('div');
    building.classList.add('building');
    Array.from({ length: numberOfFLoors }).forEach((_, index) => {
        building.appendChild(createFloor(index, numberOfFLoors, driver))
    })

    root.appendChild(building);
    return building;
}

const addLiftToBuilding = (driver, building) => {
    if (!(driver instanceof Driver)) {
        throw new Error('Invalid Lift Driver: Pass instance of Driver class');
    }

    if (!building) {
        throw new Error('Invalid building: Building does not exist');
    }

    const liftCanal = document.createElement('div');
    liftCanal.classList.add('liftCanal');


    driver.lifts.forEach(lift => {
        const liftDOM = document.createElement('div');
        liftDOM.classList.add('lift');
        liftDOM.setAttribute('id', lift.liftId)
        liftCanal.appendChild(liftDOM);
        liftDOM.innerText = lift.liftId
        liftDOM.style.marginTop = calculateMarginForLift(driver.numberOfFloors, 0, 100, 90) + 'px';
    })

    building.appendChild(liftCanal);

}

const initLiftSimulator = (numberOfFloors, numberOfLifts) => {
    const driver = new Driver(numberOfFloors, numberOfLifts);
    const building = createBuilding(numberOfFloors, driver)
    addLiftToBuilding(driver, building);
}



// Tst

initLiftSimulator(6, 2)

