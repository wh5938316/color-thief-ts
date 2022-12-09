# Color Thief

Grab the color palette from an image using just Javascript.Works in the browser & node.

## Getting Started

### install
```
yarn add color-thief-ts
```
or
```
npm install color-thief-ts
```

### example for browser

``` typescript
import ColorThief from "color-thief-ts";

const colorThief = new ColorThief();
const dominantColor = await colorThief.getColorAsync("your-domaon/your-image-url.jpg");
const palette = await colorThief.getPaletteAsync("your-domaon/your-image-url.jpg", 5);

console.log(dominantColor);
console.log(palette);
```

### example for node.js

``` typescript
import ColorThief from "color-thief-ts/node";

const colorThief = new ColorThief();
const dominantColor = await colorThief.getColor("your-domaon/your-image-url.jpg");
const palette = await colorThief.getPaletteAsync("your-domaon/your-image-url.jpg", 5);

console.log(dominantColor);
console.log(palette);
```

