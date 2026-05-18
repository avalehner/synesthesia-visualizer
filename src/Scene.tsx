const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.5} /> {/* soft omnidimensional light */}
      <pointLight position={[2, 2, 2]} intensity={1} />{' '}
      {/* localized light source positioned off to the side of the cube */}
      <mesh position={[0, 0, -5]}>
        {' '}
        {/* positions cube 5 units in front of the camera */}
        <boxGeometry args={[1, 1, 1]} /> {/* 1x1x1 cube */}
        <meshStandardMaterial color="hotpink" /> {/* bright hotpink, easy to see*/}
      </mesh>
    </>
  );
};

export default Scene;
