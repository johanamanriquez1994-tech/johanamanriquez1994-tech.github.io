
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);


canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.zIndex = '-1';
canvas.style.backgroundColor = '#000000'; 

let burbujas = [];

function ajustarPantalla() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', ajustarPantalla);
ajustarPantalla();


class Burbuja {
    constructor(x, y, esInteractiva = false) {
        this.x = x;
        this.y = y;
        this.radioMaximo = Math.random() * 35 + 10; 
        this.radio = esInteractiva ? 2 : Math.random() * this.radioMaximo;
        this.velocidadX = Math.random() * 2 - 1;
        this.velocidadY = esInteractiva ? (Math.random() * -3 - 1) : (Math.random() * -1.2 - 0.4);
        this.opacidad = Math.random() * 0.4 + 0.15;
        this.explotando = false;
        this.radioExplosion = 0;
    }

    dibujar() {
        if (!this.explotando) {
           
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radio, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacidad})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();

            
            ctx.beginPath();
            ctx.arc(this.x - this.radio * 0.3, this.y - this.radio * 0.3, this.radio * 0.2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacidad * 0.4})`;
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
            this.radio += 0.04;

            
            if (this.radio >= this.radioMaximo || this.y + this.radio < 0) {
                this.explotando = true;
            }
        } else {
            this.radioExplosion += 2;
        }
    }
}


function generarBurbujasDeFondo() {
    if (burbujas.length < 40) {
        burbujas.push(new Burbuja(Math.random() * canvas.width, canvas.height + 20));
    }
}


window.addEventListener('mousemove', (evento) => {
    if (Math.random() < 0.12) { 
        burbujas.push(new Burbuja(evento.clientX, evento.clientY, true));
    }
});


class Mariposa {
    constructor() {
        this.reiniciar();
    }

    reiniciar() {
       
        this.escala = Math.random() * 1.0 + 3.0; 
        this.x = -250; 
       
        this.y = Math.random() * (canvas.height * 0.5) + (canvas.height * 0.2);
        this.velocidadX = Math.random() * 1.2 + 1.4;
        this.anguloAleteo = 0;
        this.tiempoX = Math.random() * 100;
        
        
        this.gradient = ctx.createLinearGradient(-30, -30, 30, 30);
        this.gradient.addColorStop(0, "#ff00e6"); 
        this.gradient.addColorStop(0.33, "#78ffd6"); 
        this.gradient.addColorStop(0.66, "#a8ff78"); 
        this.gradient.addColorStop(1, "#f25b30"); 

        this.opacidad = this.escala > 3.2 ? 0.85 : 0.65; 
    }

    actualizar() {
        this.x += this.velocidadX;
        this.tiempoX += 0.04;
        this.y += Math.sin(this.tiempoX) * 1.5; 
        this.anguloAleteo += 0.22; 

        
        if (this.x - 250 > canvas.width) {
            this.reiniciar();
        }
    }

    dibujar() {
        ctx.save();
        
        ctx.translate(this.x, this.y);
        ctx.scale(this.escala, this.escala);
        
        
        ctx.rotate(Math.sin(this.tiempoX) * 0.08);

       
        let aleteoEfecto = Math.sin(this.anguloAleteo);
        let anchoAlaIzquierda = (aleteoEfecto * 22) + 6;
        let anchoAlaDerecha = (aleteoEfecto * 18) + 8; 
        
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacidad})`;
        ctx.fillStyle = this.gradient; 
        ctx.lineWidth = 1.5;
        
        
        ctx.shadowColor = "rgba(255, 255, 255, 0.4)";
        ctx.shadowBlur = 10;

       
        ctx.beginPath();
        ctx.moveTo(0, -2);
        ctx.bezierCurveTo(-anchoAlaIzquierda, -25, -anchoAlaIzquierda * 1.4, -8, 0, 2);
        ctx.fill();
        ctx.stroke();

        
        ctx.beginPath();
        ctx.moveTo(0, 2);
        ctx.bezierCurveTo(-anchoAlaIzquierda * 1.1, 12, -anchoAlaIzquierda * 0.8, 20, 0, 8);
        ctx.fill();
        ctx.stroke();

        
        ctx.beginPath();
        ctx.moveTo(0, -2);
        ctx.bezierCurveTo(anchoAlaDerecha, -25, anchoAlaDerecha * 1.4, -8, 0, 2);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, 2);
        ctx.bezierCurveTo(anchoAlaDerecha * 1.1, 12, anchoAlaDerecha * 0.8, 20, 0, 8);
        ctx.fill();
        ctx.stroke();

       
        ctx.shadowBlur = 0;

       
        ctx.beginPath();
        ctx.moveTo(-1, -12);
        ctx.quadraticCurveTo(-4, -18, -6, -20);
        ctx.moveTo(1, -12);
        ctx.quadraticCurveTo(4, -18, 6, -20);
        ctx.lineWidth = 0.8;
        ctx.stroke();

       
        ctx.beginPath();
        ctx.moveTo(0, -12);
        ctx.lineTo(0, 10);
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacidad + 0.1})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.restore();
    }
}


const mariposa = new Mariposa();


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