import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Polygon, Line, Text as SvgText, Circle } from 'react-native-svg';

interface CompetencyRadarProps {
  data: {
    grammar: number;
    vocabulary: number;
    pronunciation: number;
    listening: number;
    fluency: number;
  };
  size?: number;
}

export const CompetencyRadar: React.FC<CompetencyRadarProps> = ({ 
  data, 
  size = 300 
}) => {
  const center = size / 2;
  const radius = (size / 2) - 40;
  
  // 5 puntas del pentágono
  const angles = [
    -Math.PI / 2, // Arriba (Grammar)
    -Math.PI / 2 + (2 * Math.PI) / 5, // Derecha arriba (Vocabulary)
    -Math.PI / 2 + (4 * Math.PI) / 5, // Derecha abajo (Pronunciation)
    -Math.PI / 2 + (6 * Math.PI) / 5, // Izquierda abajo (Listening)
    -Math.PI / 2 + (8 * Math.PI) / 5, // Izquierda arriba (Fluency)
  ];

  const categories = ['Grammar', 'Vocabulary', 'Pronunciation', 'Listening', 'Fluency'];
  const values = [data.grammar, data.vocabulary, data.pronunciation, data.listening, data.fluency];

  const getPoint = (value: number, angle: number) => {
    const r = (value / 100) * radius;
    return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
  };

  const polygonPoints = values.map((val, i) => getPoint(val, angles[i])).join(' ');

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Background webs */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((scale, i) => (
          <Polygon
            key={`web-${i}`}
            points={angles.map(a => getPoint(scale * 100, a)).join(' ')}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
            fill="none"
          />
        ))}

        {/* Axes */}
        {angles.map((a, i) => (
          <Line
            key={`axis-${i}`}
            x1={center}
            y1={center}
            x2={center + radius * Math.cos(a)}
            y2={center + radius * Math.sin(a)}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />
        ))}

        {/* Data Polygon */}
        <Polygon
          points={polygonPoints}
          fill="rgba(37, 99, 235, 0.4)" // tailwind blue-600 with opacity
          stroke="#3b82f6" // tailwind blue-500
          strokeWidth="2"
        />
        
        {/* Data Points */}
        {values.map((val, i) => (
          <Circle
            key={`point-${i}`}
            cx={center + ((val / 100) * radius) * Math.cos(angles[i])}
            cy={center + ((val / 100) * radius) * Math.sin(angles[i])}
            r="4"
            fill="#60a5fa"
          />
        ))}

        {/* Labels */}
        {angles.map((a, i) => {
          const labelRadius = radius + 20;
          return (
            <SvgText
              key={`label-${i}`}
              x={center + labelRadius * Math.cos(a)}
              y={center + labelRadius * Math.sin(a)}
              fill="#94a3b8" // slate-400
              fontSize="12"
              fontWeight="bold"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {categories[i]}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});
