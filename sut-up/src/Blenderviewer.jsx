import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default function BlenderViewer({
  // New API: array of config objects
  models: modelConfigs,

  // Legacy API: plain array of URL strings
  urls,

  // Container height
  height = "600px",
}) {

  const mountRef = useRef(null);

  // Normalize: support both urls={[...]}
  // and models={[{url, scale, ...}]}
  const configs = modelConfigs
    ? modelConfigs
    : (urls ?? []).map((u) => ({ url: u }));

  useEffect(() => {

    if (!configs.length) return;

    const mount = mountRef.current;
    const width = mount.clientWidth;
    const h = mount.clientHeight;
    

    // ── SCENE ──
    const scene = new THREE.Scene();

    // ── CAMERA ──
    const camera = new THREE.PerspectiveCamera(
      45,
      width / h,
      0.1,
      200
    );

    camera.position.set(0, 0, 10);

    // ── RENDERER ──
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setSize(width, h);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;

    mount.appendChild(renderer.domElement);

    // ── LIGHTS ──
    scene.add(new THREE.AmbientLight(0xffffff, 1.5));

    const spot = new THREE.SpotLight(0xffffff, 2);
    spot.position.set(10, 10, 10);
    scene.add(spot);

    const fill = new THREE.DirectionalLight(0xffffff, 0.8);
    fill.position.set(-10, -5, -10);
    scene.add(fill);

    // ── CONTROLS ──
    const controls = new OrbitControls(
      camera,
      renderer.domElement
    );

    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.3;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // ── LOAD MODELS ──
    const loader = new GLTFLoader();
    const loadedModels = [];

    // Determine camera distance based on model count
    const count = configs.length;
    const spreadRadius = 2;

    camera.position.set(0, 0, 12);

    configs.forEach((config, i) => {

      const url = config.url;

      if (!url) {
        console.warn(
          `BlenderViewer: config at index ${i} has no url`,
          config
        );
        return;
      }

      loader.load(

        url,

        (gltf) => {
          const model = gltf.scene;

          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);

          // Center the mesh within the pivot
          model.position.sub(center);
          model.scale.setScalar((config.scale ?? 1.0) / maxDim);
          

          // ── wrap in a pivot group ──
          const pivot = new THREE.Group();
          pivot.add(model);

          // Apply position/rotation to the PIVOT, not the model
          if (config.position) {
            pivot.position.set(config.position[0], config.position[1], config.position[2]);
          } else if (count > 1) {
            const angle = (i / count) * Math.PI * 2;
            const radius = 3.5;
            pivot.position.x = Math.cos(angle) * radius;
            pivot.position.y = Math.sin(angle) * radius * 0.5;
            pivot.position.z = Math.sin(angle) * 1.2;
          }

          if (config.rotation) {
            pivot.rotation.set(config.rotation[0] ?? 0, config.rotation[1] ?? 0, config.rotation[2] ?? 0);
          }

          // Copy animation data to pivot
          pivot.userData.floatSpeed = config.floatSpeed ?? 0.4 + Math.random() * 0.3;
          pivot.userData.floatAmount = config.floatAmount ?? 0.2;
          pivot.userData.floatOffset = config.floatOffset ?? Math.random() * Math.PI * 2;
          pivot.userData.rotSpeed = config.rotSpeed ?? (Math.random() - 0.5) * 0.01;
          pivot.userData.originY = pivot.position.y;
          pivot.userData.originX = pivot.position.x;
          pivot.userData.animation = config.animation ?? "float";
          pivot.userData.spinSpeed = config.rotSpeed ?? 0.005;

          scene.add(pivot);
          loadedModels.push(pivot);  
        },

        undefined,

        (err) => {
          console.error(
            `BlenderViewer: failed to load "${url}"`,
            err
          );
        }
      );
    });

    // ── ANIMATION LOOP ──

    let animId;

    const animate = () => {

      animId = requestAnimationFrame(animate);

      const t = Date.now() * 0.001;

      loadedModels.forEach((model, index) => {

        const anim = model.userData.animation;

        if (anim === "float") {
          // --- ORIGINAL FLOAT LOGIC RESTORED ---
          model.rotation.x = Math.PI / 2;

          model.position.y =
            model.userData.originY +
            Math.sin(
              t * model.userData.floatSpeed +
              model.userData.floatOffset
            ) *
              model.userData.floatAmount;

          model.position.x =
            model.userData.originX +
            Math.sin(t * 0.3 + index) * 0.08;

          model.rotation.y +=
            model.userData.rotSpeed;
        }

        else if (anim === "bop") {
        // stand still
          model.rotation.x = Math.PI / 2;
          model.rotation.z = t * model.userData.rotSpeed;
          model.position.y =
          model.userData.originY +
          Math.sin(t * 1.2 + model.userData.floatOffset) * 0.08;
        }
      });

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // ── RESIZE HANDLER ──

    const onResize = () => {

      const w = mount.clientWidth;
      const newH = mount.clientHeight;

      camera.aspect = w / newH;
      camera.updateProjectionMatrix();

      renderer.setSize(w, newH);
    };

    window.addEventListener(
      "resize",
      onResize
    );

    // ── CLEANUP ──

    return () => {

      cancelAnimationFrame(animId);

      controls.dispose();
      renderer.dispose();

      if (
        mount.contains(renderer.domElement)
      ) {
        mount.removeChild(
          renderer.domElement
        );
      }

      window.removeEventListener(
        "resize",
        onResize
      );
    };

  }, [JSON.stringify(configs)]);

  return (
    <div
      ref={mountRef}
      style={{
        height,
        width: "100%",
        borderRadius: "20px",
        overflow: "hidden",
      }}
    />
  );
}