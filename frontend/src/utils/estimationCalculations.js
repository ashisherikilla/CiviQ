export function calculateVolume(
  length = 0,
  width = 0,
  depth = 0
) {
  return (
    Number(length) *
    Number(width) *
    Number(depth)
  );
}

export function calculateArea(
  length = 0,
  width = 0
) {
  return (
    Number(length) *
    Number(width)
  );
}

export function calculateLength(
  length = 0
) {
  return Number(length);
}

export function calculateAmount(
  quantity = 0,
  rate = 0
) {
  return (
    Number(quantity) *
    Number(rate)
  );
}

export function roundQuantity(
  value = 0,
  decimals = 3
) {
  const factor = 10 ** decimals;

  return (
    Math.round(
      Number(value) * factor
    ) / factor
  );
}

export function calculateQuantity({
  unit,
  length = 0,
  width = 0,
  depth = 0,
  manualQuantity = 0,
}) {
  switch (unit) {
    case "m3":
      return roundQuantity(
        calculateVolume(
          length,
          width,
          depth
        )
      );

    case "m2":
      return roundQuantity(
        calculateArea(
          length,
          width
        )
      );

    case "m":
      return roundQuantity(
        calculateLength(length)
      );

    case "kg":
    case "nos":
    case "ls":
      return roundQuantity(
        manualQuantity
      );

    default:
      return 0;
  }
}