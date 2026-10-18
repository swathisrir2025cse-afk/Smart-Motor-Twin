
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  ContactShadows,
  PerspectiveCamera,
} from "@react-three/drei";
import * as THREE from "three";

const metal = "#45515f";
const darkMetal = "#202a35";
const steel = "#aebbc8";
const boltMetal = "#c5cbd1";
const accent = "#e5a23c";

function Bolt({ position, radius = 0.045, depth = 0.035 }) {
  return (
    <group position={position} rotation={[0, 0, Math.PI / 2]}>
      <mesh castShadow>
        <cylinderGeometry args={[radius, radius, depth, 6]} />
        <meshStandardMaterial
          color={boltMetal}
          metalness={0.88}
          roughness={0.28}
        />
      </mesh>
      <mesh position={[0, depth / 2 + 0.002, 0]}>
        <boxGeometry args={[radius * 1.1, 0.006, 0.012]} />
        <meshStandardMaterial color="#343b44" metalness={0.7} />
      </mesh>
    </group>
  );
}

function MotorBody() {
  const finPositions = [-0.95, -0.78, -0.61, -0.44, -0.27, -0.1, 0.07, 0.24, 0.41, 0.58, 0.75, 0.92];

  return (
    <group>
      {/* Main cast-metal motor housing */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.68, 0.68, 2.35, 64]} />
        <meshStandardMaterial
          color={metal}
          metalness={0.72}
          roughness={0.36}
        />
      </mesh>

      {/* Long cooling fins around the motor casing */}
      {finPositions.map((x) => (
        <mesh
          key={x}
          position={[x, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[0.745, 0.745, 0.075, 64]} />
          <meshStandardMaterial
            color="#667483"
            metalness={0.8}
            roughness={0.32}
          />
        </mesh>
      ))}

      {/* Front end bell */}
      <mesh
        position={[1.22, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[0.64, 0.64, 0.16, 64]} />
        <meshStandardMaterial
          color="#566371"
          metalness={0.82}
          roughness={0.28}
        />
      </mesh>

      {/* Rear end bell */}
      <mesh
        position={[-1.22, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[0.64, 0.64, 0.16, 64]} />
        <meshStandardMaterial
          color="#3c4856"
          metalness={0.82}
          roughness={0.32}
        />
      </mesh>

      {/* Raised circular front bearing housing */}
      <mesh
        position={[1.34, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[0.34, 0.39, 0.16, 48]} />
        <meshStandardMaterial
          color="#7b8793"
          metalness={0.9}
          roughness={0.24}
        />
      </mesh>

      {/* Bearing inner ring */}
      <mesh
        position={[1.435, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <torusGeometry args={[0.255, 0.045, 12, 48]} />
        <meshStandardMaterial
          color={steel}
          metalness={0.95}
          roughness={0.2}
        />
      </mesh>

      {/* Bearing face recess */}
      <mesh
        position={[1.445, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[0.205, 0.205, 0.025, 48]} />
        <meshStandardMaterial
          color="#28333f"
          metalness={0.85}
          roughness={0.32}
        />
      </mesh>

      {/* Front cover bolts arranged around the end plate */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <Bolt
            key={i}
            position={[
              1.315,
              Math.cos(angle) * 0.52,
              Math.sin(angle) * 0.52,
            ]}
            radius={0.042}
            depth={0.04}
          />
        );
      })}

      {/* Rear end cover bolts */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <Bolt
            key={i}
            position={[
              -1.315,
              Math.cos(angle) * 0.51,
              Math.sin(angle) * 0.51,
            ]}
            radius={0.035}
          />
        );
      })}

      {/* Longitudinal structural ribs on top of housing */}
      {[-0.42, -0.14, 0.14, 0.42].map((z) => (
        <mesh
          key={z}
          position={[0, 0.65, z]}
          castShadow
        >
          <boxGeometry args={[2.1, 0.07, 0.075]} />
          <meshStandardMaterial
            color="#71808e"
            metalness={0.72}
            roughness={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

function RotatingShaft({ isRunning }) {
  const shaftGroup = useRef();

  useFrame((_, delta) => {
    if (shaftGroup.current && isRunning) {
      shaftGroup.current.rotation.x += delta * 7;
    }
  });

  return (
    <group position={[1.46, 0, 0]} ref={shaftGroup}>
      {/* Polished steel output shaft */}
      <mesh
        position={[0.36, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[0.145, 0.145, 0.82, 48]} />
        <meshStandardMaterial
          color="#c7d0d9"
          metalness={1}
          roughness={0.17}
        />
      </mesh>

      {/* Shaft shoulder */}
      <mesh
        position={[0.09, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[0.19, 0.19, 0.13, 48]} />
        <meshStandardMaterial
          color="#8b98a6"
          metalness={0.96}
          roughness={0.22}
        />
      </mesh>

      {/* Shaft key - rotates with the shaft */}
      <mesh position={[0.37, 0.137, 0]} castShadow>
        <boxGeometry args={[0.45, 0.035, 0.065]} />
        <meshStandardMaterial
          color="#e0e5e9"
          metalness={0.94}
          roughness={0.22}
        />
      </mesh>

      {/* Machined coupling at the end */}
      <mesh
        position={[0.78, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[0.24, 0.24, 0.12, 48]} />
        <meshStandardMaterial
          color="#586675"
          metalness={0.94}
          roughness={0.24}
        />
      </mesh>

      {/* Coupling face ring */}
      <mesh
        position={[0.85, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <torusGeometry args={[0.16, 0.025, 10, 40]} />
        <meshStandardMaterial
          color={steel}
          metalness={0.95}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

function RearFan({ isRunning }) {
  const fanRef = useRef();

  useFrame((_, delta) => {
    if (fanRef.current && isRunning) {
      fanRef.current.rotation.x += delta * 5;
    }
  });

  return (
    <group position={[-1.42, 0, 0]}>
      {/* Rear fan cover */}
      <mesh
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[0.52, 0.52, 0.12, 48, 1, true]} />
        <meshStandardMaterial
          color="#293541"
          metalness={0.82}
          roughness={0.38}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Protective fan grille rings */}
      {[0.23, 0.34, 0.45].map((radius) => (
        <mesh
          key={radius}
          rotation={[0, Math.PI / 2, 0]}
        >
          <torusGeometry args={[radius, 0.018, 8, 48]} />
          <meshStandardMaterial
            color="#84909b"
            metalness={0.85}
            roughness={0.34}
          />
        </mesh>
      ))}

      {/* Fan blades */}
      <group ref={fanRef}>
        {Array.from({ length: 8 }, (_, i) => (
          <mesh
            key={i}
            position={[-0.025, 0, 0]}
            rotation={[0, 0, (i / 8) * Math.PI * 2]}
          >
            <mesh
              position={[0, 0.25, 0]}
              rotation={[0.15, 0, -0.18]}
              castShadow
            >
              <boxGeometry args={[0.055, 0.32, 0.11]} />
              <meshStandardMaterial
                color="#667582"
                metalness={0.76}
                roughness={0.36}
              />
            </mesh>
          </mesh>
        ))}
      </group>

      {/* Fan hub */}
      <mesh
        rotation={[0, 0, Math.PI / 2]}
        position={[-0.05, 0, 0]}
      >
        <cylinderGeometry args={[0.12, 0.12, 0.14, 32]} />
        <meshStandardMaterial
          color={steel}
          metalness={0.94}
          roughness={0.24}
        />
      </mesh>
    </group>
  );
}

function TerminalBox() {
  return (
    <group position={[-0.2, 0.86, 0]}>
      {/* Box base */}
      <mesh position={[0, -0.09, 0]} castShadow>
        <boxGeometry args={[0.78, 0.18, 0.72]} />
        <meshStandardMaterial
          color="#303d49"
          metalness={0.78}
          roughness={0.4}
        />
      </mesh>

      {/* Terminal box body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.78, 0.48, 0.72]} />
        <meshStandardMaterial
          color="#566575"
          metalness={0.7}
          roughness={0.34}
        />
      </mesh>

      {/* Top lid */}
      <mesh position={[0, 0.255, 0]} castShadow>
        <boxGeometry args={[0.84, 0.07, 0.78]} />
        <meshStandardMaterial
          color="#82909d"
          metalness={0.78}
          roughness={0.3}
        />
      </mesh>

      {/* Lid fasteners */}
      {[
        [-0.32, 0.3, -0.29],
        [0.32, 0.3, -0.29],
        [-0.32, 0.3, 0.29],
        [0.32, 0.3, 0.29],
      ].map((position, i) => (
        <Bolt key={i} position={position} radius={0.032} />
      ))}

      {/* Small yellow industrial warning plate */}
      <mesh position={[0, 0.01, 0.367]}>
        <boxGeometry args={[0.38, 0.17, 0.012]} />
        <meshStandardMaterial
          color={accent}
          metalness={0.35}
          roughness={0.5}
        />
      </mesh>

      {/* Cable glands */}
      {[-0.2, 0, 0.2].map((x) => (
        <mesh
          key={x}
          position={[x, -0.19, 0.05]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry args={[0.055, 0.065, 0.11, 20]} />
          <meshStandardMaterial
            color="#b0bac3"
            metalness={0.88}
            roughness={0.28}
          />
        </mesh>
      ))}
    </group>
  );
}

function MountingFeet() {
  return (
    <group>
      {[-0.76, 0.76].map((x) => (
        <group key={x} position={[x, -0.74, 0]}>
          {/* Motor foot */}
          <mesh position={[0, -0.055, 0]} castShadow>
            <boxGeometry args={[0.54, 0.16, 0.92]} />
            <meshStandardMaterial
              color="#35414d"
              metalness={0.8}
              roughness={0.4}
            />
          </mesh>

          {/* Reinforcement web */}
          <mesh position={[0, 0.055, 0]}>
            <boxGeometry args={[0.24, 0.19, 0.7]} />
            <meshStandardMaterial
              color="#52606d"
              metalness={0.74}
              roughness={0.4}
            />
          </mesh>

          {/* Mounting bolts */}
          {[-0.31, 0.31].map((z) => (
            <group key={z} position={[0, 0.035, z]}>
              <mesh>
                <cylinderGeometry args={[0.065, 0.065, 0.035, 6]} />
                <meshStandardMaterial
                  color={boltMetal}
                  metalness={0.9}
                  roughness={0.25}
                />
              </mesh>
            </group>
          ))}
        </group>
      ))}
    </group>
  );
}

function MotorModel({ isRunning }) {
  return (
    <group>
      <MotorBody />
      <RearFan isRunning={isRunning} />
      <RotatingShaft isRunning={isRunning} />
      <TerminalBox />
      <MountingFeet />
    </group>
  );
}

export default function Motor3D({ isRunning }) {
  return (
    <div style={{ width: "100%", height: "100%", minHeight: 390 }}>
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <color attach="background" args={["#0b1220"]} />

        <PerspectiveCamera
          makeDefault
          position={[3.8, 2.8, 5.7]}
          fov={42}
        />

        <ambientLight intensity={0.65} />

        <directionalLight
          position={[4, 6, 5]}
          intensity={2.4}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        <directionalLight
          position={[-4, 3, -3]}
          intensity={1.5}
          color="#8abaff"
        />

        <spotLight
          position={[0, 5, 2]}
          intensity={75}
          angle={0.55}
          penumbra={0.8}
          distance={12}
          castShadow
        />

        <MotorModel isRunning={isRunning} />

        {/* Floor for realistic contact shadows */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.91, 0]}
          receiveShadow
        >
          <planeGeometry args={[200, 200]} />
          <meshStandardMaterial
            color="#111c2a"
            roughness={0.82}
            metalness={0.12}
          />
        </mesh>

        <ContactShadows
          position={[0, -0.9, 0]}
          opacity={0.55}
          scale={5.5}
          blur={2.5}
          far={3}
          resolution={512}
          color="#000000"
        />

        <OrbitControls
          makeDefault
          enablePan={false}
          minDistance={3.5}
          maxDistance={9}
          minPolarAngle={0.35}
          maxPolarAngle={Math.PI / 2}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
}
