let scene, camera, renderer, corridor;
const colors = [0xff00ff, 0x00ffff, 0xffff00, 0xff0066];

function init() {
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.02);
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance",
    precision: "highp"
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  corridor = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const geometry = new THREE.BoxGeometry(10, 10, 1);
    const solidMaterial = new THREE.MeshPhongMaterial({
      color: colors[i % colors.length],
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
      emissive: colors[i % colors.length],
      emissiveIntensity: 0.3,
      shininess: 100
    });
    const solidFrame = new THREE.Mesh(geometry, solidMaterial);
    const edges = new THREE.EdgesGeometry(geometry);
    const wireMaterial = new THREE.LineBasicMaterial({
      color: colors[i % colors.length],
      linewidth: 2
    });
    const wireFrame = new THREE.LineSegments(edges, wireMaterial);
    const frameGroup = new THREE.Group();
    frameGroup.add(solidFrame);
    frameGroup.add(wireFrame);
    const angle = (i / 30) * Math.PI * 2;
    frameGroup.position.z = -i * 2;
    frameGroup.rotation.z = angle;
    frameGroup.position.x = Math.sin(angle) * 3;
    frameGroup.position.y = Math.cos(angle) * 3;
    corridor.add(frameGroup);
  }
  scene.add(corridor);
  const light1 = new THREE.PointLight(0xff00ff, 3, 100);
  light1.position.set(10, 10, 10);
  scene.add(light1);
  const light2 = new THREE.PointLight(0x00ffff, 3, 100);
  light2.position.set(-10, -10, 10);
  scene.add(light2);
  const light3 = new THREE.SpotLight(0xffff00, 1.5);
  light3.position.set(0, 0, 15);
  light3.angle = Math.PI / 3;
  scene.add(light3);
  const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
  scene.add(ambientLight);
  camera.position.z = 15;
  animate();
}

function animate() {
  requestAnimationFrame(animate);
  const time = Date.now() * 0.001;
  corridor.rotation.z += 0.005 * Math.sin(time * 0.5);
  corridor.rotation.x += 0.002 * Math.cos(time * 0.3);
  corridor.rotation.y = Math.sin(time * 0.2) * 0.1;
  corridor.children.forEach((frameGroup, i) => {
    const twistAngle = (i / corridor.children.length) * Math.PI * 2;
    const dynamicTwist = twistAngle + time * 0.5;
    frameGroup.rotation.z = dynamicTwist + Math.sin(time + i * 0.1) * 0.3;
    frameGroup.rotation.x = Math.sin(time * 0.3 + i * 0.05) * 0.2;
    frameGroup.rotation.y = Math.cos(time * 0.4 + i * 0.07) * 0.2;
    const radius = 3 + Math.sin(time * 0.5 + i * 0.1) * 1;
    frameGroup.position.x = Math.sin(dynamicTwist) * radius;
    frameGroup.position.y = Math.cos(dynamicTwist) * radius;
    const pulseScale = 1 + Math.sin(time * 2 + i * 0.1) * 0.2;
    frameGroup.scale.x = pulseScale;
    frameGroup.scale.y = pulseScale;
    const hueShift = (time * 0.5 + i * 0.1) % 1;
    const currentColor = new THREE.Color().setHSL(hueShift, 1, 0.5);
    frameGroup.children[0].material.color.copy(currentColor);
    frameGroup.children[0].material.emissive.copy(currentColor);
    frameGroup.children[1].material.color.copy(currentColor);
    frameGroup.children[0].material.opacity = 0.3 + Math.sin(time * 3 + i * 0.2) * 0.15;
  });
  camera.position.x = Math.sin(time * 0.5) * 7;
  camera.position.y = Math.cos(time * 0.3) * 7;
  camera.position.z = 15 + Math.sin(time * 0.2) * 3;
  camera.lookAt(0, 0, -10);
  scene.children.forEach(child => {
    if (child instanceof THREE.PointLight || child instanceof THREE.SpotLight) {
      child.position.x = Math.sin(time * 1.5 + child.position.z) * 12;
      child.position.y = Math.cos(time * 1.5 + child.position.x) * 12;
      child.intensity = 2 + Math.sin(time * 2) * 1;
    }
  });
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize, false);
window.addEventListener('orientationchange', onWindowResize, false);
init();
