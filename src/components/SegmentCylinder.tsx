import * as THREE from 'three';
import type { TimeSegment } from '../types';
import { Fragment, useState } from 'react';
import { Text } from '@react-three/drei';

interface SegmentCylinderProps {
  segments: TimeSegment[];
  radius: number;
  height: number;
  fontSize: number;
  verticalIncrease: number;
  segmentsPerRevolution: number;
  onSegmentClick: (index: number) => void;
}

const SegmentCylinder = ({
  segments,
  radius,
  height,
  fontSize,
  verticalIncrease,
  segmentsPerRevolution,
  onSegmentClick,
}: SegmentCylinderProps) => {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);

  //angular width of one segment
  // const segmentAngle = (Math.PI * 2) / segments.length;
  const angle = (2 * Math.PI) / segmentsPerRevolution;

  const getSegmentStartAngle = (index: number) => {
    const startingOffset = Math.PI; //camera points at 180 degrees, want Jan to start there
    const subtractionAmount = -index * angle;
    const startAngle = startingOffset + subtractionAmount;
    return startAngle;
  };

  return segments.map((segment) => {
    return (
      <Fragment key={segment.index}>
        <mesh
          // [ x, y, z ]
          position={[0, verticalIncrease > 0 ? (segment.index + 0.5) * verticalIncrease : 0, 0]}
          onClick={() => onSegmentClick(segment.index)}
          // () => {
          //   clickedMonthRef.current = segment.index;
          //   console.log('clicked month:', segment.label);
          // }
          onPointerOver={() => setHoveredSegment(segment.index)}
          onPointerOut={() => setHoveredSegment(null)}
        >
          {' '}
          {/* positions 5 units in front of the camera */}
          <cylinderGeometry
            args={[
              radius,
              radius,
              verticalIncrease > 0 ? verticalIncrease : height,
              8, //radialSegments
              1, //height segments
              true, //openEnded
              getSegmentStartAngle(segment.index), //Segment Angle
              angle, //thetaLength
            ]}
          />
          {/* cylinder args={[radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength]} */}
          <meshStandardMaterial
            color={segment.color}
            emissive={hoveredSegment === segment.index ? segment.color : 'black'}
            emissiveIntensity={hoveredSegment === segment.index ? 0.5 : 0}
            side={THREE.BackSide}
          />
          {/* bright hotpink, easy to see*/}
        </mesh>
        <Text
          position={[
            //center angle calculation inside sine and cosine
            Math.sin(getSegmentStartAngle(segment.index) + angle / 2) * 49.5,
            verticalIncrease > 0 ? (segment.index + 0.5) * verticalIncrease : 0,
            Math.cos(getSegmentStartAngle(segment.index) + angle / 2) * 49.5, //reduced radius to 49.5 so its slightly inside wall
          ]}
          rotation={[0, Math.PI + getSegmentStartAngle(segment.index) + angle / 2, 0]}
          fontSize={fontSize}
        >
          {segment.label}
        </Text>
      </Fragment>
    );
  });
};

export default SegmentCylinder;
