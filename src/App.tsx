import './App.css';
import { Canvas } from '@react-three/fiber';
import Scene from './Scene';

function App() {
  return (
    <>
      <Canvas camera={{ position: [0, 0, 0], fov: 50 }}>
        <Scene />
      </Canvas>
    </>
  );
}

export default App;
