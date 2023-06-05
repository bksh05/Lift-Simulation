const root = document.querySelector("#root");
const liftInputField = document.querySelector("#lift-input--field");
const floorInputField = document.querySelector("#floor-input--field");
const rootWidth = root.offsetWidth - 16 * 2; //padding: 16px,
const rootHeight = root.offsetHeight - 16 * 2 - 48; //padding: 16px, backButtonHeight: 48px;

const formSubmitHandler = (event) => {
  event.preventDefault();
  const numberOfFloors = +floorInputField.value;
  const numberOfLifts = +liftInputField.value;

  if (!numberOfFloors || !numberOfLifts) {
    alert(
      `We can not create building with ${numberOfFloors} floors and ${numberOfLifts} lifts.`
    );
    return;
  }

  if (numberOfLifts > numberOfFloors) {
    alert(
      `We do not add lifts more than floor. It's a waste of resources. Plan better!`
    );
    return;
  }

  const floorHeight = rootHeight / numberOfFloors;
  const liftWidth = (rootWidth - 100 - 16 * numberOfLifts) / numberOfLifts; // gap between lift 16
  if (floorHeight < 40) {
    alert(
      `Your screen height does not support ${numberOfFloors} floors. Please try less floors`
    );
    return;
  }

  if (liftWidth < 40) {
    alert(
      `Your screen width does not support ${numberOfLifts} lifts. Please try less lifts`
    );
    return;
  }
  initLiftSimulator(
    numberOfFloors,
    numberOfLifts,
    floorHeight,
    rootWidth,
    liftWidth
  );
};

const initLiftSimulator = (
  numberOfFloors,
  numberOfLifts,
  floorHeight,
  floorWidth,
  liftWidth
) => {
  const driver = new Driver(
    numberOfFloors,
    numberOfLifts,
    floorWidth,
    floorHeight,
    liftWidth
  );
  const backButton = document.createElement('button');
  backButton.innerText = "Back";
  backButton.classList.add('back-button');
  backButton.addEventListener('click', () => {
    window.location.reload();
  })
  root.innerHTML = "";
  root.appendChild(backButton);
  driver.createBuilding(root);
};
