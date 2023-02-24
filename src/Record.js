import React from "react";
import { Select, useGLTF } from "@react-three/drei";
import GifLoader from "three-gif-loader";
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
import SpineTitleGif from "./assets/SpineTitleGif.gif";

export default function Record({
  cover,
  metadata,
  spine,
  isReflaction,
  ...props
}) {
  const { nodes } = useGLTF(RecordGLB);
  const coverLoader = new TextureLoader();
  coverLoader.needsUpdate = true;
  const placeholderCover = coverLoader.load(PlaceholderCover);
  placeholderCover.flipY = false;

  const coverMaterial = new MeshStandardMaterial({
    name: "Cover",
    map: placeholderCover,
    roughness: isReflaction === true ? 0.3 : 1,
    metalness: isReflaction === true ? 1 : 0,
  });

  if (cover) {
    const localImage = coverLoader.load(cover);
    localImage.flipY = false;
    localImage.encoding = nodes.Cube001.material.map.encoding;
    coverMaterial.map = localImage;
    coverMaterial.roughness = isReflaction === true ? 0.3 : 1;
    coverMaterial.metalness = isReflaction === true ? 1 : 0;
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
    roughness: isReflaction === true ? 0.3 : 1,
    metalness: isReflaction === true ? 1 : 0,
  });

  if (metadata) {
    const localImage = metadataLoader.load(metadata);
    localImage.flipY = true;
    localImage.wrapS = RepeatWrapping;
    localImage.repeat.x = -1;
    localImage.encoding = nodes.Cube001_2.material.map.encoding;
    metadataMaterial.map = localImage;
    placeholderMetadata.dispose();
  }

  const gifLoader = new GifLoader();
  const spineTexture = gifLoader.load(SpineTitleGif);
  spineTexture.flipY = true;
  spineTexture.rotation = Math.PI;
  spineTexture.wrapS = RepeatWrapping;
  spineTexture.wrapT = RepeatWrapping;
  spineTexture.repeat.x = -1;
  spineTexture.repeat.y = 9;

  const spineMaterial = new MeshPhysicalMaterial({
    name: "Spine",
    map: spineTexture,
    roughness: isReflaction === true ? 0.3 : 1,
    metalness: isReflaction === true ? 1 : 0,
  });
  spineMaterial.dispose();
  if (spine) {
    const localImage = gifLoader.load(spine);
    localImage.flipY = true;
    localImage.rotation = Math.PI;
    localImage.wrapS = RepeatWrapping;
    localImage.wrapT = RepeatWrapping;
    localImage.repeat.x = -1;
    localImage.repeat.y = 9;
    spineMaterial.map = localImage;
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
