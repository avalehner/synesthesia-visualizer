import * as THREE from 'three';
// import { months } from './data/monthsConfig';
import { helix, totalYears } from './data/helixConfig';
import { days, daysPerMonth } from './data/daysConfig';
import { useFrame } from '@react-three/fiber';
import { useRef, useEffect, useState } from 'react';
import SegmentCylinder from './components/SegmentCylinder';

const SMOOTHING = 0.1; //lerp factor, lower = smoother glide

const Scene = () => {
  //before the component has mounted groupRef.current will be null
  //! says that the initial value being passed is null but will be a THREE>group by the time anyone reads it. Stops typsecript from complaining it might be null everytime and me having to do a check
  const groupRef = useRef<THREE.Group>(null!);
  //typescript infers this type to be MutableRefObject<number> because the initial value is a number
  const scrollVelocityRef = useRef(0);
  const cursorVelocityRef = useRef(0);
  //camera's y at momet of zoom in
  const capturedYRef = useRef(0);
  //holds the index of the clicked day
  const clickedSegmentRef = useRef<number | null>(null);
  //helix rotation at zoom in time
  const helixReturnRotationRef = useRef<number>(0);

  const [viewLevel, setViewLevel] = useState<'year' | 'day'>('year'); //string literal type (variable can only be one of these specific string values)

  const VERTICAL_INCREASE = viewLevel === 'year' ? 1 : 0;
  const YEAR_HEIGHT = VERTICAL_INCREASE * 12;

  useEffect(() => {
    const handleHorizontalScroll = (e: WheelEvent) => {
      scrollVelocityRef.current += e.deltaX * 0.005;
    };

    window.addEventListener('wheel', handleHorizontalScroll);

    return () => {
      window.removeEventListener('wheel', handleHorizontalScroll);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setViewLevel('year');
        clickedSegmentRef.current = null;
        if (groupRef.current) {
          groupRef.current.rotation.y = helixReturnRotationRef.current;
          console.log(groupRef.current.rotation.y);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  //initial camera height use effect
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = (totalYears - 1) * Math.PI * 2;
    }
  }, []);

  const activeTimeSegments = viewLevel === 'year' ? helix : days;

  const segmentAngle = (Math.PI * 2) / activeTimeSegments.length;

  const getSegmentCenterAngle = (index: number) => {
    const startingOffset = Math.PI; //camera points at 180 degrees, want Jan to start there
    const subtractionAmount = -index * segmentAngle;
    const centerAngle = startingOffset + subtractionAmount + segmentAngle / 2; //adds 15 degrees to move edge of segment to senter
    return centerAngle;
  };

  useFrame((state, delta) => {
    if (!groupRef.current) return; //null check

    //zoom in for day view (field of view)
    const camera = state.camera as THREE.PerspectiveCamera;
    const targetFov = viewLevel === 'year' ? 50 : 4;
    camera.fov += (targetFov - camera.fov) * SMOOTHING;
    camera.updateProjectionMatrix(); //makes camera fov change take effect

    groupRef.current.position.y = viewLevel === 'day' ? capturedYRef.current : 0;

    //click to day snap
    if (clickedSegmentRef.current !== null) {
      const index = clickedSegmentRef.current;
      const centerAngle = getSegmentCenterAngle(index);
      const baseTarget = Math.PI - centerAngle;
      const currentRotation = groupRef.current.rotation.y;
      const difference = currentRotation - baseTarget; //difference will equal base target if cylinder has not been rotate more than 2pi
      const numRevolutions = Math.round(difference / (2 * Math.PI));
      const nearestEquivalentTarget = baseTarget + numRevolutions * 2 * Math.PI;

      //lerp
      groupRef.current.rotation.y += //rotation intrinsic to group
        (nearestEquivalentTarget - groupRef.current.rotation.y) * SMOOTHING;

      if (Math.abs(nearestEquivalentTarget - currentRotation) < 0.001)
        clickedSegmentRef.current = null;

      cursorVelocityRef.current = 0;
      return;
    }

    const targetY =
      viewLevel === 'year'
        ? (groupRef.current.rotation.y / (Math.PI * 2)) * YEAR_HEIGHT
        : capturedYRef.current;
    camera.position.y += (targetY - camera.position.y) * SMOOTHING;

    // camera.position.y = (groupRef.current.rotation.y / (Math.PI * 2)) * YEAR_HEIGHT;

    //SCROLL: rotates the group around the Y (vertical) axis.
    groupRef.current.rotation.y += scrollVelocityRef.current * delta;
    //lerp
    scrollVelocityRef.current += (0 - scrollVelocityRef.current) * SMOOTHING;
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
          segments={activeTimeSegments}
          radius={50}
          height={20}
          fontSize={viewLevel === 'year' ? 1 : 0.1}
          verticalIncrease={viewLevel === 'year' ? 1 : 0}
          segmentsPerRevolution={viewLevel === 'year' ? 12 : 365}
          onSegmentClick={(index) => {
            if (viewLevel === 'year') {
              helixReturnRotationRef.current = groupRef.current.rotation.y;
              console.log(helixReturnRotationRef.current);
              //get camera's y at moment of zoom
              capturedYRef.current = (groupRef.current.rotation.y / (Math.PI * 2)) * YEAR_HEIGHT;
              setViewLevel('day');
              const monthInYear = index % 12;
              const dayIndex = daysPerMonth
                .slice(0, monthInYear)
                .reduce((acc: number, current: number) => {
                  return acc + current;
                }, 0);
              clickedSegmentRef.current = dayIndex + 5; //so i start at slightly into month
            }
          }}
        />{' '}
        {/* simplest container in Three.js, holds meshes and can be transformed as a unit (allows us to rotate entire ring of months at once */}
      </group>
    </>
  );
};

export default Scene;
