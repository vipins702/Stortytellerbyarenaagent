"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense } from "react";

function Model({ url, scale }: { url: string; scale: number }) {
  const gltf = useGLTF(url);
  return <primitive object={gltf.scene} scale={scale} position={[0, -0.8, 0]} />;
}

export function ModelViewer({ url, scale = 1.6, autoRotate = true, environment = "city" }: { url?: string; scale?: number; autoRotate?: boolean; environment?: any }) {
  if (!url) return <div className="relative grid h-[380px] place-items-center overflow-hidden rounded-[2rem] bg-[#1a1a1a] text-white"><div className="absolute h-56 w-56 rounded-full bg-[#D4AF37]/30 blur-3xl"/><span className="relative text-8xl">◈</span><p className="absolute bottom-6 text-sm text-white/60">3D model ready</p></div>;
  return <div className="h-[420px] overflow-hidden rounded-[2rem] bg-[#111]"><Canvas camera={{ position: [0, 1.2, 4], fov: 42 }}><ambientLight intensity={0.7}/><directionalLight position={[3, 4, 5]} intensity={1.4}/><Suspense fallback={null}><Model url={url} scale={scale}/><Environment preset={environment} /></Suspense><OrbitControls enablePan={false} autoRotate={autoRotate} autoRotateSpeed={1.2}/></Canvas></div>;
}
