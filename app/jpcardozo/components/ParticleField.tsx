'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * ParticleField - Subtle Three.js Background
 * 
 * Minimalist particle system for visual depth without distraction.
 * Creates a professional, sophisticated atmosphere.
 */

interface ParticleFieldProps {
  density?: number;
  color?: string;
  opacity?: number;
}

export function ParticleField({ 
  density = 800, 
  color = '#3b82f6',
  opacity = 0.4 
}: ParticleFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene?: THREE.Scene;
    camera?: THREE.PerspectiveCamera;
    renderer?: THREE.WebGLRenderer;
    particles?: THREE.Points;
    animationId?: number;
  }>({});

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Particle system
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(density * 3);
    const velocities = new Float32Array(density * 3);

    for (let i = 0; i < density * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 100;
      positions[i + 1] = (Math.random() - 0.5) * 100;
      positions[i + 2] = (Math.random() - 0.5) * 100;

      velocities[i] = (Math.random() - 0.5) * 0.02;
      velocities[i + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i + 2] = (Math.random() - 0.5) * 0.02;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: new THREE.Color(color),
      size: 0.8,
      transparent: true,
      opacity: opacity,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Store refs
    sceneRef.current = { scene, camera, renderer, particles };

    // Animation
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      sceneRef.current.animationId = animationId;

      // Rotate particles subtly
      particles.rotation.y += 0.0005;
      particles.rotation.x += 0.0002;

      // Mouse interaction
      camera.position.x += (mouseX * 2 - camera.position.x) * 0.02;
      camera.position.y += (mouseY * 2 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      // Animate particles
      const positions = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += velocities[i];
        positions[i + 1] += velocities[i + 1];
        positions[i + 2] += velocities[i + 2];

        // Boundary check
        if (Math.abs(positions[i]) > 50) velocities[i] *= -1;
        if (Math.abs(positions[i + 1]) > 50) velocities[i + 1] *= -1;
        if (Math.abs(positions[i + 2]) > 50) velocities[i + 2] *= -1;
      }
      geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!sceneRef.current.camera || !sceneRef.current.renderer) return;
      
      sceneRef.current.camera.aspect = window.innerWidth / window.innerHeight;
      sceneRef.current.camera.updateProjectionMatrix();
      sceneRef.current.renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      if (sceneRef.current.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }
      
      if (sceneRef.current.renderer) {
        sceneRef.current.renderer.dispose();
        containerRef.current?.removeChild(sceneRef.current.renderer.domElement);
      }
      
      geometry.dispose();
      material.dispose();
    };
  }, [density, color, opacity]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 -z-10"
      style={{ pointerEvents: 'none' }}
    />
  );
}
