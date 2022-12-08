export type ColorArray = [number, number, number];

export type ColorType = "array" | "hex";

export interface PaletteOptions<T extends ColorType = ColorType> {
  quality?: number;
  colorType?: T;
}
