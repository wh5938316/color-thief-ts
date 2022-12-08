export default function arrayToHex(color: [number, number, number]) {
  const hexCode =
    "#" +
    color
      .map(function (colorCode) {
        return colorCode.toString(16).padStart(2, "0");
      })
      .join("");

  return hexCode;
}
