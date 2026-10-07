import * as THREE from 'three';

// 1. 장면(Scene) 및 안개 효과 설정
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050505, 0.02);

// 2. 카메라(Camera) 설정
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 30;

// 3. 렌더러(Renderer) 설정
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 4. 조명(Light) 설정
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // 기본 밝기
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x00ffcc, 2, 100); // 큐브를 비출 청록색 포인트 조명
pointLight.position.set(0, 0, 10);
scene.add(pointLight);

// 5. 3D 객체(Mesh) 생성 - 여러 개의 빛나는 큐브 배열
const cubes = [];
const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);

for (let i = 0; i < 100; i++) {
    // 빛을 반사하고 자체 발광(emissive)하는 재질 설정
    const material = new THREE.MeshStandardMaterial({
        color: 0x00ffcc,
        emissive: 0x003322,
        emissiveIntensity: Math.random() * 0.8 + 0.2,
        roughness: 0.2,
        metalness: 0.8
    });

    const cube = new THREE.Mesh(geometry, material);
    
    // 공간에 랜덤하게 큐브 배치
    cube.position.x = (Math.random() - 0.5) * 60;
    cube.position.y = (Math.random() - 0.5) * 60;
    cube.position.z = (Math.random() - 0.5) * 40 - 10;
    
    // 초기 회전값 랜덤 설정
    cube.rotation.x = Math.random() * Math.PI;
    cube.rotation.y = Math.random() * Math.PI;

    scene.add(cube);
    cubes.push(cube);
}

// 6. 마우스 이벤트 리스너 설정
let mouseX = 0;
let mouseY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    // 화면 중심을 0,0으로 맞춰 마우스 좌표 변환
    mouseX = (event.clientX - windowHalfX) * 0.05;
    mouseY = (event.clientY - windowHalfY) * 0.05;
});

// 7. 애니메이션 루프
function animate() {
    requestAnimationFrame(animate);

    // 마우스 움직임에 따라 카메라 시점이 부드럽게 따라가도록 설정
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position); // 카메라는 항상 화면 중심을 바라봄

    // 각 큐브들을 회전시킴
    cubes.forEach((cube, index) => {
        cube.rotation.x += 0.01 + (index * 0.0001);
        cube.rotation.y += 0.01 + (index * 0.0001);
    });

    renderer.render(scene, camera);
}

animate();

// 8. 브라우저 창 크기 조절 시 반응형 처리
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});