const calculateMarginForLift = (
  numberOfFloors,
  floorNumber,
  floorHeight,
  liftHeight
) => {
  const floorLevel = numberOfFloors - floorNumber - 1;
  return floorLevel * floorHeight + (floorHeight - liftHeight) / 2 ;
}
