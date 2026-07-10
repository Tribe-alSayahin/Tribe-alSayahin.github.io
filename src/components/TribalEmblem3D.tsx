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
const BAR_W = 2.46; // يمتد من الحافة الخارجية اليسرى إلى الحافة الخارجية اليمنى
const BAR_H = 0.22;
const BAR_D = 0.22;
const PILLAR_X = 1.12; // المسافة من المحور إلى مركز كل ركيزة
const BAR_Y = PILLAR_H / 2 + BAR_H / 2; // أعلى الركائز

export default function TribalEmblem3D() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    /* ─── الحجم الأولي ─── */
    const getSize = () => ({
      w: el.clientWidth || 380,
      h: el.clientHeight || 380,
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
    scene.fog = new THREE.FogExp2(BG_COLOR, 0.06);

    const camera = new THREE.PerspectiveCamera(45, initW / Math.max(initH, 1), 0.1, 100);
    /* نقطة البداية للحركة الافتتاحية */
    camera.position.set(0, 1.8, 8.5);
    camera.lookAt(0, 0.4, 0);

    /* ─── الإضاءة ─── */
    // إضاءة محيطية دافئة خفيفة
    const ambient = new THREE.AmbientLight(AMBIENT_COLOR, 0.55);
    scene.add(ambient);

    // إضاءة رئيسية ذهبية من الأعلى والأمام
    const mainLight = new THREE.DirectionalLight(GOLD_LIGHT, 3.2);
    mainLight.position.set(2.5, 4, 3.5);
    scene.add(mainLight);

    // إضاءة rim باردة من الخلف (تُبرز الحواف)
    const rimLight = new THREE.DirectionalLight(RIM_COLOR, 1.8);
    rimLight.position.set(-3, 2, -4);
    scene.add(rimLight);

    // نقطة ضوء متحركة (تمريرة الضوء على المعدن)
    const shimmerLight = new THREE.PointLight(GOLD_LIGHT, 2.5, 6);
    shimmerLight.position.set(0, 1.5, 2);
    scene.add(shimmerLight);

    // نقطة ضوء سفلية للتوهج الأرضي
    const groundGlow = new THREE.PointLight(0xc9903a, 1.2, 4);
    groundGlow.position.set(0, -1.2, 1.5);
    scene.add(groundGlow);

    /* ─── مادة الذهب ─── */
    const goldMat = new THREE.MeshStandardMaterial({
      color: GOLD_COLOR,
      metalness: 0.92,
      roughness: 0.12,
      envMapIntensity: 1.4,
    });

    /* ─── نموذج بيئة RoomEnvironment للانعكاسات ─── */
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    // بيئة إجرائية مصنوعة من CubeRenderTarget صغير
    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0x1a1008);
    const envLight1 = new THREE.PointLight(GOLD_LIGHT, 8, 10);
    envLight1.position.set(2, 3, 2);
    envScene.add(envLight1);
    const envLight2 = new THREE.PointLight(0x2244aa, 4, 10);
    envLight2.position.set(-3, 1, -3);
    envScene.add(envLight2);
    envScene.add(new THREE.AmbientLight(0x201208, 3));
    const envRT = pmremGenerator.fromScene(envScene as unknown as Parameters<typeof pmremGenerator.fromScene>[0]);
    scene.environment = envRT.texture;
    pmremGenerator.dispose();

    /* ─── هندسة الشعار: ثلاث قطع ─── */
    const emblemGroup = new THREE.Group();

    // الركيزة اليسرى
    const leftPillar = new THREE.Mesh(
      new THREE.BoxGeometry(PILLAR_W, PILLAR_H, PILLAR_D),
      goldMat,
    );
    leftPillar.position.set(-PILLAR_X, 0, 0);
    emblemGroup.add(leftPillar);

    // الركيزة اليمنى
    const rightPillar = new THREE.Mesh(
      new THREE.BoxGeometry(PILLAR_W, PILLAR_H, PILLAR_D),
      goldMat,
    );
    rightPillar.position.set(PILLAR_X, 0, 0);
    emblemGroup.add(rightPillar);

    // الشريط العلوي
    const topBar = new THREE.Mesh(
      new THREE.BoxGeometry(BAR_W, BAR_H, BAR_D),
      goldMat,
    );
    topBar.position.set(0, BAR_Y, 0);
    emblemGroup.add(topBar);

    // توسيط المجموعة عمودياً: نحرك لأسفل قليلاً ليبدو الشعار مرسخاً
    emblemGroup.position.y = -BAR_Y / 2;
    scene.add(emblemGroup);

    /* ─── ظل أرضي (مستوى شبه شفاف) ─── */
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 8),
      new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0,
      }),
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -PILLAR_H / 2 - BAR_Y / 2 - 0.1;
    scene.add(shadowPlane);

    /* هالة ضوئية (دائرة توهج تحت الشعار) */
    const haloGeo = new THREE.CircleGeometry(1.4, 48);
    const haloMat = new THREE.MeshBasicMaterial({
      color: GOLD_COLOR,
      transparent: true,
      opacity: 0.06,
      side: THREE.DoubleSide,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.rotation.x = -Math.PI / 2;
    halo.position.y = shadowPlane.position.y + 0.01;
    scene.add(halo);

    /* ─── جسيمات الغبار الذهبي ─── */
    const DUST_COUNT = 120;
    const dustPositions = new Float32Array(DUST_COUNT * 3);
    const dustVelocities: number[] = [];
    for (let i = 0; i < DUST_COUNT; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 6;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 3 - 0.5;
      dustVelocities.push((Math.random() - 0.5) * 0.004, (Math.random() - 0.5) * 0.003, 0);
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: GOLD_LIGHT,
      size: 0.018,
      transparent: true,
      opacity: 0.55,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    /* ─── بريق خلفي (نقاط مضيئة) ─── */
    const STAR_COUNT = 60;
    const starPos = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 20;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      starPos[i * 3 + 2] = -8 - Math.random() * 8;
    }
    const starsGeo = new THREE.BufferGeometry();
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starsMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.06,
      transparent: true,
      opacity: 0.5,
    });
    scene.add(new THREE.Points(starsGeo, starsMat));

    /* ─── OrbitControls ─── */
    let controls: OrbitControlsType | null = null;
    let userInteracted = false;

    /* تحميل غير متزامن لـ OrbitControls */
    import('three/examples/jsm/controls/OrbitControls.js').then(({ OrbitControls }) => {
      controls = new OrbitControls(camera, renderer.domElement) as OrbitControlsType;
      controls.enableDamping = true;
      controls.dampingFactor = 0.06;
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.minPolarAngle = Math.PI / 4;
      controls.maxPolarAngle = (Math.PI * 3) / 4;
      controls.autoRotate = !prefersReduced;
      controls.autoRotateSpeed = 0.6;

      /* إيقاف الدوران عند تفاعل المستخدم */
      controls.addEventListener('start', () => {
        userInteracted = true;
        controls!.autoRotate = false;
      });
    });

    /* ─── EffectComposer + UnrealBloomPass ─── */
    let composer: { render: () => void; setSize: (w: number, h: number) => void } | null = null;

    Promise.all([
      import('three/examples/jsm/postprocessing/EffectComposer.js'),
      import('three/examples/jsm/postprocessing/RenderPass.js'),
      import('three/examples/jsm/postprocessing/UnrealBloomPass.js'),
      import('three/examples/jsm/postprocessing/OutputPass.js'),
    ]).then(([{ EffectComposer }, { RenderPass }, { UnrealBloomPass }, { OutputPass }]) => {
      const comp = new EffectComposer(renderer);
      comp.addPass(new RenderPass(scene, camera));
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(initW, initH),
        0.45,  // strength
        0.5,   // radius
        0.72,  // threshold (يبدأ عند الأجزاء الأكثر إضاءة)
      );
      comp.addPass(bloomPass);
      comp.addPass(new OutputPass());
      composer = comp;
    });

    /* ─── حلقة الرسم ─── */
    let raf = 0;
    let startTime = performance.now();
    /* حركة الكاميرا الافتتاحية: من z=8.5 إلى z=5 في ~2.5 ثانية */
    const INTRO_DURATION = prefersReduced ? 0 : 2500; // ms
    const CAM_Z_START = 8.5;
    const CAM_Z_END = 5.0;
    const CAM_Y_START = 1.8;
    const CAM_Y_END = 0.5;

    function easeOutCubic(t: number) {
      return 1 - Math.pow(1 - t, 3);
    }

    function animate() {
      raf = requestAnimationFrame(animate);
      const now = performance.now();
      const elapsed = now - startTime;
      const t = INTRO_DURATION > 0 ? Math.min(elapsed / INTRO_DURATION, 1) : 1;
      const e = easeOutCubic(t);

      /* حركة الكاميرا الافتتاحية */
      if (t < 1 && !userInteracted) {
        camera.position.z = CAM_Z_START + (CAM_Z_END - CAM_Z_START) * e;
        camera.position.y = CAM_Y_START + (CAM_Y_END - CAM_Y_START) * e;
        camera.lookAt(0, 0.2, 0);
      }

      /* تمريرة الضوء على المعدن */
      const shimT = elapsed * 0.001;
      shimmerLight.position.x = Math.sin(shimT * 0.7) * 2.5;
      shimmerLight.position.y = Math.cos(shimT * 0.5) * 1.5 + 1;
      shimmerLight.intensity = 2.0 + Math.sin(shimT * 1.3) * 0.8;

      /* توهج الهالة الأرضية يتنفس */
      haloMat.opacity = 0.04 + Math.sin(shimT * 0.9) * 0.025;

      /* تحريك الغبار */
      if (!prefersReduced) {
        const pos = dust.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < DUST_COUNT; i++) {
          pos[i * 3] += dustVelocities[i * 3];
          pos[i * 3 + 1] += dustVelocities[i * 3 + 1];
          pos[i * 3 + 2] += dustVelocities[i * 3 + 2];
          // إعادة ضبط الجسيمات الخارجة عن الحدود
          if (Math.abs(pos[i * 3]) > 3) pos[i * 3] *= -0.95;
          if (Math.abs(pos[i * 3 + 1]) > 2) pos[i * 3 + 1] *= -0.95;
        }
        dust.geometry.attributes.position.needsUpdate = true;
      }

      controls?.update();

      /* رسم المشهد */
      if (composer) {
        composer.render();
      } else {
        renderer.render(scene, camera);
      }
    }

    animate();

    /* ─── تعديل الحجم عند تغيير نافذة المتصفح ─── */
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
      envRT.dispose();
      if (el.contains(renderer.domElement)) {
        el.removeChild(renderer.domElement);
      }
    };
  }, [prefersReduced]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 rounded-[2rem] overflow-hidden"
      aria-hidden="true"
    />
  );
}
