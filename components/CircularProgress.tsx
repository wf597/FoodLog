import React from 'react';
import Svg, { Circle, Text as SvgText, G } from 'react-native-svg';

interface CircularProgressProps {
  progress: number; // 0 to 1
  size: number; // diameter
  strokeWidth: number;
  color: string;
  value: string;
  label: string;
}

export default function CircularProgress({
  progress,
  size,
  strokeWidth,
  color,
  value,
  label,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <Svg width={size} height={size}>
      {/* Background Circle */}
      <Circle
        r={radius}
        cx={center}
        cy={center}
        strokeWidth={strokeWidth}
        stroke="#F0F0F0"
        fill="transparent"
      />

      {/* Progress Circle */}
      <G rotation={-90} originX={center} originY={center}>
        <Circle
          r={radius}
          cx={center}
          cy={center}
          strokeWidth={strokeWidth}
          stroke={color}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </G>

      {/* Value Text */}
      <SvgText
        x={center}
        y={center + 10}
        textAnchor="middle"
        fontSize="32"
        fontWeight="700"
        fill="#000">
        {value}
      </SvgText>

      {/* Label Text */}
      <SvgText
        x={center}
        y={center + 30}
        textAnchor="middle"
        fontSize="12"
        fill="#808080">
        {label}
      </SvgText>
    </Svg>
  );
}

