export const Head = ({
  baseColor,
  noseColor,
  spotColor,
  helmetColor,
}: {
  baseColor: string;
  noseColor: string;
  spotColor: string;
  helmetColor: string;
}) => {
  return (
    <group position={[0, 1.15, 0]}>
      {/* Head */}
      <mesh>
        <boxGeometry args={[0.5, 0.6, 0.5]} />
        <meshStandardMaterial color={baseColor} />
      </mesh>
      {/* Eyes */}
      <group position={[0, 0, 0]}>
        <mesh position={[-0.1, 0.06, 0.26]}>
          <boxGeometry args={[0.07, 0.15, 0]} />
          <meshStandardMaterial color="black" />
        </mesh>
        <mesh position={[0.1, 0.06, 0.26]}>
          <boxGeometry args={[0.07, 0.15, 0]} />
          <meshStandardMaterial color="black" />
        </mesh>
      </group>
      {/* Nose */}
      <group position={[0, -0.05, 0]}>
        <mesh position={[0, -0.1, 0.3]}>
          <boxGeometry args={[0.5, 0.22, 0.1]} />
          <meshStandardMaterial color={noseColor} />
        </mesh>

        <mesh position={[-0.12, -0.1, 0.35]}>
          <boxGeometry args={[0.05, 0.05, 0.01]} />
          <meshStandardMaterial color="black" />
        </mesh>

        <mesh position={[0.12, -0.1, 0.35]}>
          <boxGeometry args={[0.05, 0.05, 0.01]} />
          <meshStandardMaterial color="black" />
        </mesh>
      </group>
      {/* Ears */}
      <mesh position={[-0.3, 0.12, 0]}>
        <boxGeometry args={[0.2, 0.15, 0.1]} />
        <meshStandardMaterial color={spotColor} />
      </mesh>
      <mesh position={[0.3, 0.1, 0]}>
        <boxGeometry args={[0.2, 0.15, 0.1]} />
        <meshStandardMaterial color={spotColor} />
      </mesh>

      {/* Helmet */}
      <group position={[0, 0.15, 0]}>
        <mesh position={[0, 0.1, 0.07]}>
          <boxGeometry args={[0.55, 0.11, 0.65]} />
          <meshStandardMaterial color={helmetColor} />
        </mesh>

        <mesh position={[0, 0.2, 0.03]}>
          <boxGeometry args={[0.55, 0.25, 0.55]} />
          <meshStandardMaterial color={helmetColor} />
        </mesh>
      </group>
    </group>
  );
};
