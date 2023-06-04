const LiftStatus = Object.freeze({
  UP: Symbol("up"),
  DOWN: Symbol("down"),
  STATIONARY: Symbol("stationary"),
  OPENING: Symbol("opening"),
  CLOSING: Symbol("closing"),
});

const Destination = Object.freeze({
  TOWARDS_UP: Symbol("towards-up"),
  TOWARDS_DOWN: Symbol("towards-down"),
});
