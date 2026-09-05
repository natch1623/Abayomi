// Fecha de inicio: 5 de septiembre de 2024 a las 3:40 PM
const startDate = new Date(2024, 8, 5, 15, 40, 0).getTime();

function updateCounter() {
    const now = new Date().getTime();
    const difference = now - startDate;

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = days.toString().padStart(2, '0');
    document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
    document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');
}

// Actualizar cada segundo
setInterval(updateCounter, 1000);
updateCounter(); // Llamada inicial

// Generar estrellas de fondo
function createStars() {
    const sky = document.getElementById('sky');
    const starCount = 150;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        const x = Math.random() * 100;
        const y = Math.random() * 60; // Concentrar en la parte superior
        const size = Math.random() * 2 + 1;
        const duration = Math.random() * 3 + 1;
        
        star.style.left = `${x}vw`;
        star.style.top = `${y}vh`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.animationDuration = `${duration}s`;
        
        sky.appendChild(star);
    }
}

// Generar estrellas fugaces
function createShootingStars() {
    const sky = document.getElementById('sky');
    const shootingStarCount = 5;

    for (let i = 0; i < shootingStarCount; i++) {
        createSingleShootingStar(sky, i * 2000);
    }
}

function createSingleShootingStar(sky, delay) {
    const star = document.createElement('div');
    star.classList.add('shooting-star');
    
    // Posición inicial aleatoria en la parte superior derecha
    const x = Math.random() * 50 + 50; 
    const y = Math.random() * 30;
    
    star.style.left = `${x}vw`;
    star.style.top = `${y}vh`;
    star.style.animationDelay = `${delay}ms`;
    
    sky.appendChild(star);
    
    // Recrear la estrella después de la animación para mantenerlas apareciendo
    setTimeout(() => {
        star.remove();
        createSingleShootingStar(sky, Math.random() * 5000 + 2000);
    }, 3000 + delay);
}

// Dibujar campo de flores (No me olvides)
function drawFlowers() {
    const canvas = document.getElementById('flowersCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.4;
    
    const flowerCount = 300;
    
    // Colores para las "no me olvides" (azules claros, centros amarillos)
    const petalsColors = ['#87CEEB', '#ADD8E6', '#B0E0E6', '#4682B4'];
    
    // Dibujar pasto/tallos de fondo
    for (let i = 0; i < 500; i++) {
        ctx.beginPath();
        const x = Math.random() * canvas.width;
        const y = canvas.height;
        const height = Math.random() * canvas.height * 0.8 + 20;
        const curve = (Math.random() - 0.5) * 20;
        
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(x + curve, y - height/2, x + curve * 2, y - height);
        
        ctx.strokeStyle = `rgba(34, 139, 34, ${Math.random() * 0.5 + 0.1})`;
        ctx.lineWidth = Math.random() * 2 + 1;
        ctx.stroke();
    }
    
    // Dibujar flores
    for (let i = 0; i < flowerCount; i++) {
        const x = Math.random() * canvas.width;
        const y = canvas.height - (Math.random() * canvas.height * 0.9); // Distribuir de abajo hacia arriba
        const size = Math.random() * 4 + 2; // Tamaño aleatorio
        
        // Petalos
        const color = petalsColors[Math.floor(Math.random() * petalsColors.length)];
        ctx.fillStyle = color;
        
        for (let p = 0; p < 5; p++) {
            const angle = (p * Math.PI * 2) / 5;
            const px = x + Math.cos(angle) * size;
            const py = y + Math.sin(angle) * size;
            
            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Centro
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(x, y, size * 0.6, 0, Math.PI * 2);
        ctx.fill();
        
        // Centro blanco (detalle)
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(x, y, size * 0.2, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Inicializar todo
window.addEventListener('load', () => {
    createStars();
    createShootingStars();
    drawFlowers();
});

// Redibujar canvas si cambia el tamaño de la ventana
window.addEventListener('resize', drawFlowers);

// Acción del botón Iniciar
document.getElementById('startButton').addEventListener('click', () => {
    // Aquí puedes agregar la lógica para ir a la siguiente página
    alert('Próximamente: Siguiente página');
});
