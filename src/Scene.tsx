import * as THREE from 'three';
import { months } from './monthsConfig';

const segmentAngle = (Math.PI * 2) / 12; // 2pi/12 - full circle is 2 pi, need 12 slices for each month

const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.5} /> {/* soft omnidimensional light */}
      <pointLight position={[2, 2, 2]} intensity={1} />{' '}
      {/* localized light source positioned off to the side of the cube */}
      {months.map((month) => {
        return (
          <mesh position={[0, 0, 0]}>
            {' '}
            {/* positions 5 units in front of the camera */}
            <cylinderGeometry
              args={[
                10,
                10,
                10,
                8,
                1,
                true,
                -month.index * segmentAngle + 3 * segmentAngle,
                segmentAngle,
              ]}
            />
            {/* cylinder args={[radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength]} */}
            <meshStandardMaterial color={month.color} side={THREE.BackSide} />{' '}
            {/* bright hotpink, easy to see*/}
          </mesh>
        );
      })}
    </>
  );
};

export default Scene;
