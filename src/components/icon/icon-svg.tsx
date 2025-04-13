/**
 * An SVG icon component, takes a path, returns a rounded icon containing the path
 *
 * @param dimension - The dimension of the icon
 * @param background - The background color of the icon
 * @param foreground - The foreground color of the icon
 * @param iconPath - The path of the icon
 * @returns An SVG icon component
 */
export const IconSvg = ({
  dimension,
  background,
  foreground,
  iconPath,
}: {
  dimension: number;
  background: string;
  foreground: string;
  iconPath: string;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={dimension}
      height={dimension}
      viewBox={`0 0 ${dimension} ${dimension}`}
    >
      <circle cx={dimension / 2} cy={dimension / 2} r={dimension / 2} fill={background} />
      <g fill={foreground}>
        <path d={iconPath} />
      </g>
    </svg>
  );
};
