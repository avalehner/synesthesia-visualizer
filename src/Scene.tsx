import * as THREE from 'three';
import { months } from './monthsConfig';
import { useFrame } from '@react-three/fiber';
import { useRef, useEffect } from 'react';

const segmentAngle = (Math.PI * 2) / 12; // 2pi/12 - full circle is 2 pi, need 12 slices for each month
const SENSITIVITY = 0.3;
const DEAD_ZONE = 0.2;
const SMOOTHING = 0.1;

const Scene = () => {
  const groupRef = useRef<THREE.Group>(null!);
  //before the component has mounted groupREf.current will be null
  //! says that the initial value being passed is null but will be a THREE>group by the time anyone reads it. Stops typsecript from complaining it might be null everytime and me having to do a check

  const velocityRef = useRef(0);
  //typescript infers this type to be MutableREfObject<number> because the initial value is a number

  const clickedMonthRef = useRef<number | null>(null);
  //holds the index of the clicked month

  useEffect(() => {
    const handleHorizontalScroll = (e: WheelEvent) => {
      velocityRef.current += e.deltaX * 0.005;
      clickedMonthRef.current = null; //if user is scrolling they are taking control, this cancels any active click-snap
    };

    window.addEventListener('wheel', handleHorizontalScroll);

    return () => {
      window.removeEventListener('wheel', handleHorizontalScroll);
    };
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return; //null check

    if (clickedMonthRef.current !== null) {
      const index = clickedMonthRef.current;
      const centerAngle = -index * segmentAngle + 6 * segmentAngle + segmentAngle / 2;
      //+ segmentAngle/2 lands at the middle of the segment
      const baseTarget = Math.PI - centerAngle;
      const currentRotation = groupRef.current.rotation.y;
      const difference = currentRotation - baseTarget;
      const numRevolutions = Math.round(difference / (2 * Math.PI));
      const nearestEquivalentTarget = baseTarget + numRevolutions * 2 * Math.PI;

      //lerp
      groupRef.current.rotation.y +=
        (nearestEquivalentTarget - groupRef.current.rotation.y) * SMOOTHING;

      if (Math.abs(nearestEquivalentTarget - currentRotation) < 0.001)
        clickedMonthRef.current = null;

      velocityRef.current = 0;
      return;
    }

    const px = state.pointer.x;
    const targetVelocity = Math.abs(px) < DEAD_ZONE ? 0 : px * SENSITIVITY;

    //moves the current velocity 10% of the way toward the target every time
    velocityRef.current += (targetVelocity - velocityRef.current) * SMOOTHING;

    groupRef.current.rotation.y += velocityRef.current * delta; //rotates the group around the Y (vertical) axis.
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
            <mesh
              position={[0, 0, 0]}
              onClick={() => {
                clickedMonthRef.current = month.index;
                console.log('clicked month:', month.name);
              }}
            >
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
                  -month.index * segmentAngle + 6 * segmentAngle,
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
