// RadarChart.tsx
import { Card, CardContent } from "~/components/ui/card";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// Types for the radar chart
export interface RadarSegment {
  name: string;
  value: number;
  startAngle: number;
  endAngle: number;
  category: string;
}

export interface RadarCategory {
  name: string;
  color: string;
}

interface RadarChartProps {
  segments: RadarSegment[];
  categories: RadarCategory[];
  innerRadiusRatio?: number;
  showLabels?: boolean;
  showLegend?: boolean;
  className?: string;
  animationEnabled?: boolean;
}

/**
 * A reusable radar chart component that displays segments in a circular layout
 */
export const RadarChart = ({
  segments,
  categories,
  innerRadiusRatio = 0.3,
  showLabels = true,
  showLegend = true,
  className = "",
  animationEnabled = true,
}: RadarChartProps) => {
  const chartRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Update dimensions when component mounts or resizes
  useEffect(() => {
    if (!chartRef.current) return;

    const updateDimensions = () => {
      if (chartRef.current) {
        const { width, height } = chartRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();

    // Add resize listener
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // Helper function to create SVG path for sector segments
  const createSectorPath = (
    startAngle: number,
    endAngle: number,
    innerRadius: number,
    outerRadius: number,
    cx: number,
    cy: number
  ) => {
    // Convert angles to radians
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    // Calculate points
    const x1 = cx + innerRadius * Math.cos(startRad);
    const y1 = cy + innerRadius * Math.sin(startRad);
    const x2 = cx + outerRadius * Math.cos(startRad);
    const y2 = cy + outerRadius * Math.sin(startRad);
    const x3 = cx + outerRadius * Math.cos(endRad);
    const y3 = cy + outerRadius * Math.sin(endRad);
    const x4 = cx + innerRadius * Math.cos(endRad);
    const y4 = cy + innerRadius * Math.sin(endRad);

    // Generate path
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return `
      M ${x1} ${y1}
      L ${x2} ${y2}
      A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x3} ${y3}
      L ${x4} ${y4}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1} ${y1}
      Z
    `;
  };

  // Helper function to get segment color based on category
  const getSegmentColor = (segment: RadarSegment) => {
    const category = categories.find(cat => cat.name === segment.category);
    return category ? category.color : "#cbd5e1"; // Default color
  };

  // Calculate the center and radius
  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;
  const maxRadius = Math.min(centerX, centerY) - 10; // Padding
  const innerRadius = maxRadius * innerRadiusRatio;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const contentComponent = (
    <div className={`h-full w-full ${className}`}>
      <svg
        ref={chartRef}
        viewBox={`0 0 ${dimensions.width || 400} ${dimensions.height || 400}`}
        width="100%"
        height="100%"
      >
        {/* Center dot */}
        {dimensions.width > 0 && (
          <>
            <circle
              cx={centerX}
              cy={centerY}
              r={5}
              fill="#fff"
              stroke="#cbd5e1"
              strokeWidth={1}
            />

            {/* Inner circle */}
            <circle
              cx={centerX}
              cy={centerY}
              r={innerRadius}
              fill="#fff"
              stroke="#e2e8f0"
              strokeWidth={1}
            />

            {/* Draw segments */}
            {segments.map((segment, index) => {
              const segmentPath = createSectorPath(
                segment.startAngle,
                segment.endAngle,
                innerRadius,
                innerRadius + ((maxRadius - innerRadius) * segment.value / 100),
                centerX,
                centerY
              );

              const segmentColor = getSegmentColor(segment);

              const SegmentComponent = animationEnabled ? motion.path : 'path';

              const segmentProps = {
                key: `segment-${index}`,
                d: segmentPath,
                fill: segmentColor,
                fillOpacity: 0.6,
                stroke: segmentColor,
                strokeWidth: 1,
                ...(animationEnabled && {
                  variants: itemVariants
                })
              };

              return <SegmentComponent {...segmentProps} />;
            })}

            {/* Add segment labels */}
            {showLabels && segments.map((segment, index) => {
              // Calculate midpoint angle for label placement
              const midAngle = ((segment.startAngle + segment.endAngle) / 2) * Math.PI / 180;
              const labelRadius = maxRadius + 15; // Slightly outside the chart
              const x = centerX + labelRadius * Math.cos(midAngle);
              const y = centerY + labelRadius * Math.sin(midAngle);

              // Adjust text anchor based on position
              const textAnchor =
                (segment.startAngle + segment.endAngle) / 2 < -90 ||
                  (segment.startAngle + segment.endAngle) / 2 > 90
                  ? "end" : "start";

              const TextComponent = animationEnabled ? motion.text : 'text';

              const textProps = {
                key: `label-${index}`,
                x: x,
                y: y,
                textAnchor: textAnchor,
                dominantBaseline: "middle",
                fontSize: 10,
                fill: "#64748b",
                ...(animationEnabled && {
                  variants: {
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { delay: 0.3 + (index * 0.03) }
                    }
                  }
                })
              };

              return <TextComponent {...textProps}>{segment.name}</TextComponent>;
            })}
          </>
        )}
      </svg>

      {/* Legend */}
      {showLegend && dimensions.width > 0 && (
        <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs text-gray-600">
          {categories.map((category, index) => (
            <div key={`legend-${index}`} className="flex items-center space-x-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span>{category.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (animationEnabled) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="h-full w-full"
      >
        {contentComponent}
      </motion.div>
    );
  }

  return contentComponent;
};

/**
 * RadarChart wrapped in a Card component from Shadcn UI
 */
export const RadarChartCard = (props: RadarChartProps) => {
  return (
    <Card className="h-full">
      <CardContent className="p-4 h-full">
        <RadarChart {...props} />
      </CardContent>
    </Card>
  );
};

export default RadarChartCard;
