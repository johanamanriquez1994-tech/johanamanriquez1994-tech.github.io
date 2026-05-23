// === Creación del lienzo de dibujo (Canvas) ===
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

// Estilos para el fondo infinito negro (No tocar)
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.zIndex = '-1'; // Asegura que las burbujas y la mariposa estén detrás del texto
canvas.style.backgroundColor = '#000000';

let burbujas = [];

function ajustarPantalla() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', ajustarPantalla);
ajustarPantalla();

// === CLASE BURBUJA (No tocar) ===
class Burbuja {
    constructor(x, y, esInteractiva = false) {
        this.x = x;
        this.y = y;
        this.radioMaximo = Math.random() * 40 + 10; 
        this.radio = esInteractiva ? 2 : Math.random() * this.radioMaximo;
        this.velocidadX = Math.random() * 2 - 1;
        this.velocidadY = esInteractiva ? (Math.random() * -3 - 1) : (Math.random() * -1.5 - 0.5);
        this.opacidad = Math.random() * 0.5 + 0.2;
        this.explotando = false;
        this.radioExplosion = 0;
    }

    dibujar() {
        if (!this.explotando) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radio, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacidad})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(this.x - this.radio * 0.3, this.y - this.radio * 0.3, this.radio * 0.2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacidad * 0.5})`;
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radio + this.radioExplosion, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacidad * (1 - this.radioExplosion / 15)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }

    actualizar() {
        if (!this.explotando) {
            this.x += this.velocidadX;
            this.y += this.velocidadY;
            this.radio += 0.05;

            if (this.radio >= this.radioMaximo || this.y + this.radio < 0) {
                this.explotando = true;
            }
        } else {
            this.radioExplosion += 2;
        }
    }
}

function generarBurbujasDeFondo() {
    if (burbujas.length < 50) {
        burbujas.push(new Burbuja(Math.random() * canvas.width, canvas.height + 20));
    }
}

window.addEventListener('mousemove', (evento) => {
    if (Math.random() < 0.15) { 
        burbujas.push(new Burbuja(evento.clientX, evento.clientY, true));
    }
});


// === CLASE MARIPOSA (Ajustada para mayor tamaño y profundidad) ===
class Mariposa {
    constructor() {
        this.reiniciar();
    }

    reiniciar() {
        // --- 1. AJUSTE DE TAMAÑO ---
        // Aumentamos el rango de escala de [0.6 - 1.0] a [1.0 - 1.5] (Súper grande)
        this.escala = Math.random() * 0.5 + 1.0; 

        // Posición de inicio y velocidad (Sin cambios)
        this.x = -150; // Empezamos un poco más afuera por su nuevo tamaño
        this.y = Math.random() * (canvas.height * 0.6) + (canvas.height * 0.2);
        this.velocidadX = Math.random() * 1.5 + 1.5;
        this.anguloAleteo = 0;
        this.tiempoX = Math.random() * 100;
        
        // --- 2. EFECTO 3D (Simulación de profundidad) ---
        // La opacidad dependerá de la escala: más grande = más "cerca" = más opaca
        this.baseOpacidad = this.escala > 1.2 ? 0.9 : 0.6;
    }

    actualizar() {
        this.x += this.velocidadX;
        this.tiempoX += 0.05;
        this.y += Math.sin(this.tiempoX) * 1.2; // Vuelo ondulado real
        this.anguloAleteo += 0.25;

        // Reiniciar cuando cruza
        if (this.x - 100 > canvas.width) {
            this.reiniciar();
        }
    }

    dibujar() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.escala, this.escala);

        // Ancho de ala dinámico para aleteo
        let anchoAla = Math.abs(Math.sin(this.anguloAleteo)) * 25 + 5;

        // --- 3. ESTILOS DE CRISTAL (Ajustados con la opacidad de profundidad) ---
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.baseOpacidad})`; // Bordes más nítidos
        ctx.fillStyle = `rgba(255, 255, 255, ${this.baseOpacidad * 0.1})`; // Relleno de cristal
        ctx.lineWidth = 2;

        // Ala Izquierda
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-anchoAla, -30, -anchoAla * 1.5, -10, 0, 5);
        ctx.bezierCurveTo(-anchoAla * 1.2, 15, -anchoAla, 25, 0, 10);
        ctx.fill();
        ctx.stroke();

        // Ala Derecha
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(anchoAla, -30, anchoAla * 1.5, -10, 0, 5);
        ctx.bezierCurveTo(anchoAla * 1.2, 15, anchoAla, 25, 0, 10);
        ctx.fill();
        ctx.stroke();

        // Cuerpo (Más nítido)
        ctx.beginPath();
        ctx.moveTo(0, -15);
        ctx.lineTo(0, 15);
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.baseOpacidad * 1.1})`; // Un toque más brillante
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.restore();
    }
}

const mariposa = new Mariposa();


// === BUCLE DE ANIMACIÓN (No tocar) ===
function animar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    generarBurbujasDeFondo();
    for (let i = burbujas.length - 1; i >= 0; i--) {
        burbujas[i].actualizar();
        burbujas[i].dibujar();

        if (burbujas[i].explotando && burbujas[i].radioExplosion > 15) {
            burbujas.splice(i, 1);
        }
    }

    mariposa.actualizar();
    mariposa.dibujar();

    requestAnimationFrame(animar);
}
animar();