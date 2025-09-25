import {
  forwardRef,
  useEffect,
  useRef,
  useImperativeHandle,
} from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { ThreeMFLoader } from "three/examples/jsm/loaders/3MFLoader.js";

type Props = {
  url: string;
  fileType: "STL" | "OBJ" | "3MF" | "STEP";
  height?: number; // px
};

export type ModelViewerHandle = {
  getScreenshot: () => string | null;
};

const ModelViewer = forwardRef<ModelViewerHandle, Props>(
  ({ url, fileType, height = 420 }, ref) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

    useImperativeHandle(ref, () => ({
      getScreenshot: () => {
        if (!rendererRef.current) return null;
        return rendererRef.current.domElement.toDataURL("image/png");
      },
    }));

    useEffect(() => {
      if (!mountRef.current) return;
      const container = mountRef.current;

      // --- Scene setup ---
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xffffff);
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / height,
        0.1,
        1000
      );
      camera.position.set(2, 2, 2);
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(container.clientWidth, height);
      rendererRef.current = renderer;
      container.appendChild(renderer.domElement);

      const controls = new OrbitControls(camera, renderer.domElement);

      // --- Lighting ---
      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(5, 10, 7.5);
      scene.add(light);
      scene.add(new THREE.AmbientLight(0xffffff, 0.6));

      // --- Grid helper ---
      const grid = new THREE.GridHelper(10, 10);
      scene.add(grid);

      let object: THREE.Object3D | null = null;

      function centerAndFit(obj: THREE.Object3D) {
        const box = new THREE.Box3().setFromObject(obj);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        obj.position.sub(center);

        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs((maxDim / 2) / Math.tan(fov / 2));
        cameraZ *= 1.7;
        camera.position.set(0, 0, cameraZ);
        controls.update();
      }

      const onLoad = (obj: THREE.Object3D) => {
        object = obj;
        obj.traverse((child) => {
          if ((child as any).isMesh) {
            const mesh = child as THREE.Mesh;
            if (!Array.isArray(mesh.material)) {
              mesh.material = new THREE.MeshStandardMaterial({
                metalness: 0,
                roughness: 1,
                color: 0xdddddd,
              });
            }
            mesh.castShadow = true;
            mesh.receiveShadow = true;
          }
        });
        scene.add(obj);
        centerAndFit(obj);
      };

      if (fileType === "STL") {
        new STLLoader().load(url, (geo) => {
          const mesh = new THREE.Mesh(
            geo,
            new THREE.MeshStandardMaterial({ color: 0xdddddd })
          );
          onLoad(mesh);
        });
      } else if (fileType === "OBJ") {
        new OBJLoader().load(url, (obj) => onLoad(obj));
      } else if (fileType === "3MF") {
        new ThreeMFLoader().load(url, (obj) => onLoad(obj));
      }

      // --- Resize handling ---
      const onResize = () => {
        if (!container) return;
        camera.aspect = container.clientWidth / height;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, height);
      };
      const obs = new ResizeObserver(onResize);
      obs.observe(container);

      // --- Animation loop ---
      let frameId: number;
      const animate = () => {
        renderer.render(scene, camera);
        frameId = requestAnimationFrame(animate);
      };
      animate();

      return () => {
        obs.disconnect();
        cancelAnimationFrame(frameId);
        if (object) scene.remove(object);
        renderer.dispose();
        container.removeChild(renderer.domElement);
      };
    }, [url, fileType, height]);

    if (fileType === "STEP") {
      return (
        <div className="text-sm">
          STEP preview not supported yet.{" "}
          <a
            className="text-blue-600 underline"
            href={url}
            target="_blank"
            rel="noreferrer"
          >
            Download file
          </a>
        </div>
      );
    }

    return <div ref={mountRef} style={{ width: "100%", height }} />;
  }
);

export default ModelViewer;
