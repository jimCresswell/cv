// app/icon.tsx
import { ImageResponse } from "next/og";
import TextToSVG from "text-to-svg";

// Constants for the default icon dimensions and content type
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

// Define the icon sizes and themes you want to support
const iconSizes = [32, 64, 128, 512];
const themes = ["light", "dark"];

interface IconMetadata {
  alt: string;
  id: string;
  type: string;
  sizes: string;
  url: string;
  media?: string;
}

export const generateImageMetadata: () => Promise<
  IconMetadata[]
> = async () => {
  // Dynamically construct metadata for each icon variant
  const metadataIcons: IconMetadata[] = themes.flatMap((theme) =>
    iconSizes.map((s) => ({
      alt: `JC Icon (${theme})`,
      id: `icon-${s}-${theme}`,
      type: "image/png",
      sizes: `${s}x${s}`,
      url: `/icon?size=${s}&theme=${theme}`,
      media: `(prefers-color-scheme: ${theme})`,
    }))
  );

  // Optionally add an Apple Touch Icon (commonly 180x180)
  metadataIcons.push({
    alt: "JC Icon (Apple Touch)",
    id: "icon-180-light",
    type: "image/png",
    sizes: "180x180",
    url: "/icon?size=180&theme=light", // Adjust theme if necessary
  });

  return metadataIcons;
};

function getIconPath(dimension: number) {
  const textToSVG = TextToSVG.loadSync(
    "src/app/fonts/RobotoCondensed-ExtraBold.ttf"
  );

  const svgPath = textToSVG.getD("JC", {
    x: dimension / 2,
    y: dimension / 2,
    fontSize: dimension * 0.888,
    anchor: "center middle",
  });

  return svgPath;
}

export default function Icon({
  params,
}: {
  params: { size?: string; theme?: "light" | "dark" };
}) {
  // DEBUG
  console.log(params);

  // Parse the icon size from query parameters (default to 512)
  const dimension = parseInt(params.size || "512", 10);
  // Determine theme based on URL parameters
  const theme = params.theme === "dark" ? "dark" : "light";
  const background = theme === "dark" ? "black" : "white";
  const foreground = theme === "dark" ? "white" : "black";

  // TO DO, memoize this
  const iconPath = getIconPath(dimension);

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
