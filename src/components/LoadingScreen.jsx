import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import * as THREE from 'three';

const TOTAL_POINTS = 2000;

export default function LoadingScreen({ onComplete }) {
  const sceneRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const dots = useMemo(() => Array.from({ length: 150 }, (_, index) => ({
    id: index,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: `${Math.random() * 3 + 1}px`,
    duration: `${Math.random() * 5 + 3}s`,
    delay: `${Math.random() * 2}s`,
  })), []);

  useEffect(() => {
    const host = sceneRef.current;
    if (!host) return undefined;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 8;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.setSize(window.innerWidth, window.innerHeight);
    host.appendChild(renderer.domElement);

    const positions = new Float32Array(TOTAL_POINTS * 3);
    const colors = new Float32Array(TOTAL_POINTS * 3);
    const color = new THREE.Color();
    const palette = [0x4de7ff, 0x8f6bff, 0xffbd67, 0xff4f9a, 0xffffff];
    for (let index = 0; index < TOTAL_POINTS; index += 1) {
      const radius = 3.8 + Math.random() * 5.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const offset = index * 3;
      positions[offset] = radius * Math.sin(phi) * Math.cos(theta);
      positions[offset + 1] = radius * Math.cos(phi);
      positions[offset + 2] = radius * Math.sin(phi) * Math.sin(theta);
      color.setHex(palette[Math.floor(Math.random() * palette.length)]);
      colors[offset] = color.r;
      colors[offset + 1] = color.g;
      colors[offset + 2] = color.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({ size: 0.035, vertexColors: true, transparent: true, opacity: 0.82, depthWrite: false });
    const points = new THREE.Points(geometry, material);
    scene.add(points);
    let frame;
    const resize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    const animate = () => {
      points.rotation.y += 0.00028;
      points.rotation.x = Math.sin(Date.now() * 0.00012) * 0.07;
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(animate);
    };
    window.addEventListener('resize', resize, { passive: true });
    animate();

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  useEffect(() => {
    let value = 0;
    let tick = 0;
    const interval = window.setInterval(() => {
      tick += 1;
      value = Math.min(Math.round((tick / 30) * 100), 100);
      setProgress(value);
      if (tick >= 30) {
        window.clearInterval(interval);
        window.setTimeout(() => setDismissed(true), 420);
      }
    }, 100);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (dismissed) {
      const timeout = window.setTimeout(onComplete, 650);
      return () => window.clearTimeout(timeout);
    }
    return undefined;
  }, [dismissed, onComplete]);

  const phase = progress < 30 ? 'Gathering Cosmic Energy...' : progress < 70 ? 'Materializing Reality...' : 'Unleashing Potential...';
  const circumference = 2 * Math.PI * 74;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div className="loading-screen" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.65 }}>
          <div className="loading-orb loading-orb-one" />
          <div className="loading-orb loading-orb-two" />
          <div ref={sceneRef} className="loading-three" aria-hidden="true" />
          <div className="loading-dots" aria-hidden="true">
            {dots.map((dot) => <motion.span key={dot.id} className="loading-dot" style={{ left: dot.left, top: dot.top, width: dot.size, height: dot.size }} animate={{ y: [0, -22, 0], opacity: [0.12, 0.86, 0.12] }} transition={{ duration: dot.duration.replace('s', ''), delay: dot.delay.replace('s', ''), repeat: Infinity, ease: 'easeInOut' }} />)}
          </div>
          <div className="loading-content">
            <motion.div className="loading-kicker" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>MCA DEPARTMENT PRESENTS</motion.div>
            <motion.h1 className="loading-title" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }}>IGNITE</motion.h1>
            <motion.div className="loading-version" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>FRESHERS' PARTY</motion.div>
            <div className="loading-ring-wrap">
              <svg className="loading-ring" viewBox="0 0 180 180" role="img" aria-label={`Loading ${progress}%`}>
                <defs><linearGradient id="loading-ring" x1="0%" x2="100%"><stop offset="0%" stopColor="#4de7ff" /><stop offset="50%" stopColor="#6d7cff" /><stop offset="100%" stopColor="#b55cff" /></linearGradient></defs>
                <circle className="loading-ring-track" cx="90" cy="90" r="74" />
                <circle className="loading-ring-progress" cx="90" cy="90" r="74" strokeDasharray={circumference} strokeDashoffset={offset} />
              </svg>
              <strong>{progress}%</strong>
            </div>
            <motion.p key={phase} className="loading-phase" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>{phase}</motion.p>
            <p className="loading-note">Preparing the IGNITE experience</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
