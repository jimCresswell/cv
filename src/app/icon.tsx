import type { Metadata } from "next";
import { ImageResponse } from "next/og";
import TextToSVG from "text-to-svg";

// Constants for the default icon dimensions and content type
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

// Define the icon sizes and themes you want to support
const iconSizes = [32, 64, 128, 512];

// We can't support light and dark themes yet, because
// the special function `generateImageMetadata` strips out
// non-image metadata tags, such as media queries, so we
// can provide the necessary data to construct link elements
// like <link rel="icon" href="/icon-512-dark?abc123" media="(prefers-color-scheme: dark)">
// The dark version looks good, so for now we are using that for everything.
const themes = ["dark"];

// The word to be displayed on the icon
const WORD = "JC";

interface IconMetadata extends Metadata {
  alt: string;
  id: string;
  contentType: string;
  size: { width: number; height: number };
  media?: string;
}

export const generateImageMetadata: () => Promise<
  IconMetadata[]
> = async () => {
  // Dynamically construct metadata for each icon variant.
  // Once this process supports media queries, we can add light and dark themes.
  // with `media: "(prefers-color-scheme: dark)"` etc.
  const metadataIcons: IconMetadata[] = themes.flatMap((theme) =>
    iconSizes.map((s) => ({
      alt: `${WORD} Icon (${theme})`,
      id: `icon-${s}-${theme}`,
      contentType,
      size: { width: s, height: s },
    }))
  );

  // Optionally add an Apple Touch Icon (commonly 180x180)
  metadataIcons.push({
    alt: `${WORD} Icon (Apple Touch)`,
    id: "icon-180-dark",
    contentType,
    size: { width: 180, height: 180 },
  });

  return metadataIcons;
};

function getIconPath(word: string, dimension: number) {
  const textToSVG = TextToSVG.loadSync(
    "src/app/fonts/RobotoCondensed-ExtraBold.ttf"
  );

  const svgPath = textToSVG.getD(word, {
    x: dimension / 2,
    y: dimension / 2,
    fontSize: dimension * 0.8,
    anchor: "center middle",
  });

  return svgPath;
}

// Update the function signature to receive searchParams instead of params
export default function Icon({ id }: { id: string }): ImageResponse {
  console.log("Icon params:", id);

  // Parse the theme and icon size from the file ID.
  const themeParam = id?.includes("dark") ? "dark" : "light";
  let dimension = 512;
  const sizeMatch = id?.match(/icon-(\d+)/);
  if (sizeMatch && sizeMatch[1]) {
    dimension = parseInt(sizeMatch[1], 10);
  }

  // Determine background and foreground colors based on theme
  const background = themeParam === "dark" ? "black" : "white";
  const foreground = themeParam === "dark" ? "white" : "black";

  // Get the icon path for the desired word and dimension.
  const iconPath = getIconPath(WORD, dimension);

  // Return an ImageResponse for the chosen icon based on size, content type and median query,
  // except that media queries are not supported by ImageResponse yet.
  // The result will be statically cached by Next.js
  return new ImageResponse(
    (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={dimension}
        height={dimension}
        viewBox={`0 0 ${dimension} ${dimension}`}
      >
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={dimension / 2}
          fill={background}
        />
        <g fill={foreground}>
          <path d={iconPath} />
        </g>
      </svg>
    ),
    {
      width: dimension,
      height: dimension,
    }
  );
}
