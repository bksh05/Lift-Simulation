const calculateMarginForLift = (numberOfFloors,floorNumber, floorHeight, liftHeight) => {
    return (numberOfFloors - floorNumber - 1)*floorHeight + ((floorHeight - liftHeight)/2+1)
}