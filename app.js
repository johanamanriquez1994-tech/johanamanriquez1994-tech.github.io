
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);


canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.zIndex = '-1'; 
canvas.style.backgroundColor = '#0b0c10'; 

let estrellas = [];

function ajustarPantalla() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', ajustarPantalla);
ajustarPantalla();


class Estrella {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.5 + 0.5; 
        this.velocidadParpadeo = Math.random() * 0.02 + 0.005; 
        this.angulo = Math.random() * Math.PI; 
    }

    dibujar() {
        
        let brillo = (Math.sin(this.angulo) + 1) / 2; 
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${brillo * 0.85})`; 
        ctx.fill();
    }

    actualizar() {
        this.angulo += this.velocidadParpadeo;
    }
}


function crearCieloEstrellado() {
    estrellas = [];
    const cantidadEstrellas = 60; 
    for (let i = 0; i < cantidadEstrellas; i++) {
        estrellas.push(new Estrella());
    }
}
crearCieloEstrellado();



class MariposaOrigami3D {
    constructor() {
        this.reiniciar();
    }

    reiniciar() {
        this.escala = Math.random() * 0.8 + 2.4; 
        this.x = -200; 
        this.y = Math.random() * (canvas.height * 0.5) + (canvas.height * 0.25); 
        this.velocidadX = Math.random() * 1.0 + 1.2; 
        this.anguloAleteo = 0;
        this.tiempoVuelo = Math.random() * 100;
    }

    actualizar() {
        this.x += this.velocidadX;
        this.tiempoVuelo += 0.03;
        this.y += Math.sin(this.tiempoVuelo) * 1.0; 
        this.anguloAleteo += 0.18; 
        
        if (this.x - 200 > canvas.width) {
            this.reiniciar();
        }
    }

    dibujar() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.escala, this.escala);
        ctx.rotate(Math.sin(this.tiempoVuelo) * 0.06); 

        
        let factorAleteo = Math.sin(this.anguloAleteo);
        let alaIzquierdaX = (factorAleteo * 24) + 4;
        let alaDerechaX = (factorAleteo * 20) + 6; 
        ctx.lineWidth = 1.2;

        
        ctx.fillStyle = "#e8eaf6"; 
        ctx.strokeStyle = "#9fa8da";
        ctx.beginPath();
        ctx.moveTo(0, -2);
        ctx.lineTo(-alaIzquierdaX * 1.3, -22);
        ctx.lineTo(-alaIzquierdaX * 0.6, -8);
        ctx.closePath();
        ctx.fill(); ctx.stroke();

        
        ctx.fillStyle = "#c5cae9"; 
        ctx.beginPath();
        ctx.moveTo(0, -2);
        ctx.lineTo(-alaIzquierdaX * 0.6, -8);
        ctx.lineTo(-alaIzquierdaX * 1.1, 4);
        ctx.closePath();
        ctx.fill(); ctx.stroke();

        
        ctx.fillStyle = "#9fa8da"; 
        ctx.beginPath();
        ctx.moveTo(0, 2);
        ctx.lineTo(-alaIzquierdaX * 1.1, 4);
        ctx.lineTo(-alaIzquierdaX * 0.5, 14);
        ctx.closePath();
        ctx.fill(); ctx.stroke();


        
        
        ctx.fillStyle = "#ffffff"; 
        ctx.strokeStyle = "#c5cae9";
        ctx.beginPath();
        ctx.moveTo(0, -2);
        ctx.lineTo(alaDerechaX * 1.3, -22);
        ctx.lineTo(alaDerechaX * 0.6, -8);
        ctx.closePath();
        ctx.fill(); ctx.stroke();

       
        ctx.fillStyle = "#e8eaf6";
        ctx.beginPath();
        ctx.moveTo(0, -2);
        ctx.lineTo(alaDerechaX * 0.6, -8);
        ctx.lineTo(alaDerechaX * 1.1, 4);
        ctx.closePath();
        ctx.fill(); ctx.stroke();

        
        ctx.fillStyle = "#c5cae9";
        ctx.beginPath();
        ctx.moveTo(0, 2);
        ctx.lineTo(alaDerechaX * 1.1, 4);
        ctx.lineTo(alaDerechaX * 0.5, 14);
        ctx.closePath();
        ctx.fill(); ctx.stroke();


        
        ctx.fillStyle = "#7986cb";
        ctx.strokeStyle = "#5c6bc0";
        ctx.beginPath();
        ctx.moveTo(0, -12);
        ctx.lineTo(2, 0);
        ctx.lineTo(0, 12);
        ctx.lineTo(-2, 0);
        ctx.closePath();
        ctx.fill(); ctx.stroke();

        
        ctx.strokeStyle = "#7986cb";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(-0.5, -12); ctx.lineTo(-4, -19);
        ctx.moveTo(0.5, -12); ctx.lineTo(4, -19);
        ctx.stroke();

        ctx.restore();
    }
}

const mariposaPapel = new MariposaOrigami3D();

function animar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    
    for (let i = 0; i < estrellas.length; i++) {
        estrellas[i].actualizar();
        estrellas[i].dibujar();
    }

    mariposaPapel.actualizar();
    mariposaPapel.dibujar();

    requestAnimationFrame(animar);
}
animar();