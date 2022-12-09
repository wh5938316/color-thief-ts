export default function validateOptions(options: {
  colorCount: number;
  quality: number;
}) {
  let { colorCount, quality } = options;

  if (typeof colorCount === "undefined" || !Number.isInteger(colorCount)) {
    colorCount = 10;
  } else if (colorCount === 1) {
    throw new Error(
      "colorCount should be between 2 and 20. To get one color, call getColor() instead of getPalette()"
    );
  } else {
    colorCount = Math.max(colorCount, 2);
    colorCount = Math.min(colorCount, 20);
  }

  if (
    typeof quality === "undefined" ||
    !Number.isInteger(quality) ||
    quality < 1
  ) {
    quality = 10;
  }

  return {
    colorCount,
    quality,
  };
}
