
const roundQuantity = (value, decimals = 3) => {
  const factor = 10 ** decimals;

  return (
    Math.round((value + Number.EPSILON) * factor) /
    factor
  );
};

export const calculateQuantity = ({
  unit,
  dimensions = {},
  manualQuantity = 0,
}) => {
  const {
    length = 0,
    width = 0,
    depth = 0,
  } = dimensions;

  let rawQuantity;

  switch (unit) {
    case "m3":
      rawQuantity = length * width * depth;
      break;

    case "m2":
      rawQuantity = length * width;
      break;

    case "m":
      rawQuantity = length;
      break;

    case "kg":
    case "nos":
    case "ls":
      rawQuantity = manualQuantity;
      break;

    default:
      throw new Error("Unsupported estimation unit");
  }

  const quantity = roundQuantity(rawQuantity);

  if (!Number.isFinite(quantity)) {
    throw new RangeError(
      "Calculated quantity is outside the supported range"
    );
  }

  return quantity;
};

export const calculateAmount = (quantity, rate) => {
  const amount = quantity * rate;

  if (!Number.isFinite(amount)) {
    throw new RangeError(
      "Calculated amount is outside the supported range"
    );
  }

  return amount;
};
