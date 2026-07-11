/**
 * TribalEmblem3D — شعار قبيلة السياحين «وسم الباب» ثلاثي الأبعاد
 *
 * يعرض الشعار (قطعتان رأسيتان وشريط علوي) بمادة ذهبية معدنية مصقولة،
 * إضاءة سينمائية متعددة المصادر، توهج bloom، جسيمات غبار خفيفة،
 * وحركة كاميرا افتتاحية بطيئة ثم دوران تلقائي يُوقف عند التفاعل.
 *
 * يستخدم Three.js (موجود في المشروع) مع OrbitControls وEffectComposer
 * من three/examples/jsm. يُحمَّل بـ React.lazy لتجنب تأخير الصفحة.
 */
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsType } from 'three/examples/jsm/controls/OrbitControls.js';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface TribalEmblem3DProps {
  /** يُستدعى بعد انتهاء الحركة الافتتاحية للكاميرا */
  onIntroDone?: () => void;
  /** هل يعمل في وضع كامل الشاشة (Hero)؟ يضبط زاوية الكاميرا */
  fullscreen?: boolean;
}

/* ─── ثوابت التصميم ─── */
const GOLD_COLOR = 0xd4af37;
const GOLD_LIGHT = 0xebd481;
const RIM_COLOR = 0x4466aa;
const AMBIENT_COLOR = 0x3d2a0a;
const BG_COLOR = 0x070503; // --ink

/* أبعاد عناصر الشعار الثلاثة */
const PILLAR_W = 0.22;
const PILLAR_H = 1.5;
const PILLAR_D = 0.22;
const BAR_W = 2.46;
const BAR_H = 0.22;
const BAR_D = 0.22;
const PILLAR_X = 1.12;
const BAR_Y = PILLAR_H / 2 + BAR_H / 2;

export default function TribalEmblem3D({ onIntroDone, fullscreen = false }: TribalEmblem3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    /* ─── الحجم الأولي ─── */
    const getSize = () => ({
      w: el.clientWidth || 800,
      h: el.clientHeight || (fullscreen ? 600 : 380),
    });
    const { w: initW, h: initH } = getSize();

    /* ─── الـ Renderer ─── */
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(initW, initH);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setClearColor(BG_COLOR, 1);
    el.appendChild(renderer.domElement);

    /* ─── المشهد والكاميرا ─── */
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(BG_COLOR, 0.05);

    /* في وضع الشاشة الكاملة نستخدم زاوية نظر أضيق لإبراز الشعار */
    const fov = fullscreen ? 38 : 45;
    const camera = new THREE.PerspectiveCamera(fov, initW / Math.max(initH, 1), 0.1, 100);
    const CAM_Z_START = fullscreen ? 9.5 : 8.5;
    const CAM_Z_END   = fullscreen ? 5.5 : 5.0;
    const CAM_Y_START = fullscreen ? 2.2 : 1.8;
    const CAM_Y_END   = fullscreen ? 0.6 : 0.5;
    camera.position.set(0, CAM_Y_START, CAM_Z_START);
    camera.lookAt(0, 0.4, 0);

    /* ─── الإضاءة ─── */
    const ambient = new THREE.AmbientLight(AMBIENT_COLOR, 0.55);
    scene.add(ambient);

    const mainLight = new THREE.DirectionalLight(GOLD_LIGHT, 3.2);
    mainLight.position.set(2.5, 4, 3.5);
    scene.add(mainLight);

    const rimLight = new THREE.DirectionalLight(RIM_COLOR, 1.8);
    rimLight.position.set(-3, 2, -4);
    scene.add(rimLight);

    const shimmerLight = new THREE.PointLight(GOLD_LIGHT, 2.5, 6);
    shimmerLight.position.set(0, 1.5, 2);
    scene.add(shimmerLight);

    const groundGlow = new THREE.PointLight(0xc9903a, 1.2, 4);
    groundGlow.position.set(0, -1.2, 1.5);
    scene.add(groundGlow);

    /* ─── بيئة الانعكاسات الإجرائية ─── */
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0x1a1008);
    const envL1 = new THREE.PointLight(GOLD_LIGHT, 8, 10);
    envL1.position.set(2, 3, 2);
    envScene.add(envL1);
    const envL2 = new THREE.PointLight(0x2244aa, 4, 10);
    envL2.position.set(-3, 1, -3);
    envScene.add(envL2);
    envScene.add(new THREE.AmbientLight(0x201208, 3));
    const envRT = pmremGenerator.fromScene(envScene);
    scene.environment = envRT.texture;
    pmremGenerator.dispose();

    /* ─── مادة الذهب ─── */
    const goldMat = new THREE.MeshStandardMaterial({
      color: GOLD_COLOR,
      metalness: 0.92,
      roughness: 0.12,
      envMapIntensity: 1.4,
    });

    /* ─── هندسة الشعار: ثلاث قطع ─── */
    const emblemGroup = new THREE.Group();

    const leftPillar = new THREE.Mesh(
      new THREE.BoxGeometry(PILLAR_W, PILLAR_H, PILLAR_D),
      goldMat,
    );
    leftPillar.position.set(-PILLAR_X, 0, 0);
    emblemGroup.add(leftPillar);

    const rightPillar = new THREE.Mesh(
      new THREE.BoxGeometry(PILLAR_W, PILLAR_H, PILLAR_D),
      goldMat,
    );
    rightPillar.position.set(PILLAR_X, 0, 0);
    emblemGroup.add(rightPillar);

    const topBar = new THREE.Mesh(
      new THREE.BoxGeometry(BAR_W, BAR_H, BAR_D),
      goldMat,
    );
    topBar.position.set(0, BAR_Y, 0);
    emblemGroup.add(topBar);

    emblemGroup.position.y = -BAR_Y / 2;
    scene.add(emblemGroup);

    /* ─── هالة ضوئية أرضية ─── */
    const haloGeo = new THREE.CircleGeometry(1.6, 48);
    const haloMat = new THREE.MeshBasicMaterial({
      color: GOLD_COLOR,
      transparent: true,
      opacity: 0.06,
      side: THREE.DoubleSide,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.rotation.x = -Math.PI / 2;
    halo.position.y = -PILLAR_H / 2 - BAR_Y / 2 - 0.08;
    scene.add(halo);

    /* ─── جسيمات الغبار الذهبي ─── */
    const DUST_COUNT = 140;
    const dustPositions = new Float32Array(DUST_COUNT * 3);
    const dustVelocities: number[] = [];
    for (let i = 0; i < DUST_COUNT; i++) {
      dustPositions[i * 3]     = (Math.random() - 0.5) * 7;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 5;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 4 - 0.5;
      dustVelocities.push(
        (Math.random() - 0.5) * 0.004,
        (Math.random() - 0.5) * 0.003,
        0,
      );
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: GOLD_LIGHT,
      size: 0.018,
      transparent: true,
      opacity: 0.5,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    /* ─── نجوم خلفية ─── */
    const STAR_COUNT = 80;
    const starPos = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      starPos[i * 3]     = (Math.random() - 0.5) * 24;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      starPos[i * 3 + 2] = -10 - Math.random() * 10;
    }
    const starsGeo = new THREE.BufferGeometry();
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starsMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.07,
      transparent: true,
      opacity: 0.45,
    });
    scene.add(new THREE.Points(starsGeo, starsMat));

    /* ─── OrbitControls (تحميل غير متزامن) ─── */
    let controls: OrbitControlsType | null = null;
    let userInteracted = false;

    void import('three/examples/jsm/controls/OrbitControls.js').then(({ OrbitControls }) => {
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.06;
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.minPolarAngle = Math.PI / 4;
      controls.maxPolarAngle = (Math.PI * 3) / 4;
      controls.autoRotate = !prefersReduced;
      controls.autoRotateSpeed = 0.5;
      controls.addEventListener('start', () => {
        userInteracted = true;
        controls.autoRotate = false;
      });
    });

    /* ─── EffectComposer + UnrealBloomPass (تحميل غير متزامن) ─── */
    let composer: { render: () => void; setSize: (w: number, h: number) => void } | null = null;

    void Promise.all([
      import('three/examples/jsm/postprocessing/EffectComposer.js'),
      import('three/examples/jsm/postprocessing/RenderPass.js'),
      import('three/examples/jsm/postprocessing/UnrealBloomPass.js'),
      import('three/examples/jsm/postprocessing/OutputPass.js'),
    ]).then(([{ EffectComposer }, { RenderPass }, { UnrealBloomPass }, { OutputPass }]) => {
      const comp = new EffectComposer(renderer);
      comp.addPass(new RenderPass(scene, camera));
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(initW, initH),
        0.42,  // strength
        0.48,  // radius
        0.74,  // threshold
      );
      comp.addPass(bloomPass);
      comp.addPass(new OutputPass());
      composer = comp;
    });

    /* ─── حلقة الرسم ─── */
    let raf = 0;
    const startTime = performance.now();
    const INTRO_DURATION = prefersReduced ? 0 : 2500;
    let introDoneFired = false;

    function easeOutCubic(t: number) {
      return 1 - Math.pow(1 - t, 3);
    }

    function animate() {
      raf = requestAnimationFrame(animate);
      const now = performance.now();
      const elapsed = now - startTime;
      const tRaw = INTRO_DURATION > 0 ? Math.min(elapsed / INTRO_DURATION, 1) : 1;
      const e = easeOutCubic(tRaw);

      /* حركة الكاميرا الافتتاحية */
      if (tRaw < 1 && !userInteracted) {
        camera.position.z = CAM_Z_START + (CAM_Z_END - CAM_Z_START) * e;
        camera.position.y = CAM_Y_START + (CAM_Y_END - CAM_Y_START) * e;
        camera.lookAt(0, 0.2, 0);
      }

      /* إطلاق introDone عند اكتمال الحركة */
      if (tRaw >= 1 && !introDoneFired) {
        introDoneFired = true;
        onIntroDone?.();
      }

      /* تمريرة الضوء على المعدن */
      const shimT = elapsed * 0.001;
      shimmerLight.position.x = Math.sin(shimT * 0.7) * 2.5;
      shimmerLight.position.y = Math.cos(shimT * 0.5) * 1.5 + 1;
      shimmerLight.intensity  = 2.0 + Math.sin(shimT * 1.3) * 0.8;

      /* توهج الهالة الأرضية يتنفس */
      haloMat.opacity = 0.04 + Math.sin(shimT * 0.9) * 0.022;

      /* تحريك الغبار */
      if (!prefersReduced) {
        const pos = dust.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < DUST_COUNT; i++) {
          pos[i * 3]     += dustVelocities[i * 3];
          pos[i * 3 + 1] += dustVelocities[i * 3 + 1];
          if (Math.abs(pos[i * 3])     > 3.5) pos[i * 3]     *= -0.95;
          if (Math.abs(pos[i * 3 + 1]) > 2.5) pos[i * 3 + 1] *= -0.95;
        }
        dust.geometry.attributes.position.needsUpdate = true;
      }

      controls?.update();

      if (composer) {
        composer.render();
      } else {
        renderer.render(scene, camera);
      }
    }

    animate();

    /* إطلاق فوري إن كان reduced motion */
    if (prefersReduced && !introDoneFired) {
      introDoneFired = true;
      onIntroDone?.();
    }

    /* ─── تعديل الحجم عند تغيير النافذة ─── */
    const onResize = () => {
      if (!containerRef.current) return;
      const { w, h } = getSize();
      renderer.setSize(w, h);
      camera.aspect = w / Math.max(h, 1);
      camera.updateProjectionMatrix();
      composer?.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    /* ─── تنظيف عند إلغاء التثبيت ─── */
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      controls?.dispose();
      renderer.dispose();
      goldMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      haloGeo.dispose();
      haloMat.dispose();
      starsGeo.dispose();
      starsMat.dispose();
      envRT.dispose();
      if (el.contains(renderer.domElement)) {
        el.removeChild(renderer.domElement);
      }
    };
  }, [prefersReduced, fullscreen, onIntroDone]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      aria-hidden="true"
    />
  );
}
