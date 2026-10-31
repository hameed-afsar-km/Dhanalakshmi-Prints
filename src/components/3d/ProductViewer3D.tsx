'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Product, SavedCustomization } from '@/types';
import { RotateCw, ZoomIn, ZoomOut, RefreshCw, Eye, Sparkles } from 'lucide-react';

interface ProductViewer3DProps {
  product: Product;
  customization: SavedCustomization;
  className?: string;
}

export default function ProductViewer3D({ product, customization, className = '' }: ProductViewer3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const productGroupRef = useRef<THREE.Group | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);
  const [wireframe, setWireframe] = useState(false);

  // Initialize Three.js scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 450;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf8f8f7);

    // Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 35, 95);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxDistance = 220;
    controls.minDistance = 25;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(45, 65, 55);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdce7ff, 1.2);
    fillLight.position.set(-50, 30, -35);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xfff6dd, 0.8);
    rimLight.position.set(0, -40, -50);
    scene.add(rimLight);

    // Ground plane with subtle shadow
    const shadowPlaneGeo = new THREE.PlaneGeometry(160, 160);
    const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.14 });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -18;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // Subtle floor grid
    const gridHelper = new THREE.GridHelper(140, 28, 0x1c0b60, 0xe7e1f5);
    gridHelper.position.y = -18.05;
    scene.add(gridHelper);

    // Product Container Group
    const productGroup = new THREE.Group();
    scene.add(productGroup);
    productGroupRef.current = productGroup;

    // Render loop
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      if (controlsRef.current) {
        controlsRef.current.autoRotate = autoRotate;
        controlsRef.current.autoRotateSpeed = 2.0;
        controlsRef.current.update();
      }

      renderer.render(scene, camera);
    };
    animate();
    setIsLoading(false);

    // Resize handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      controls.dispose();
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update autoRotate on controls
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // Re-build 3D model geometry & textures when customization or product changes
  useEffect(() => {
    const productGroup = productGroupRef.current;
    if (!productGroup) return;

    // Clear existing children and dispose geometries
    while (productGroup.children.length > 0) {
      const child = productGroup.children[0] as THREE.Mesh;
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => m.dispose());
        } else {
          child.material.dispose();
        }
      }
      productGroup.remove(child);
    }

    const bodyHex = customization.bodyColor || '#1c0b60';
    const textHex = customization.textColor || '#fed003';
    const displayText = customization.text || product.customizationSchema.defaultText || '3D PRINT';
    const materialType = customization.material || 'PLA';

    // Material parameters based on filament type
    let roughness = 0.35;
    let metalness = 0.05;
    let clearcoat = 0.1;

    if (materialType === 'Silk PLA') {
      roughness = 0.18;
      metalness = 0.3;
      clearcoat = 0.6;
    } else if (materialType === 'Carbon Fiber PLA') {
      roughness = 0.85;
      metalness = 0.1;
      clearcoat = 0.0;
    } else if (materialType === 'PETG') {
      roughness = 0.28;
      metalness = 0.08;
      clearcoat = 0.4;
    } else if (materialType === 'Resin') {
      roughness = 0.12;
      metalness = 0.02;
      clearcoat = 0.8;
    }

    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(bodyHex),
      roughness,
      metalness,
      clearcoat,
      wireframe,
    });

    const textMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(textHex),
      roughness: 0.25,
      metalness: materialType === 'Silk PLA' ? 0.4 : 0.1,
      wireframe,
    });

    // Helper to generate dynamic high-res embossed texture
    const createTextCanvasTexture = (
      text: string,
      plateWidth: number,
      plateHeight: number,
      bgColor: string,
      fgColor: string,
      subText?: string
    ) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 320;
      const ctx = canvas.getContext('2d')!;

      // Background fill
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Beveled Border stroke
      ctx.strokeStyle = fgColor;
      ctx.lineWidth = 14;
      ctx.strokeRect(18, 18, canvas.width - 36, canvas.height - 36);

      // Main Text
      ctx.fillStyle = fgColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Font styling
      const selectedFont = customization.font || 'Inter';
      ctx.font = `bold 108px ${selectedFont}, sans-serif`;

      // Draw text with subtle embossed shadow
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 4;

      const mainY = subText ? canvas.height * 0.44 : canvas.height * 0.5;
      ctx.fillText(text.toUpperCase(), canvas.width / 2, mainY);

      if (subText) {
        ctx.font = `600 36px ${selectedFont}, sans-serif`;
        ctx.fillStyle = fgColor;
        ctx.fillText(subText, canvas.width / 2, canvas.height * 0.8);
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.anisotropy = 8;
      texture.needsUpdate = true;
      return texture;
    };

    // Build specific 3D model according to modelType
    if (product.modelType === 'plate-keychain') {
      // 1. Plate Body
      const plateWidth = 52;
      const plateHeight = 18;
      const plateDepth = 3.2;

      const plateGeo = new THREE.BoxGeometry(plateWidth, plateHeight, plateDepth, 4, 4, 2);
      const textTexture = createTextCanvasTexture(displayText, plateWidth, plateHeight, bodyHex, textHex, 'IND');

      const plateMaterials = [
        bodyMaterial, // right
        bodyMaterial, // left
        bodyMaterial, // top
        bodyMaterial, // bottom
        new THREE.MeshPhysicalMaterial({ map: textTexture, roughness, metalness }), // front
        bodyMaterial, // back
      ];

      const plateMesh = new THREE.Mesh(plateGeo, plateMaterials);
      plateMesh.castShadow = true;
      plateMesh.receiveShadow = true;
      productGroup.add(plateMesh);

      // 2. Keyhole loop on side
      const loopGeo = new THREE.TorusGeometry(3.6, 1.2, 16, 32);
      const loopMesh = new THREE.Mesh(loopGeo, bodyMaterial);
      loopMesh.position.set(-plateWidth / 2 - 2.5, 0, 0);
      loopMesh.rotation.y = Math.PI / 2;
      loopMesh.castShadow = true;
      productGroup.add(loopMesh);

      // 3. Metallic Chrome Keyring
      const ringGeo = new THREE.TorusGeometry(8.5, 1.0, 16, 48);
      const chromeMaterial = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        metalness: 0.95,
        roughness: 0.15,
      });
      const ringMesh = new THREE.Mesh(ringGeo, chromeMaterial);
      ringMesh.position.set(-plateWidth / 2 - 10, -2, 0);
      ringMesh.rotation.y = Math.PI / 4;
      ringMesh.castShadow = true;
      productGroup.add(ringMesh);

    } else if (product.modelType === 'name-keychain') {
      // Cursive Name Keychain with offset stroke contour and daisy charm (as in user reference)
      const baseWidth = Math.max(52, displayText.length * 7.5);
      const baseGeo = new THREE.BoxGeometry(baseWidth, 18, 5.0);

      // Generate cursive textured plate with thick offset contour
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 360;
      const ctx = canvas.getContext('2d')!;

      ctx.fillStyle = bodyHex;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Rounded soft contour outline plate
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 16;
      ctx.strokeRect(14, 14, canvas.width - 28, canvas.height - 28);

      const formatted = displayText.charAt(0).toUpperCase() + displayText.slice(1);
      ctx.font = "italic bold 170px 'Dancing Script', 'Brush Script MT', 'Pacifico', 'Caveat', 'Segoe Script', cursive, sans-serif";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Thick stroke border in body color
      ctx.lineJoin = 'round';
      ctx.lineWidth = 32;
      ctx.strokeStyle = bodyHex;
      ctx.strokeText(formatted, canvas.width / 2, canvas.height / 2);

      // White outline contour
      ctx.lineWidth = 14;
      ctx.strokeStyle = '#ffffff';
      ctx.strokeText(formatted, canvas.width / 2, canvas.height / 2);

      // Inner text fill with soft 3D shadow
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 4;
      ctx.fillStyle = textHex || '#ffffff';
      ctx.fillText(formatted, canvas.width / 2, canvas.height / 2);

      const cursiveTexture = new THREE.CanvasTexture(canvas);
      cursiveTexture.anisotropy = 8;

      const materials = [
        bodyMaterial,
        bodyMaterial,
        bodyMaterial,
        bodyMaterial,
        new THREE.MeshPhysicalMaterial({ map: cursiveTexture, roughness, metalness }),
        bodyMaterial,
      ];

      const nameMesh = new THREE.Mesh(baseGeo, materials);
      nameMesh.castShadow = true;
      productGroup.add(nameMesh);

      // Keyring attachment loop
      const loopGeo = new THREE.TorusGeometry(4.0, 1.2, 16, 32);
      const loopMesh = new THREE.Mesh(loopGeo, bodyMaterial);
      loopMesh.position.set(-baseWidth / 2 - 2.8, 1, 0);
      productGroup.add(loopMesh);

      // Metal split keyring
      const ringGeo = new THREE.TorusGeometry(8.5, 1.0, 16, 48);
      const chromeMat = new THREE.MeshStandardMaterial({ color: 0xd8d8e0, metalness: 0.9, roughness: 0.15 });
      const ringMesh = new THREE.Mesh(ringGeo, chromeMat);
      ringMesh.position.set(-baseWidth / 2 - 10.5, -1, 0);
      productGroup.add(ringMesh);

      // Daisy flower charm hanging from the ring (as in user reference photo)
      const flowerGroup = new THREE.Group();
      flowerGroup.position.set(-baseWidth / 2 - 6, 9, 1);

      // White petals
      const petalMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const petalGeo = new THREE.SphereGeometry(2.0, 16, 16);
        petalGeo.scale(1.4, 0.9, 0.7);
        const petal = new THREE.Mesh(petalGeo, petalMat);
        petal.position.set(Math.cos(angle) * 3.2, Math.sin(angle) * 3.2, 0);
        petal.rotation.z = angle;
        flowerGroup.add(petal);
      }

      // Pink flower center button
      const centerMat = new THREE.MeshStandardMaterial({ color: 0xe71e64, roughness: 0.2 });
      const centerGeo = new THREE.CylinderGeometry(1.8, 1.8, 1.2, 24);
      centerGeo.rotateX(Math.PI / 2);
      const flowerCenter = new THREE.Mesh(centerGeo, centerMat);
      flowerCenter.position.z = 0.4;
      flowerGroup.add(flowerCenter);

      productGroup.add(flowerGroup);

    } else if (product.modelType === 'desk-nameplate') {
      // Architectural Triangular Beveled Desk Base
      const baseLength = 62;
      const baseHeight = 16;
      const baseDepth = 18;

      // Custom extruded triangular prism
      const shape = new THREE.Shape();
      shape.moveTo(-baseDepth / 2, 0);
      shape.lineTo(baseDepth / 2, 0);
      shape.lineTo(baseDepth / 2 - 5, baseHeight);
      shape.lineTo(-baseDepth / 2 + 5, baseHeight);
      shape.closePath();

      const extrudeSettings = {
        steps: 2,
        depth: baseLength,
        bevelEnabled: true,
        bevelThickness: 1.2,
        bevelSize: 1.0,
        bevelSegments: 3,
      };

      const standGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      standGeo.center();

      const standMesh = new THREE.Mesh(standGeo, bodyMaterial);
      standMesh.rotation.y = Math.PI / 2;
      standMesh.castShadow = true;
      standMesh.receiveShadow = true;
      productGroup.add(standMesh);

      // Angled face with customized typography plate
      const faceGeo = new THREE.PlaneGeometry(baseLength - 6, 12);
      const textTexture = createTextCanvasTexture(displayText, baseLength, 12, bodyHex, textHex, 'EXECUTIVE DESK');
      const faceMat = new THREE.MeshPhysicalMaterial({
        map: textTexture,
        roughness: 0.2,
        metalness: 0.15,
      });
      const faceMesh = new THREE.Mesh(faceGeo, faceMat);
      faceMesh.position.set(0, 3, baseDepth / 2 - 0.8);
      faceMesh.rotation.x = -Math.PI / 14;
      productGroup.add(faceMesh);

    } else if (product.modelType === 'bag-tag') {
      // Heavy-duty travel luggage tag
      const tagW = 46;
      const tagH = 26;
      const tagD = 3.6;

      const tagGeo = new THREE.BoxGeometry(tagW, tagH, tagD);
      const tagTexture = createTextCanvasTexture(displayText, tagW, tagH, bodyHex, textHex, '★ FLIGHT VERIFIED ★');
      const tagMats = [
        bodyMaterial,
        bodyMaterial,
        bodyMaterial,
        bodyMaterial,
        new THREE.MeshPhysicalMaterial({ map: tagTexture, roughness, metalness }),
        bodyMaterial,
      ];
      const tagMesh = new THREE.Mesh(tagGeo, tagMats);
      tagMesh.castShadow = true;
      productGroup.add(tagMesh);

      // Strap slot
      const slotGeo = new THREE.TorusGeometry(4.2, 1.2, 16, 32);
      const slotMesh = new THREE.Mesh(slotGeo, bodyMaterial);
      slotMesh.position.set(0, tagH / 2 + 2.8, 0);
      productGroup.add(slotMesh);

      // Stainless wire loop
      const wireGeo = new THREE.TorusGeometry(12, 0.8, 16, 48);
      const wireMat = new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.9, roughness: 0.2 });
      const wireMesh = new THREE.Mesh(wireGeo, wireMat);
      wireMesh.position.set(0, tagH / 2 + 13, 0);
      productGroup.add(wireMesh);

    } else if (product.modelType === 'lithophane-lamp') {
      const lampRadius = 16;
      const lampHeight = 30;

      // Lithophane shade — translucent, softly emissive panel with etched text
      const shadeTexture = createTextCanvasTexture(
        displayText,
        lampRadius * 2,
        lampHeight,
        '#fdfaf2',
        '#3a2b1c',
        'MEMORY · LIGHT'
      );
      const shadeMaterial = new THREE.MeshPhysicalMaterial({
        map: shadeTexture,
        color: new THREE.Color(bodyHex),
        emissive: new THREE.Color(textHex),
        emissiveIntensity: 0.45,
        roughness: 0.35,
        metalness: 0.02,
        transmission: 0.25,
        transparent: true,
        opacity: 0.96,
        wireframe,
      });

      const shadeGeo = new THREE.CylinderGeometry(lampRadius, lampRadius * 0.92, lampHeight, 64, 1, true);
      const shadeMesh = new THREE.Mesh(shadeGeo, shadeMaterial);
      shadeMesh.position.y = lampHeight / 2 - 4;
      shadeMesh.castShadow = true;
      productGroup.add(shadeMesh);

      // Warm inner glow core
      const glowMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(textHex), transparent: true, opacity: 0.55 });
      const glowMesh = new THREE.Mesh(new THREE.CylinderGeometry(lampRadius * 0.42, lampRadius * 0.42, lampHeight * 0.8, 24), glowMat);
      glowMesh.position.y = lampHeight / 2 - 4;
      productGroup.add(glowMesh);

      // Base plinth
      const plinthMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(bodyHex), roughness: 0.4, metalness: 0.15 });
      const plinth = new THREE.Mesh(new THREE.CylinderGeometry(lampRadius * 1.12, lampRadius * 1.2, 5, 48), plinthMat);
      plinth.position.y = -7.5;
      plinth.castShadow = true;
      plinth.receiveShadow = true;
      productGroup.add(plinth);

      // Top rim
      const rimMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(textHex), metalness: 0.7, roughness: 0.25 });
      const rim = new THREE.Mesh(new THREE.TorusGeometry(lampRadius, 0.8, 12, 64), rimMat);
      rim.rotation.x = Math.PI / 2;
      rim.position.y = lampHeight - 4;
      productGroup.add(rim);

    } else if (product.modelType === 'figurine') {
      // Stylised selfie figurine bust on a personalised base
      const skinMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(bodyHex),
        roughness,
        metalness,
        clearcoat,
        wireframe,
      });

      // Base pedestal
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x241a3d, roughness: 0.45, metalness: 0.2 });
      const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(15, 17, 4.5, 48), baseMat);
      pedestal.position.y = -14;
      pedestal.castShadow = true;
      pedestal.receiveShadow = true;
      productGroup.add(pedestal);

      // Personalised nameplate on pedestal
      const plateTexture = createTextCanvasTexture(displayText, 26, 5, '#241a3d', textHex);
      const namePlate = new THREE.Mesh(
        new THREE.PlaneGeometry(24, 4.4),
        new THREE.MeshPhysicalMaterial({ map: plateTexture, roughness: 0.3, metalness: 0.2 })
      );
      namePlate.position.set(0, -13.6, 16.6);
      productGroup.add(namePlate);

      // Torso
      const torso = new THREE.Mesh(new THREE.CylinderGeometry(9, 12, 16, 32), skinMat);
      torso.position.y = -4;
      torso.castShadow = true;
      productGroup.add(torso);

      // Shoulders
      const shoulders = new THREE.Mesh(new THREE.SphereGeometry(12.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), skinMat);
      shoulders.position.y = 2;
      shoulders.scale.y = 0.55;
      shoulders.castShadow = true;
      productGroup.add(shoulders);

      // Neck
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 4.2, 5, 24), skinMat);
      neck.position.y = 7;
      productGroup.add(neck);

      // Head
      const head = new THREE.Mesh(new THREE.SphereGeometry(7.2, 40, 32), skinMat);
      head.position.y = 14;
      head.scale.set(0.92, 1.08, 0.98);
      head.castShadow = true;
      productGroup.add(head);

      // Hair cap
      const hairMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(textHex), roughness: 0.7, metalness: 0.05 });
      const hair = new THREE.Mesh(new THREE.SphereGeometry(7.5, 40, 24, 0, Math.PI * 2, 0, Math.PI / 2), hairMat);
      hair.position.y = 14.6;
      hair.scale.set(0.98, 0.85, 1.02);
      productGroup.add(hair);

      // Display ring behind figure
      const halo = new THREE.Mesh(
        new THREE.TorusGeometry(17, 0.7, 12, 72),
        new THREE.MeshStandardMaterial({ color: new THREE.Color(textHex), metalness: 0.8, roughness: 0.2 })
      );
      halo.position.y = 4;
      productGroup.add(halo);

    } else {
      // Parametric Spiral Art Miniature
      const radius = 12;
      const height = 36;
      const geometry = new THREE.CylinderGeometry(radius * 0.7, radius, height, 32, 32);
      const pos = geometry.attributes.position;

      // Mathematical twist deformation for spiral sculpture
      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i);
        const angle = (y / height) * Math.PI * 2.2;
        const x = pos.getX(i);
        const z = pos.getZ(i);

        const newX = x * Math.cos(angle) - z * Math.sin(angle);
        const newZ = x * Math.sin(angle) + z * Math.cos(angle);
        // waist pinching
        const factor = 1 - 0.25 * Math.sin((y / height + 0.5) * Math.PI);
        pos.setX(i, newX * factor);
        pos.setZ(i, newZ * factor);
      }
      geometry.computeVertexNormals();

      const vaseMesh = new THREE.Mesh(geometry, bodyMaterial);
      vaseMesh.position.y = height / 2 - 8;
      vaseMesh.castShadow = true;
      vaseMesh.receiveShadow = true;
      productGroup.add(vaseMesh);

      // Wooden base if selected or by default
      const baseGeo = new THREE.CylinderGeometry(radius * 1.2, radius * 1.3, 4, 32);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x3d271d, roughness: 0.6 });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.position.y = -8;
      baseMesh.receiveShadow = true;
      productGroup.add(baseMesh);
    }
  }, [product, customization, wireframe]);

  const handleResetCamera = () => {
    if (controlsRef.current && cameraRef.current) {
      cameraRef.current.position.set(0, 35, 95);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const handleZoom = (delta: number) => {
    if (cameraRef.current && controlsRef.current) {
      const dir = cameraRef.current.position.clone().sub(controlsRef.current.target).normalize();
      cameraRef.current.position.addScaledVector(dir, delta);
      controlsRef.current.update();
    }
  };

  return (
    <div className={`relative w-full h-full min-h-[420px] rounded-2xl overflow-hidden border border-brand-primary/10 bg-gradient-to-b from-brand-lavender/60 via-brand-offwhite to-brand-lavender/30 shadow-inner ${className}`}>
      {/* 3D Canvas Canvas Hook */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10">
          <div className="w-10 h-10 border-4 border-brand-lavender border-t-brand-primary rounded-full animate-spin mb-3" />
          <span className="text-[10px] font-mono font-semibold text-brand-primary/60 uppercase tracking-[0.16em]">Generating 3D Mesh...</span>
        </div>
      )}

      {/* Floating 3D Interaction Toolbar */}
      <div className="absolute top-4 right-4 flex flex-col gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-xl border border-brand-primary/10 shadow-lg z-10">
        <button
          onClick={handleResetCamera}
          title="Reset Camera View"
          className="p-2 rounded-lg text-brand-navy/70 hover:bg-brand-lavender transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          title={autoRotate ? 'Stop Rotation' : 'Auto Rotate'}
          className={`p-2 rounded-lg transition-colors ${autoRotate ? 'bg-brand-primary text-white' : 'text-brand-navy/70 hover:bg-brand-lavender'}`}
        >
          <RotateCw className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom(-15)}
          title="Zoom In"
          className="p-2 rounded-lg text-brand-navy/70 hover:bg-brand-lavender transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom(15)}
          title="Zoom Out"
          className="p-2 rounded-lg text-brand-navy/70 hover:bg-brand-lavender transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => setWireframe(!wireframe)}
          title="Toggle Mesh Wireframe"
          className={`p-2 rounded-lg transition-colors ${wireframe ? 'bg-brand-gold text-brand-navy' : 'text-brand-navy/70 hover:bg-brand-lavender'}`}
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Live Status Pill */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-brand-primary/10 shadow-sm text-[9px] font-mono uppercase tracking-[0.1em] text-brand-navy/60 pointer-events-none z-10">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-teal animate-pulse" />
        <span>Realtime 3D</span>
        <span className="text-brand-primary/20">|</span>
        <span className="text-brand-primary font-semibold">{customization.material || 'PLA'}</span>
      </div>

      {/* Interaction Hint */}
      <div className="absolute bottom-4 right-4 text-[9px] font-mono uppercase tracking-[0.1em] text-brand-navy/40 bg-white/80 px-2.5 py-1 rounded-md backdrop-blur-sm pointer-events-none hidden sm:block">
        Drag to rotate · Scroll to zoom
      </div>
    </div>
  );
}
