import * as THREE from 'three';
import { months } from './monthsConfig';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

const segmentAngle = (Math.PI * 2) / 12; // 2pi/12 - full circle is 2 pi, need 12 slices for each month

const Scene = () => {
  const groupRef = useRef<THREE.Group>(null!); //before the component has mounted groupREf.current will be null
  //! says that the initial value being passed is null but will be a THREE>group by the time anyone reads it. Stops typsecript from complaining it might be null everytime and me having to do a check

  useFrame((state, delta) => {
    if (!groupRef.current) return; //null check
    const sensitivity = 0.3;

    groupRef.current.rotation.y += state.pointer.x * sensitivity * delta; //rotates the group around the Y (vertical) axis.
    //state.pointer gives current cursor position
    //multiplying by delta (number of seconds elapsed since the previous frame) converts rotation speed for different frame rates
  });

  return (
    <>
      <ambientLight intensity={0.5} /> {/* soft omnidimensional light */}
      <pointLight position={[2, 2, 2]} intensity={1} />{' '}
      {/* localized light source positioned off to the side of the cube */}
      <group ref={groupRef}>
        {' '}
        {/* simplest container in Three.js, holds meshes and can be transformed as a unit (allows us to rotate entire ring of months at once */}
        {months.map((month) => {
          return (
            <mesh position={[0, 0, 0]}>
              {' '}
              {/* positions 5 units in front of the camera */}
              <cylinderGeometry
                args={[
                  50,
                  50,
                  20,
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
      </group>
    </>
  );
};

export default Scene;
