import React from 'react';

interface YavaLogoProps {
  className?: string;
  height?: number | string;
  navyColor?: string;
  orangeColor?: string;
  monoColor?: string;
}

export default function YavaLogo({
  className = '',
  height = 36,
  navyColor = '#0B2E6D',
  orangeColor = '#F15A24',
  monoColor,
}: YavaLogoProps) {
  const yColor = monoColor || navyColor;
  const aColor = monoColor || orangeColor;
  const vColor = monoColor || navyColor;
  const a2Color = monoColor || orangeColor;

  return (
    <svg
      viewBox="0 0 136 40"
      height={height}
      className={`inline-block select-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="YAVA Logo"
    >
      {/* Letter Y: Deep navy, bold, wide diagonal arms, smooth curved junction, tapered & forward-moving stem */}
      <path
        d="M 6 8.5 C 6 6, 12 6, 12 8.5 L 18 19 C 19 20, 21 20, 22 19 L 28 8.5 C 28 6, 34 6, 34 8.5 L 24 21.5 C 23.5 22.5, 23.5 23.5, 24 24.5 L 25 32 C 25 34.5, 19.5 34.5, 19.5 32 L 17 24.5 C 17.5 23.5, 17.5 22.5, 17 21.5 L 6 8.5 Z"
        fill={yColor}
      />

      {/* Letter A (First): Bright orange, stylized triangular arch with rounded ends, no crossbar, exactly like V but flipped upside down */}
      <path
        d="M 38 31.5 C 38 34, 43.5 34, 43.5 31.5 L 51 11 C 51.5 10, 52.5 10, 53 11 L 60.5 31.5 C 60.5 34, 66 34, 66 31.5 L 56.5 8 C 55.5 5.5, 48.5 5.5, 47.5 8 Z"
        fill={aColor}
      />

      {/* Letter V: Deep navy, thick, symmetrical, with smooth curved bottom point */}
      <path
        d="M 70 8.5 C 70 6, 75.5 6, 75.5 8.5 L 83 29 C 83.5 30, 84.5 30, 85 29 L 92.5 8.5 C 92.5 6, 98 6, 98 8.5 L 88.5 32 C 87.5 34.5, 80.5 34.5, 79.5 32 L 70 8.5 Z"
        fill={vColor}
      />

      {/* Letter A (Second): Bright orange, identical to first A, shifted for wide modern tracking */}
      <path
        d="M 102 31.5 C 102 34, 107.5 34, 107.5 31.5 L 115 11 C 115.5 10, 116.5 10, 117 11 L 124.5 31.5 C 124.5 34, 130 34, 130 31.5 L 120.5 8 C 119.5 5.5, 112.5 5.5, 111.5 8 Z"
        fill={a2Color}
      />
    </svg>
  );
}
