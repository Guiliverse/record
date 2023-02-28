import React from "react";
import { Select, useGLTF } from "@react-three/drei";
import { EffectComposer, Bloom, Selection } from "@react-three/postprocessing";
import {
  TextureLoader,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  RepeatWrapping,
} from "three";

import RecordGLB from "./assets/RECORD.glb";
import PlaceholderCover from "./assets/another.png";
import PlaceholderMetadata from "./assets/metadata.png";
import CaseEmboss from "./assets/case-emboss.png";
import PlaceholderSpine from "./assets/side-panel-label.png";

export default function Record({ cover, metadata, spine, ...props }) {
  const { nodes } = useGLTF(RecordGLB);
  const coverLoader = new TextureLoader();
  coverLoader.needsUpdate = true;
  const placeholderCover = coverLoader.load(PlaceholderCover);
  placeholderCover.flipY = false;

  const coverMaterial = new MeshStandardMaterial({
    name: "Cover",
    map: placeholderCover,
    side: nodes.Cube001.material.side,
    roughness: nodes.Cube001.material.roughness,
  });

  if (cover) {
    const localImage = coverLoader.load(cover);
    localImage.flipY = false;
    coverMaterial.map = localImage;
    localImage.encoding = 3001;
    placeholderCover.dispose();

  }

  const metadataLoader = new TextureLoader();
  metadataLoader.needsUpdate = true;

  const placeholderMetadata = metadataLoader.load(PlaceholderMetadata);
  placeholderMetadata.wrapS = RepeatWrapping;
  placeholderMetadata.repeat.x = -1;

  const caseEmbossLoader = new TextureLoader();

  const caseEmboss = caseEmbossLoader.load(CaseEmboss);
  caseEmboss.flipY = true;
  caseEmboss.wrapS = RepeatWrapping;
  caseEmboss.repeat.x = -1;

  const metadataMaterial = new MeshPhysicalMaterial({
    name: "Metadata",
    map: placeholderMetadata,
    normalMap: caseEmboss,
    roughness: nodes.Cube001_2.material.roughness,
    normalScale: nodes.Cube001_2.material.normalScale,
    clearcoatNormalScale: nodes.Cube001_2.material.clearcoatNormalScale,
  });

  if (metadata) {
    const localImage = metadataLoader.load(metadata);
    localImage.flipY = true;
    localImage.wrapS = RepeatWrapping;
    localImage.repeat.x = -1;
    metadataMaterial.map = localImage;
    placeholderMetadata.dispose();
  }
  const spineLoader = new TextureLoader();
  spineLoader.needsUpdate = true;
  const placeholderSpine = spineLoader.load(PlaceholderSpine);
  placeholderSpine.flipY = true;
  placeholderSpine.wrapS = RepeatWrapping;
  placeholderSpine.wrapT = RepeatWrapping;
  placeholderSpine.repeat.y = -1;

  const spineMaterial = new MeshPhysicalMaterial({
    name: "Spine",
    emissiveMap: placeholderSpine,
    userData: nodes.Cube001_1.material.userData,
    normalScale: nodes.Cube001_1.material.normalScale,
    specularColor: nodes.Cube001_1.material.specularColor,
    clearcoatNormalScale: nodes.Cube001_1.material.clearcoatNormalScale,
    color: nodes.Cube001_1.material.color,
    emissive: nodes.Cube001_1.material.emissive,
    roughness: nodes.Cube001_1.material.roughness,
    side: nodes.Cube001_1.material.side,
    ior: nodes.Cube001_1.material.ior,
  });

  spineMaterial.dispose();
  if (spine) {
    const localImage = spineLoader.load(spine);
    localImage.flipY = true;
    localImage.wrapS = RepeatWrapping;
    localImage.wrapT = RepeatWrapping;
    localImage.repeat.y = -1;
    spineMaterial.emissiveMap = localImage;
    placeholderSpine.dispose();
  }
  return (
    <Selection>
      <EffectComposer>
        <Bloom intensity={1} luminanceThreshold={1} luminanceSmoothing={0.5} />
        <mesh
          geometry={nodes.Cube005.geometry}
          position={nodes.Cube005.position}
          rotation={nodes.Cube005.rotation}
        >
          <meshStandardMaterial
            emissive="white"
            emissiveIntensity={0.5}
            toneMapped={false}
          />
        </mesh>
      </EffectComposer>

      <Select>
        <scene {...props}>
          {/* NEWCASE002 Group - Spine (Cube001_1) + Back Case / Metadata (Cube001_2) */}
          <group {...nodes.NEWCASE002}>
            <mesh
              material={spineMaterial}
              geometry={nodes.Cube001_1.geometry}
              position={nodes.Cube001_1.position}
              rotation={nodes.Cube001_1.rotation}
              up={nodes.Cube001_1.up}
              quaternion={nodes.Cube001_1.quaternion}
              matrix={nodes.Cube001_1.matrix}
              matrixWorld={nodes.Cube001_1.matrixWorld}
              layers={nodes.Cube001_1.layers}
              userData={nodes.Cube001_1.userData}
              scale={1}
            />
            {/* Cube001_2 - Back Case */}
            <mesh
              geometry={nodes.Cube001_2.geometry}
              material={metadataMaterial}
            />
          </group>
          {/* Cube001 Group - Front Artwork (Cube003) + Front Case (Cube003_1) + Holographic Emboss (Cylinder002 - Back? Weirdly located in file.) */}
          <group {...nodes.Cube001}>
            {/* Cube003 - Front Artwork */}
            <mesh geometry={nodes.Cube001.geometry} material={coverMaterial} />
            {/* Cube003_1 - Front Case */}

            {/* Cylinder002 - Holographic Stamp */}
            <mesh {...nodes.Cylinder002} />
          </group>
        </scene>
      </Select>
    </Selection>
  );
}

useGLTF.preload(RecordGLB);
