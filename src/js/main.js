const root = document.querySelector('#root');
const liftInputField = document.querySelector('#lift-input--field');
const floorInputField = document.querySelector('#floor-input--field');


const formSubmitHandler = (event) => {
    event.preventDefault();
    const numberOfFLoors = +floorInputField.value;
    const numberOfLifts = +floorInputField.value;
    initLiftSimulator(numberOfFLoors, numberOfLifts)

}


const createButtonControllers = (up = true, down = true) => {
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container')

    if (up) {
        const upButton = document.createElement('button');
        const upButtonImage = document.createElement('img');
        upButtonImage.setAttribute('src', 'images/up.svg');
        upButton.appendChild(upButtonImage);
        upButton.classList.add('up-button');
        buttonContainer.appendChild(upButton);

    }

    if (down) {
        const downButton = document.createElement('button');
        const downButtonImage = document.createElement('img');
        downButtonImage.setAttribute('src', 'images/down.svg');
        downButton.appendChild(downButtonImage);
        downButton.classList.add('down-button');
        buttonContainer.appendChild(downButton);

    }
    return buttonContainer;
}

const createFloor = (floorNumber, numberOfFLoors) => {
    const floor = document.createElement('div');
    floor.classList.add('floor');
    floor.appendChild(createButtonControllers(floorNumber < numberOfFLoors - 1, floorNumber !== 0));
    return floor;

}

const createBuilding = (numberOfFLoors) => {
    root.innerHTML = "";
    const building = document.createElement('div');
    building.classList.add('building');
    Array.from({ length: numberOfFLoors }).forEach((_, index) => {
        building.appendChild(createFloor(index, numberOfFLoors))
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
        const liftDOMElement = document.createElement('div');
        liftDOMElement.classList.add('lift');
        liftCanal.appendChild(liftDOMElement);
        liftDOMElement.innerText=  lift.liftId

    })

    building.appendChild(liftCanal);

}

const initLiftSimulator = (numberOfFLoors, numberOfLifts) => {
    const building = createBuilding(numberOfFLoors)
    const driver = new Driver(numberOfLifts);
    addLiftToBuilding(driver, building);
}



// Tst

initLiftSimulator(5, 2)

