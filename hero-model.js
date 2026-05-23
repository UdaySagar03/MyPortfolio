import * as THREE from "https://esm.sh/three@0.164.1";
import { GLTFLoader } from "https://esm.sh/three@0.164.1/examples/jsm/loaders/GLTFLoader.js";

const container = document.getElementById("hero-model-canvas");
const status = document.getElementById("hero-model-status");

if (container) {
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x050103, 8, 22);

    const camera = new THREE.PerspectiveCamera(24, 1, 0.1, 100);
    camera.position.set(0, 2.1, 12.6);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    const hemisphere = new THREE.HemisphereLight(0xfff0f2, 0x14050a, 2.4);
    scene.add(hemisphere);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(3.2, 5.5, 5.5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xff4d6d, 2.2);
    rimLight.position.set(-4.5, 4.2, -2.5);
    scene.add(rimLight);

    const floorGlow = new THREE.Mesh(
        new THREE.CircleGeometry(2.6, 64),
        new THREE.MeshBasicMaterial({
            color: 0xff2852,
            transparent: true,
            opacity: 0.18
        })
    );
    floorGlow.rotation.x = -Math.PI / 2;
    floorGlow.position.y = -3.15;
    scene.add(floorGlow);

    let modelRoot = null;

    const resizeRenderer = () => {
        const { clientWidth, clientHeight } = container;
        if (!clientWidth || !clientHeight) {
            return;
        }

        renderer.setSize(clientWidth, clientHeight, false);
        camera.aspect = clientWidth / clientHeight;
        camera.updateProjectionMatrix();
    };

    resizeRenderer();

    const loader = new GLTFLoader();
    loader.load(
        "models/hero-gnome-welcome.glb",
        (gltf) => {
            const model = gltf.scene;
            modelRoot = model;

            const initialBox = new THREE.Box3().setFromObject(model);
            const initialSize = initialBox.getSize(new THREE.Vector3());
            const modelHeight = initialSize.y || 1;
            const modelWidth = initialSize.x || 1;
            const targetHeight = 5.45;
            const targetWidth = 4.1;
            const scale = Math.min(targetHeight / modelHeight, targetWidth / modelWidth);

            model.scale.setScalar(scale);

            const fittedBox = new THREE.Box3().setFromObject(model);
            const fittedCenter = fittedBox.getCenter(new THREE.Vector3());

            model.position.x = -fittedCenter.x;
            model.position.y = -fittedBox.min.y - 3.05;
            model.position.z = -fittedCenter.z;
            model.position.x += 0.04;
            model.rotation.y = 0;

            model.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = false;
                    child.receiveShadow = false;
                }
            });

            scene.add(model);

            if (status) {
                status.textContent = "";
                status.hidden = true;
            }
        },
        (event) => {
            if (!status || !event.total) {
                return;
            }

            const progress = Math.min(99, Math.round((event.loaded / event.total) * 100));
            status.textContent = `Loading 3D character... ${progress}%`;
        },
        (error) => {
            console.error("Failed to load hero GLB model", error);
            if (status) {
                status.textContent = "3D character could not load";
                status.hidden = false;
            }
        }
    );

    const animate = () => {
        requestAnimationFrame(animate);

        camera.lookAt(0, 0.55, 0);
        renderer.render(scene, camera);
    };

    animate();

    window.addEventListener("resize", resizeRenderer);
}
