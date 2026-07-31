(function() {
  const container = document.querySelector('.wave-container');
  const canvas = document.getElementById('waveCanvas');
  
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Wave parameters
  const waveSize = 300;
  const pointSpacing = 5;
  const pointCount = Math.floor(waveSize / pointSpacing);
  const totalPoints = pointCount * pointCount;

  // Create points geometry
  const pointsGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(totalPoints * 3);
  const colors = new Float32Array(totalPoints * 3);

  // Fill positions and colors
  let index = 0;
  for (let i = 0; i < pointCount; i++) {
    for (let j = 0; j < pointCount; j++) {
      const x = (i - pointCount / 2) * pointSpacing;
      const z = (j - pointCount / 2) * pointSpacing;
      
      positions[index * 3] = x;
      positions[index * 3 + 1] = 0;
      positions[index * 3 + 2] = z;
      
      // Color gradient
      const distance = Math.sqrt(x*x + z*z) / (waveSize/2);
      const intensity = 1 - Math.min(distance, 1) * 0.8;
      
      colors[index * 3] = intensity * 0.8;
      colors[index * 3 + 1] = intensity * 0.9;
      colors[index * 3 + 2] = intensity;
      
      index++;
    }
  }

  pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pointsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Points material
  const pointsMaterial = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    alphaTest: 0.1,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending
  });

  const wavePoints = new THREE.Points(pointsGeometry, pointsMaterial);
  scene.add(wavePoints);

  // Create lines
  const linesGeometry = new THREE.BufferGeometry();
  const lineIndices = [];
  
  for (let i = 0; i < pointCount - 1; i++) {
    for (let j = 0; j < pointCount - 1; j++) {
      const currentIndex = i * pointCount + j;
      
      if (j < pointCount - 1) {
        lineIndices.push(currentIndex, currentIndex + 1);
      }
      if (i < pointCount - 1) {
        lineIndices.push(currentIndex, currentIndex + pointCount);
      }
    }
  }
  
  linesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  linesGeometry.setIndex(lineIndices);
  
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x888888,
    transparent: true,
    opacity: 0.6
  });
  
  const linesMesh = new THREE.LineSegments(linesGeometry, lineMaterial);
  scene.add(linesMesh);

  // Camera
  camera.position.set(0, 10, 33);
  camera.lookAt(0, 0, 0);

  // Animation
  const clock = new THREE.Clock();
  
  function animate() {
    requestAnimationFrame(animate);
    
    const time = clock.getElapsedTime();
    const positions = pointsGeometry.attributes.position.array;
    
    for (let i = 0; i < pointCount; i++) {
      for (let j = 0; j < pointCount; j++) {
        const index = (i * pointCount + j) * 3;
        const x = positions[index];
        const z = positions[index + 2];
        
        const wave1 = Math.sin((x * 0.1) + time) * 2;
        const wave2 = Math.cos((z * 0.1) + time * 0.8) * 2;
        const wave3 = Math.sin((x * 0.05 + z * 0.05) + time * 1.2) * 1.5;
        
        positions[index + 1] = wave1 + wave2 + wave3;
      }
    }
    
    pointsGeometry.attributes.position.needsUpdate = true;
    linesGeometry.attributes.position.needsUpdate = true;
    
    renderer.render(scene, camera);
  }

  // Scroll animation dentro del container
  window.addEventListener('scroll', () => {
    const rect = container.getBoundingClientRect();
    const containerTop = rect.top;
    const containerHeight = rect.height;
    const viewportHeight = window.innerHeight;
    
    // Calcular progreso cuando el container está visible
    if (containerTop < viewportHeight && containerTop + containerHeight > 0) {
      const visibleProgress = Math.max(0, Math.min(1, (viewportHeight - containerTop) / (viewportHeight + containerHeight)));
      
      camera.position.y = 15 - (10 * visibleProgress);
    }
  });

  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  animate();
})();