import { ImageResponse } from "next/og";

import { IconSvg } from "@/components/icon/icon-svg";
import {
  getThemeFromId,
  getDimensionFromId,
  getIconPath,
  getGenerateImageMetadata,
  getIconConfig,
} from "@/data-generation/icon";
import { logger } from "@/lib/shared/logging";

// The word to be displayed on the icon
const WORD = "JC";

const { contentType } = getIconConfig();

export const generateImageMetadata = getGenerateImageMetadata(WORD, contentType);

// Update the function signature to receive searchParams instead of params
export default function Icon({ id }: { id: string }): ImageResponse {
  logger.debug(`Icon params: ${id}`);

  // Parse the theme and icon size from the file ID.
  const themeParameter = getThemeFromId(id);
  const dimension = getDimensionFromId(id, 512);

  // Determine background and foreground colors based on theme
  const background = themeParameter === "dark" ? "black" : "white";
  const foreground = themeParameter === "dark" ? "white" : "black";

  // Get the icon path for the desired word and dimension.
  const iconPath = getIconPath(WORD, dimension);

  // Return an ImageResponse for the chosen icon based on size, content type and median query,
  // except that media queries are not supported by ImageResponse yet.
  // The result will be statically cached by Next.js
  return new ImageResponse(
    (
      <IconSvg
        dimension={dimension}
        background={background}
        foreground={foreground}
        iconPath={iconPath}
      />
    ),
    {
      width: dimension,
      height: dimension,
    },
  );
}
