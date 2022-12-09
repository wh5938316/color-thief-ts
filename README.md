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

``` javascript
import ColorThief from "color-thief-ts";

const colorThief = new ColorThief();
const dominantColor = await colorThief.getColorAsync("your-domaon/your-image-url.jpg");
const palette = await colorThief.getPaletteAsync("your-domaon/your-image-url.jpg", 5);

console.log(dominantColor);
console.log(palette);
```

### example for node.js

``` javascript
import ColorThief from "color-thief-ts/node";
import fetch from "node-fetch";
import Sharp from "sharp";

const colorThief = new ColorThief();

const image = await fetch("http://localhost:3000/images/example.png")
  .then((res) => res.arrayBuffer())
  .then((arrayBuffer) => Buffer.from(arrayBuffer));

const palette1 = await colorThief.getPalette(
  { type: "image/png", buffer: image },
  5
);

const palette2 = await colorThief.getPalette(
  "http://localhost:3000/images/example.png",
  5
);

const palette3 = await colorThief.getPalette(
  "./images/example.png",
  5
);

const color = await colorThief.getColor(
  { type: "image/png", buffer: image }
);

```

