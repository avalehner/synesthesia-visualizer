import * as THREE from 'three';
import { months } from './data/monthsConfig';
import { useFrame } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import SegmentCylinder from './components/SegmentCylinder';

const segmentAngle = (Math.PI * 2) / 12; // 2pi/12 - full circle is 2 pi, need 12 slices for each month
// const SENSITIVITY = 0.3;
// const DEAD_ZONE = 0.2;
const SMOOTHING = 0.1;

const getSegmentCenterAngle = (index: number) => {
  const startingOffset = 6 * segmentAngle; //camera points at 180 degrees, want Jan to start there
  const subtractionAmount = -index * segmentAngle;
  const centerAngle = startingOffset + subtractionAmount + segmentAngle / 2; //adds 15 degrees to move edge of segment to senter
  return centerAngle;
};

const Scene = () => {
  //before the component has mounted groupREf.current will be null
  //! says that the initial value being passed is null but will be a THREE>group by the time anyone reads it. Stops typsecript from complaining it might be null everytime and me having to do a check
  const groupRef = useRef<THREE.Group>(null!);

  //typescript infers this type to be MutableREfObject<number> because the initial value is a number
  const scrollVelocityRef = useRef(0);
  const cursorVelocityRef = useRef(0);

  //holds the index of the clicked month
  const clickedMonthRef = useRef<number | null>(null);

  useEffect(() => {
    const handleHorizontalScroll = (e: WheelEvent) => {
      scrollVelocityRef.current += e.deltaX * 0.005;
      clickedMonthRef.current = null; //if user is scrolling they are taking control, this cancels any active click-snap
    };

    window.addEventListener('wheel', handleHorizontalScroll);

    return () => {
      window.removeEventListener('wheel', handleHorizontalScroll);
    };
  }, []);

  useFrame((_state, delta) => {
    if (!groupRef.current) return; //null check

    if (clickedMonthRef.current !== null) {
      const index = clickedMonthRef.current;
      const centerAngle = getSegmentCenterAngle(index);
      const baseTarget = Math.PI - centerAngle;
      const currentRotation = groupRef.current.rotation.y;
      const difference = currentRotation - baseTarget; //difference will equal base target if cylinder has not been rotate more than 2pi
      const numRevolutions = Math.round(difference / (2 * Math.PI));
      const nearestEquivalentTarget = baseTarget + numRevolutions * 2 * Math.PI;

      //lerp
      groupRef.current.rotation.y +=
        (nearestEquivalentTarget - groupRef.current.rotation.y) * SMOOTHING;

      if (Math.abs(nearestEquivalentTarget - currentRotation) < 0.001)
        clickedMonthRef.current = null;

      cursorVelocityRef.current = 0;
      return;
    }

    //SCROLL: rotates the group around the Y (vertical) axis.
    groupRef.current.rotation.y += scrollVelocityRef.current * delta;
    //lerp
    scrollVelocityRef.current += (0 - scrollVelocityRef.current) * SMOOTHING;

    //CURSOR CONTROL
    // // gives current cursor position
    // const px = state.pointer.x;
    // const targetVelocity = Math.abs(px) < DEAD_ZONE ? 0 : px * SENSITIVITY;
    // // lerp: moves the current velocity 10% of the way toward the target every time
    // cursorVelocityRef.current += (targetVelocity - cursorVelocityRef.current) * SMOOTHING;
    // //rotates the group around the Y (vertical) axis.
    // //multiplying by delta (number of seconds elapsed since the previous frame) converts rotation speed for different frame rates
    // groupRef.current.rotation.y += cursorVelocityRef.current * delta;
  });

  return (
    <>
      {/* <fog attach="fog" args={['#000000', 50, 70]} /> */}
      <color attach="background" args={['rgb(255, 252, 230)']} />
      <ambientLight intensity={0.5} /> {/* soft omnidimensional light */}
      <pointLight position={[2, 2, 2]} intensity={1} />{' '}
      {/* localized light source positioned off to the side of the cube */}
      <group ref={groupRef}>
        <SegmentCylinder
          segments={months.map((month) => ({
            index: month.index,
            label: month.name,
            color: month.color,
          }))}
          radius={50}
          height={20}
          onSegmentClick={(index) => (clickedMonthRef.current = index)}
        />{' '}
        {/* simplest container in Three.js, holds meshes and can be transformed as a unit (allows us to rotate entire ring of months at once */}
      </group>
    </>
  );
};

export default Scene;
