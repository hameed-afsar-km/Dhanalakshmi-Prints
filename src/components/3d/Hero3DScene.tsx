'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function Hero3DScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animIdRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 550;
    const height = container.clientHeight || 520;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 18, 75);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false; // keep hero zoom disabled for effortless page scrolling
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.6;

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(40, 50, 45);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xe71e64, 1.8); // Accent pink rim light
    rimLight.position.set(-45, -20, -35);
    scene.add(rimLight);

    const goldFill = new THREE.DirectionalLight(0xfed003, 1.2); // Brand gold fill light
    goldFill.position.set(25, -30, 20);
    scene.add(goldFill);

    // Hero Floating Objects Group
    const heroGroup = new THREE.Group();
    scene.add(heroGroup);

    // 1. Central 3D Number Plate Keychain
    const plateWidth = 46;
    const plateHeight = 16;
    const plateGeo = new THREE.BoxGeometry(plateWidth, plateHeight, 3.2);

    // Texture with "DHANALAKSHMI" in brand colors
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 320;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#1c0b60'; // Primary Indigo
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#fed003'; // Gold border
    ctx.lineWidth = 14;
    ctx.strokeRect(18, 18, canvas.width - 36, canvas.height - 36);

    ctx.fillStyle = '#fed003';
    ctx.font = 'bold 96px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('TN 09 DP 2026', canvas.width / 2, canvas.height * 0.44);

    ctx.fillStyle = '#ffffff';
    ctx.font = '600 32px sans-serif';
    ctx.fillText('★ DHANALAKSHMI PRINTS ★', canvas.width / 2, canvas.height * 0.8);

    const plateTex = new THREE.CanvasTexture(canvas);
    plateTex.anisotropy = 8;

    const indigoMat = new THREE.MeshPhysicalMaterial({
      color: 0x1c0b60,
      roughness: 0.25,
      metalness: 0.1,
      clearcoat: 0.5,
    });
    const frontMat = new THREE.MeshPhysicalMaterial({
      map: plateTex,
      roughness: 0.25,
      metalness: 0.15,
      clearcoat: 0.5,
    });

    const plateMesh = new THREE.Mesh(plateGeo, [indigoMat, indigoMat, indigoMat, indigoMat, frontMat, indigoMat]);
    plateMesh.position.set(-4, 4, 0);
    plateMesh.rotation.set(0.1, -0.2, 0.08);
    plateMesh.castShadow = true;
    heroGroup.add(plateMesh);

    // Split ring
    const ringGeo = new THREE.TorusGeometry(7.5, 0.9, 16, 48);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xfed003, metalness: 0.9, roughness: 0.2 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.set(-plateWidth / 2 - 12, 6, 0);
    ringMesh.rotation.set(0.3, 0.6, 0.4);
    heroGroup.add(ringMesh);

    // 2. Floating 3D Geometric Polyhedron / Diamond (Art Piece)
    const polyGeo = new THREE.IcosahedronGeometry(10, 0);
    const polyMat = new THREE.MeshPhysicalMaterial({
      color: 0xe71e64,
      metalness: 0.2,
      roughness: 0.1,
      clearcoat: 1.0,
      transmission: 0.3,
      thickness: 1.5,
    });
    const polyMesh = new THREE.Mesh(polyGeo, polyMat);
    polyMesh.position.set(26, -10, 8);
    polyMesh.rotation.set(0.4, 0.2, 0.5);
    heroGroup.add(polyMesh);

    // 3. Floating Golden Ring
    const torusGeo = new THREE.TorusGeometry(12, 1.2, 16, 48);
    const torusMat = new THREE.MeshStandardMaterial({ color: 0x019c87, metalness: 0.8, roughness: 0.25 });
    const torusMesh = new THREE.Mesh(torusGeo, torusMat);
    torusMesh.position.set(-18, -14, -8);
    torusMesh.rotation.set(1.1, 0.4, 0.2);
    heroGroup.add(torusMesh);

    // Animation loop with gentle floating motion
    let clock = new THREE.Clock();
    const animate = () => {
      animIdRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Gentle floating sine motion
      plateMesh.position.y = 4 + Math.sin(elapsed * 1.5) * 1.8;
      plateMesh.rotation.z = 0.08 + Math.cos(elapsed * 1.2) * 0.04;

      polyMesh.position.y = -10 + Math.cos(elapsed * 1.8) * 2.2;
      polyMesh.rotation.x += 0.008;
      polyMesh.rotation.y += 0.012;

      torusMesh.position.y = -14 + Math.sin(elapsed * 1.4) * 2.0;
      torusMesh.rotation.x += 0.005;
      torusMesh.rotation.z += 0.008;

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      controls.dispose();
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[380px] sm:h-[460px] lg:h-[520px] rounded-3xl overflow-hidden bg-gradient-to-tr from-slate-100/90 via-indigo-50/40 to-amber-50/30 border border-slate-200/80 shadow-2xl shadow-indigo-950/5">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      {/* Floating Badges */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 shadow-sm flex items-center gap-2 text-xs font-semibold text-slate-800 pointer-events-none">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        Interactive 3D Demo Preview
      </div>
      <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-200/80 text-[11px] font-medium text-slate-500 pointer-events-none hidden sm:block">
        Drag to inspect in 360°
      </div>
    </div>
  );
}
