import { HabitColors } from "../habit/color";

interface Props {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

const EmptyJar = ({
  fill = "none",
  stroke = "#eeeeee",
  strokeWidth = 4,
}: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 300"
      width="200"
      height="300"
    >
      {/* Jar Outline */}
      <rect
        x="50"
        y="60"
        width="100"
        height="180"
        rx="20"
        ry="20"
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      {/* Jar Neck */}
      <rect
        x="60"
        y="40"
        width="80"
        height="20"
        rx="10"
        ry="10"
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      {/* Inner Rim */}
      <rect x="65" y="60" width="70" height="2" fill={stroke} />
      {/* Marble */}
      <circle
        cx="78"
        cy="228"
        r="10"
        fill={fill}
        className={HabitColors.styles.saffron.base}
        strokeWidth={strokeWidth}
      />
      <circle
        cx="100"
        cy="228"
        r="10"
        fill={fill}
        className={HabitColors.styles.ocean.base}
        strokeWidth={strokeWidth}
      />
      <circle
        cx="122"
        cy="228"
        r="10"
        fill={fill}
        className={HabitColors.styles.rose.base}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export default EmptyJar;
