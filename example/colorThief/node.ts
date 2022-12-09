// color quantization, based on Leptonica
import getPixels from "get-pixels";
import Core from "./core";
import type { ColorArray, PaletteOptions } from "./type";
import arrayToHex from "./utils/arrayToHex";

/**
 *
 * image is the path to the file.
 *  It can be
 *  - a relative path
 *  - an http url
 *  - a data url
 *  - an [in-memory Buffer](http://nodejs.org/api/buffer.html).
 *
 */
type ImageType = string | { type: string; buffer: Buffer };

class ColorThief extends Core {
  private getImageData(img: ImageType) {
    return new Promise<[ImageData, number]>((resolve, reject) => {
      if (typeof img === "string") {
        getPixels(img, function (err: any, data: any) {
          if (err) {
            reject(err);
          } else {
            resolve([data, data.shape[0] * data.shape[1]]);
          }
        });
      } else {
        getPixels(img.buffer, img.type, function (err: any, data: any) {
          if (err) {
            reject(err);
          } else {
            resolve([data, data.shape[0] * data.shape[1]]);
          }
        });
      }
    });
  }

  public getPalette(
    img: ImageType,
    colorCount: number,
    opt?: PaletteOptions<"array">
  ): Promise<ColorArray[]>;

  public getPalette(
    img: ImageType,
    colorCount: number,
    opt?: PaletteOptions<"hex">
  ): Promise<string[]>;

  public getPalette(img: ImageType, colorCount = 10, opts?: PaletteOptions) {
    const colorType = opts?.colorType ?? "hex";

    return new Promise((resolve, reject) => {
      this.getImageData(img)
        .then(([imageData, pixelCount]) => {
          const palette = this._getPalette(
            imageData,
            pixelCount,
            colorCount,
            opts
          );

          if (colorType === "hex") {
            return resolve(palette.map((item) => arrayToHex(item)));
          }

          return resolve(palette);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  public getColor(
    img: ImageType,
    opt?: PaletteOptions<"array">
  ): Promise<ColorArray>;

  public getColor(img: ImageType, opt?: PaletteOptions<"hex">): Promise<string>;

  public getColor(img: ImageType, opts?: PaletteOptions) {
    const colorType = opts?.colorType ?? "hex";

    return new Promise((resolve, reject) => {
      this.getPalette(img, 5, {
        quality: opts?.quality ?? 10,
        colorType: "array",
      })
        .then((palette) => {
          if (colorType === "hex") {
            return resolve(arrayToHex(palette[0]));
          }

          return resolve(palette[0]);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

export default ColorThief;
