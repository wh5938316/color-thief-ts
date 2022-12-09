// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import ColorThief from "color-thief-ts/node";
import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

const colorThief = new ColorThief();

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  const image = await fetch("http://localhost:3000/images/example.png")
    .then((res) => res.arrayBuffer())
    .then((arrayBuffer) => Buffer.from(arrayBuffer));

  const palette = await colorThief.getPalette(
    { type: "image/png", buffer: image },
    5
  );

  const dominantColor = await colorThief.getColor(
    "http://localhost:3000/images/example.png"
  );

  res.status(200).json({
    success: true,
    data: {
      palette,
      dominantColor,
    },
  });
}
