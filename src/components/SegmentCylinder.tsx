import * as THREE from 'three';
import type { TimeSegment } from '../types';
import { Fragment, useState } from 'react';
import { Text } from '@react-three/drei';

interface SegmentCylinderProps {
  segments: TimeSegment[];
  radius: number;
  height: number;
  fontSize: number;
  onSegmentClick: (index: number) => void;
}

const SegmentCylinder = ({
  segments,
  radius,
  height,
  fontSize,
  onSegmentClick,
}: SegmentCylinderProps) => {
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  const segmentAngle = (Math.PI * 2) / segments.length; // 2pi/12 - full circle is 2 pi, need 12 slices for each month

  const getSegmentCenterAngle = (index: number) => {
    const startingOffset = Math.PI; //camera points at 180 degrees, want Jan to start there
    const subtractionAmount = -index * segmentAngle;
    const centerAngle = startingOffset + subtractionAmount + segmentAngle / 2; //adds 15 degrees to move edge of segment to senter
    return centerAngle;
  };

  return segments.map((segment) => {
    return (
      <Fragment key={segment.index}>
        <mesh
          position={[0, 0, 0]}
          onClick={() => onSegmentClick(segment.index)}
          // () => {
          //   clickedMonthRef.current = segment.index;
          //   console.log('clicked month:', segment.label);
          // }
          onPointerOver={() => setHoveredMonth(segment.index)}
          onPointerOut={() => setHoveredMonth(null)}
        >
          {' '}
          {/* positions 5 units in front of the camera */}
          <cylinderGeometry
            args={[
              radius,
              radius,
              height,
              8,
              1,
              true,
              -segment.index * segmentAngle + Math.PI,
              segmentAngle,
            ]}
          />
          {/* cylinder args={[radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength]} */}
          <meshStandardMaterial
            color={segment.color}
            emissive={hoveredMonth === segment.index ? segment.color : 'black'}
            emissiveIntensity={hoveredMonth === segment.index ? 0.5 : 0}
            side={THREE.BackSide}
          />
          {/* bright hotpink, easy to see*/}
        </mesh>
        <Text
          position={[
            //center angle calculation inside sine and cosine
            Math.sin(getSegmentCenterAngle(segment.index)) * 49.5,
            0,
            Math.cos(getSegmentCenterAngle(segment.index)) * 49.5, //reduced radius to 49.5 so its slightly inside wall
          ]}
          rotation={[0, Math.PI + getSegmentCenterAngle(segment.index), 0]}
          fontSize={fontSize}
        >
          {segment.label}
        </Text>
      </Fragment>
    );
  });
};

export default SegmentCylinder;
