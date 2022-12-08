// color quantization, based on Leptonica
import getPixels from "get-pixels";
import Core from "./core";
import type { ColorArray, PaletteOptions } from "./type";
import arrayToHex from "./utils/arrayToHex";

class ColorThief extends Core {
  private getImageData(img: HTMLImageElement) {
    return new Promise<[ImageData, number]>((resolve, reject) => {
      getPixels(img, function (err: any, data: any) {
        if (err) {
          reject(err);
        } else {
          resolve([data, data.shape[0] * data.shape[1]]);
        }
      });
    });
  }

  public getPalette(
    img: HTMLImageElement,
    colorCount: number,
    opt?: PaletteOptions<"array">
  ): Promise<ColorArray[]>;

  public getPalette(
    img: HTMLImageElement,
    colorCount: number,
    opt?: PaletteOptions<"hex">
  ): Promise<string[]>;

  public getPalette(
    img: HTMLImageElement,
    colorCount = 10,
    opts?: PaletteOptions
  ) {
    return new Promise((resolve, reject) => {
      this.getImageData(img)
        .then(([imageData, pixelCount]) => {
          const palette = this._getPalette(
            imageData,
            pixelCount,
            colorCount,
            opts
          );

          if (opts?.colorType === "hex") {
            resolve(palette.map((item) => arrayToHex(item)));
          }

          resolve(palette);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  public getColor(
    img: HTMLImageElement,
    opt?: PaletteOptions<"array">
  ): Promise<ColorArray>;

  public getColor(
    img: HTMLImageElement,
    opt?: PaletteOptions<"hex">
  ): Promise<string>;

  public getColor(img: HTMLImageElement, opts?: PaletteOptions) {
    return new Promise((resolve, reject) => {
      this.getPalette(img, 5, {
        quality: opts?.quality ?? 10,
        colorType: "array",
      })
        .then((palette) => {
          if (opts?.colorType === "hex") {
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
