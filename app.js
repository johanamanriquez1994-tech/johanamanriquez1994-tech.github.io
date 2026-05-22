
particlesJS("particles-js", {
  "particles": {
    "number": {
      "value": 40,
      "density": { "enable": true, "value_area": 800 }
    },
    "color": {
      "value": ["#78ffd6", "#a8ff78", "#ff758c", "#ffffff"]
    },
    "shape": { "type": "circle" },
    "opacity": {
      "value": 0.3,
      "random": true,
      "anim": { "enable": true, "speed": 0.5, "opacity_min": 0.1, "sync": false }
    },
    "size": {
      "value": 12,
      "random": true,
      "anim": { "enable": true, "speed": 1, "size_min": 4, "sync": false }
    },
    "line_linked": { "enable": false },
    "move": {
      "enable": true,
      "speed": 1,
      "direction": "top", /* Suben como burbujas */
      "random": true,
      "straight": false,
      "out_mode": "out",
      "bounce": false
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": { "enable": true, "mode": "repulse" },
      "onclick": { "enable": false },
      "resize": true
    },
    "modes": {
      "repulse": { "distance": 100, "duration": 0.4 }
    }
  },
  "retina_detect": true
});


let scene, camera, renderer;
let alaIzquierda, alaDerecha, cuerpoMariposa;
const container3D = document.getElementById('mariposa-3d-container');

function init3D() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, container3D.clientWidth / container3D.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container3D.clientWidth, container3D.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container3D.appendChild(renderer.domElement);

    const light = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(light);
    const pointLight = new THREE.PointLight(0xff758c, 1.5);
    pointLight.position.set(2, 2, 2);
    scene.add(pointLight);

    cuerpoMariposa = new THREE.Group();

    const cuerpoGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.6, 8);
    const cuerpoMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const cuerpoMesh = new THREE.Mesh(cuerpoGeo, cuerpoMat);
    cuerpoMariposa.add(cuerpoMesh);

   
    const alaIzquierdaGeo = new THREE.ConeGeometry(0.3, 0.6, 4);
    alaIzquierdaGeo.rotateZ(Math.PI / 2);
    const alaMatIzquierda = new THREE.MeshStandardMaterial({ color: 0x78ffd6, side: THREE.DoubleSide, roughness: 0.2 });
    alaIzquierda = new THREE.Mesh(alaIzquierdaGeo, alaMatIzquierda);
    alaIzquierda.position.x = -0.2;
    cuerpoMariposa.add(alaIzquierda);

  
    const alaDerechaGeo = new THREE.ConeGeometry(0.3, 0.6, 4);
    alaDerechaGeo.rotateZ(-Math.PI / 2);
    const alaMatDerecha = new THREE.MeshStandardMaterial({ color: 0xff758c, side: THREE.DoubleSide, roughness: 0.2 });
    alaDerecha = new THREE.Mesh(alaDerechaGeo, alaMatDerecha);
    alaDerecha.position.x = 0.2;
    cuerpoMariposa.add(alaDerecha);

  
    cuerpoMariposa.position.set(1.5, 0, 0);
    cuerpoMariposa.rotation.x = 0.3;
    
    scene.add(cuerpoMariposa);
}

function animate3D() {
    requestAnimationFrame(animate3D);
    const tiempo = Date.now() * 0.005;

    if (alaIzquierda && alaDerecha) {
        alaIzquierda.rotation.y = Math.sin(tiempo * 4) * 0.6;
        alaDerecha.rotation.y = -Math.sin(tiempo * 4) * 0.6;
    }

    if (cuerpoMariposa) {
        cuerpoMariposa.position.y = Math.sin(tiempo * 0.2) * 0.2;
        cuerpoMariposa.rotation.y = tiempo * 0.1;
    }

    renderer.render(scene, camera);
}

init3D();
animate3D();

window.addEventListener('resize', () => {
    if(container3D && camera && renderer) {
        camera.aspect = container3D.clientWidth / container3D.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container3D.clientWidth, container3D.clientHeight);
    }
});



const canvasCursor = document.createElement('canvas');
const ctx = canvasCursor.getContext('2d');
document.body.appendChild(canvasCursor);

canvasCursor.style.position = 'fixed';
canvasCursor.style.top = '0';
canvasCursor.style.left = '0';
canvasCursor.style.width = '100vw';
canvasCursor.style.height = '100vh';
canvasCursor.style.pointerEvents = 'none';
canvasCursor.style.zIndex = '4';

let listaBurbujas = [];
const coloresBurbujas = ["#78ffd6", "#a8ff78", "#ff758c", "#00ffff", "#ff00ff"];

function redimensionarCanvas() {
    canvasCursor.width = window.innerWidth;
    canvasCursor.height = window.innerHeight;
}
window.addEventListener('resize', redimensionarCanvas);
redimensionarCanvas();

class BurbujaMouse {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 6 + 4;
        this.speedX = Math.random() * 1.5 - 0.75;
        this.speedY = Math.random() * -1.5 - 0.5;
        this.color = coloresBurbujas[Math.floor(Math.random() * coloresBurbujas.length)];
        this.alpha = 1;
    }
    actualizar() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.2) this.size -= 0.08;
        this.alpha -= 0.012;
    }
    dibujar() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.restore();
    }
}

window.addEventListener('mousemove', function(evento) {
    listaBurbujas.push(new BurbujaMouse(evento.clientX, evento.clientY));
});

function animarRastro() {
    ctx.clearRect(0, 0, canvasCursor.width, canvasCursor.height);
    for (let i = 0; i < listaBurbujas.length; i++) {
        listaBurbujas[i].actualizar();
        listaBurbujas[i].dibujar();
        if (listaBurbujas[i].alpha <= 0 || listaBurbujas[i].size <= 0.2) {
            listaBurbujas.splice(i, 1); 
            i--;
        }
    }
    requestAnimationFrame(animarRastro);
}
animarRastro();