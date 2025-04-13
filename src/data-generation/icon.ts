/**
 * Utilities related to icons
 */

import type { Metadata } from "next";
import TextToSVG from "text-to-svg";

const iconSizes = [32, 64, 128, 512];
const contentType = "image/png";

// The function `generateImageMetadata` strips out
// non-image metadata tags, such as `media` so we
// can't directly use the metadata to construct links like
// <link rel="icon" href="/icon-512-dark?abc123" media="(prefers-color-scheme: dark)">
// However, we can set the metadata.icons.icon[] for each page, and
// include the media metadata their.
const themes = ["light", "dark"];

export function getIconConfig() {
  return {
    iconSizes,
    themes,
    contentType,
  };
}

interface PictureMetadata extends Metadata {
  alt: string;
  id: string;
  contentType: string;
  size: { width: number; height: number };
}

/**
 * Given a word and a size, return a SVG path for the word.
 *
 * The font is hardcoded.
 *
 * @param word - The word to convert to a path
 * @param dimension - The size of the icon
 * @returns A SVG path for the word
 */
export function getIconPath(word: string, dimension: number): string {
  const textToSVG = TextToSVG.loadSync("src/fonts/RobotoCondensed-ExtraBold.ttf");

  const svgPath = textToSVG.getD(word, {
    x: dimension / 2,
    y: dimension / 2,
    fontSize: dimension * 0.8,
    anchor: "center middle",
  });

  return svgPath;
}

/**
 * Given an icon ID, return the dimension of the icon.
 *
 * @param id - The ID of the icon
 * @param fallback - The fallback dimension if the ID does not contain a dimension
 * @returns The dimension of the icon
 */
export function getDimensionFromId(id: string, fallback = 512): number {
  const sizeMatch = /icon-(\d+)/.exec(id);
  if (sizeMatch?.[1]) {
    return Number.parseInt(sizeMatch[1], 10);
  }
  return fallback;
}

/**
 * Given an icon ID, return the theme of the icon.
 *
 * @param id - The ID of the icon
 * @returns The theme of the icon
 */
export function getThemeFromId(id: string): string {
  if (id.includes("dark")) {
    return "dark";
  }
  return "light";
}

/**
 * Given a word and a content type, return metadata for the icon.
 *
 * @param word - The word to convert to a path
 * @param contentType - The content type of the icon
 * @returns Metadata for the icon
 */
export function getGenerateImageMetadata(
  word: string,
  contentType = "image/png",
): () => PictureMetadata[] {
  return function generateImageMetadata() {
    // Dynamically construct metadata for each icon variant.
    const metadataIcons: PictureMetadata[] = themes.flatMap((theme) =>
      iconSizes.map((s) => ({
        alt: `${word} Icon (${theme})`,
        id: `icon-${s.toString()}-${theme}`,
        contentType,
        size: { width: s, height: s },
      })),
    );

    // Optionally add an Apple Touch Icon (commonly 180x180)
    metadataIcons.push(
      {
        alt: `${word} Icon (Apple Touch)`,
        id: "icon-180-light-apple",
        contentType,
        size: { width: 180, height: 180 },
      },
      {
        alt: `${word} Icon (Apple Touch)`,
        id: "icon-180-dark-apple",
        contentType,
        size: { width: 180, height: 180 },
      },
    );

    return metadataIcons;
  };
}

interface IconMetadata {
  rel: "icon" | "apple-touch-icon";
  media: string;
  url: string;
}

/**
 * Generate icon metadata for pages
 *
 * @example
 * ```
 * {
 *   icon: [
 *     {
 *       rel: "icon",
 *       media: "(prefers-color-scheme: dark)",
 *       url: "icon/icon-128-dark",
 *     },
 *     {
 *       rel: "icon",
 *       media: "(prefers-color-scheme: light)",
 *       url: "icon/icon-128-light",
 *     },
 *   ],
 *   apple: [
 *     {
 *       rel: "apple-touch-icon",
 *       media: "(prefers-color-scheme: dark)",
 *       url: "icon/icon-128-dark",
 *     },
 *     {
 *       rel: "apple-touch-icon",
 *       media: "(prefers-color-scheme: light)",
 *       url: "icon/icon-128-light",
 *     },
 *   ],
 * }
 * ```
 */
export function getIconMetadata() {
  const metadataIcons: { icon: IconMetadata[]; apple: IconMetadata[] } = {
    icon: [],
    apple: [],
  };

  metadataIcons.icon = themes.flatMap((theme) =>
    iconSizes.map((s) => ({
      rel: "icon",
      media: `(prefers-color-scheme: ${theme})`,
      url: `icon/icon-${s.toString()}-${theme}`,
    })),
  );

  metadataIcons.apple = metadataIcons.icon.map((icon) => ({
    ...icon,
    rel: "apple-touch-icon",
  }));

  return metadataIcons;
}
