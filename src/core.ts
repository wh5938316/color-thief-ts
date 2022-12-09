// color quantization, based on Leptonica
import quantize from "quantize";
import createPixelArray from "./utils/createPixelArray";
import validateOptions from "./utils/validateOptions";

type ColorArray = [number, number, number];

type ColorType = "array" | "hex";

interface PaletteOptions<T extends ColorType = ColorType> {
  quality?: number;
  colorType?: T;
}

/**
 *
 * quality is an optional argument. It needs to be an integer. 1 is the highest quality settings.
 * 10 is the default. There is a trade-off between quality and speed. The bigger the number, the
 * faster the palette generation but the greater the likelihood that colors will be missed.
 *
 */
const DEFAULT_QUALITY = 10;

/*
 *
 * Thanks
 * ------
 * Nick Rabinowitz - For creating quantize.js.
 * John Schulz - For clean up and optimization. @JFSIII
 * Nathan Spady - For adding drag and drop support to the demo page.
 *
 */

class ColorThief {
  /*
   * getPalette(sourceImage[, colorCount, quality])
   * returns array[ {r: num, g: num, b: num}, {r: num, g: num, b: num}, ...]
   *
   * Use the median cut algorithm provided by quantize.js to cluster similar colors.
   *
   * colorCount determines the size of the palette; the number of colors returned. If not set, it
   * defaults to 10.
   *
   * quality is an optional argument. It needs to be an integer. 1 is the highest quality settings.
   * 10 is the default. There is a trade-off between quality and speed. The bigger the number, the
   * faster the palette generation but the greater the likelihood that colors will be missed.
   *
   *
   */
  protected _getPalette(
    imageData: ImageData,
    pixelCount: number,
    colorCount: number,
    opts?: PaletteOptions
  ) {
    const colorType = opts?.colorType ?? "hex";

    const options = validateOptions({
      colorCount,
      quality: opts?.quality ?? DEFAULT_QUALITY,
    });

    const pixelArray = createPixelArray(
      imageData.data,
      pixelCount,
      options.quality
    );

    // Send array to quantize function which clusters values
    // using median cut algorithm
    const cmap = quantize(pixelArray, options.colorCount);
    const palette = cmap ? (cmap.palette() as ColorArray[]) : [];

    return palette;
  }

  /*
   * getColor(sourceImage[, quality])
   * returns {r: num, g: num, b: num}
   *
   * Use the median cut algorithm provided by quantize.js to cluster similar
   * colors and return the base color from the largest cluster.
   *
   * Quality is an optional argument. It needs to be an integer. 1 is the highest quality settings.
   * 10 is the default. There is a trade-off between quality and speed. The bigger the number, the
   * faster a color will be returned but the greater the likelihood that it will not be the visually
   * most dominant color.
   *
   * */
  protected _getColor(
    imageData: ImageData,
    pixelCount: number,
    opts?: PaletteOptions
  ) {
    const colorType = opts?.colorType ?? "hex";

    const palette = this._getPalette(imageData, pixelCount, 5, {
      quality: opts?.quality ?? DEFAULT_QUALITY,
      colorType: "array",
    });
    const dominantColor = palette?.[0] ?? null;

    if (dominantColor === null) {
      return dominantColor;
    }
    return dominantColor;
  }
}

export default ColorThief;
