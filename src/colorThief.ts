// color quantization, based on Leptonica
import quantize from "quantize";
import { createPixelArray, validateOptions } from "./core";
import { arrayToHex } from "./utils";

type ColorArray = [number, number, number];

/*
 *
 * Thanks
 * ------
 * Nick Rabinowitz - For creating quantize.js.
 * John Schulz - For clean up and optimization. @JFSIII
 * Nathan Spady - For adding drag and drop support to the demo page.
 *
 */

/*
  CanvasImage Class
  Class that wraps the html image element and canvas.
  It also simplifies some of the canvas context manipulation
  with a set of helper functions.
*/
class CanvasImage {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  width: number;
  height: number;

  constructor(image: HTMLImageElement) {
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.width = this.canvas.width = image.naturalWidth;
    this.height = this.canvas.height = image.naturalHeight;
    this.context.drawImage(image, 0, 0, this.width, this.height);
  }

  getImageData() {
    return this.context.getImageData(0, 0, this.width, this.height);
  }
}

class ColorThief {
  private crossOrigin: Boolean;

  constructor(opts?: { crossOrigin: boolean }) {
    this.crossOrigin = opts?.crossOrigin ?? false;
  }

  private async asyncFetchImage(imageUrl: string) {
    const imageSource = await fetch(imageUrl, {
      method: "GET",
      headers: this.crossOrigin
        ? { "Access-Control-Allow-Origin": "*" }
        : undefined,
    })
      .then(function (response) {
        // Check if the request was successful
        if (response.ok) {
          // Convert the response to a blob (binary data)
          return response.blob();
        }

        return null;
      })
      .then(function (blob) {
        // Create an image element from the blob data
        const img = document.createElement("img");
        img.src = URL.createObjectURL(blob as Blob);
        return img;
      })
      .catch(function (error) {
        // Handle any errors
        return null;
      });

    return new Promise<HTMLImageElement | null>((resolve, _reject) => {
      if (imageSource === null) {
        return resolve(imageSource);
      }

      imageSource.onload = function () {
        resolve(imageSource);
      };
    });
  }

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
  public getPalette(
    sourceImage: HTMLImageElement,
    colorCount: number,
    quality: number,
    colorType: "array"
  ): ColorArray[];

  public getPalette(
    sourceImage: HTMLImageElement,
    colorCount: number,
    quality: number,
    colorType: "hex"
  ): string[];

  public getPalette(
    sourceImage: HTMLImageElement,
    colorCount: number,
    quality: number = 10,
    colorType: "array" | "hex" = "hex"
  ) {
    const options = validateOptions({
      colorCount,
      quality,
    });

    // Create custom CanvasImage object
    const image = new CanvasImage(sourceImage);
    const imageData = image.getImageData();
    const pixelCount = image.width * image.height;

    const pixelArray = createPixelArray(
      imageData.data,
      pixelCount,
      options.quality
    );

    // Send array to quantize function which clusters values
    // using median cut algorithm
    const cmap = quantize(pixelArray, options.colorCount);
    const palette = cmap ? (cmap.palette() as ColorArray[]) : [];

    if (colorType === "hex") {
      return palette.map((item) => arrayToHex(item));
    }

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
  public getColor(
    sourceImage: HTMLImageElement,
    quality = 10,
    colorType: "array" | "hex" = "hex"
  ) {
    const palette = this.getPalette(sourceImage, 5, quality, "array");
    const dominantColor = palette?.[0] ?? null;

    if (dominantColor === null) {
      return dominantColor;
    }

    if (colorType === "hex") {
      return arrayToHex(dominantColor);
    }

    return dominantColor;
  }

  public getPaletteAsync(
    imageUrl: string,
    colorCount: number,
    quality: number,
    colorType: "array"
  ): Promise<ColorArray[]>;

  public getPaletteAsync(
    imageUrl: string,
    colorCount: number,
    quality: number,
    colorType: "hex"
  ): Promise<string[]>;

  public getPaletteAsync(
    imageUrl: string,
    colorCount: number,
    quality: number,
    colorType: "array" | "hex" = "hex"
  ) {
    return this.asyncFetchImage(imageUrl).then((sourceImage) => {
      if (sourceImage === null) {
        return { dominantColor: null, palette: [], image: sourceImage };
      }

      const palette = this.getPalette(
        sourceImage,
        colorCount,
        quality,
        "array"
      );

      if (palette === null) {
        return { dominantColor: null, palette: [], image: sourceImage };
      }

      if (colorType === "hex") {
        return palette.map((item) => arrayToHex(item));
      }

      return palette;
    });
  }

  public getColorAsync(
    imageUrl: string,
    quality: number,
    colorType: "array"
  ): Promise<ColorArray>;

  public getColorAsync(
    imageUrl: string,
    quality: number,
    colorType: "hex"
  ): Promise<string>;

  public getColorAsync(
    imageUrl: string,
    quality: number = 10,
    colorType: "array" | "hex" = "hex"
  ) {
    return this.asyncFetchImage(imageUrl).then((sourceImage) => {
      if (sourceImage === null) {
        return { dominantColor: null, palette: [], image: sourceImage };
      }

      const palette = this.getPalette(sourceImage, 5, quality, "array");

      if (palette === null) {
        return { dominantColor: null, palette: [], image: sourceImage };
      }

      const dominantColor = palette[0];

      if (colorType === "hex") {
        return arrayToHex(dominantColor);
      }

      return dominantColor;
    });
  }
}

export default ColorThief;
