document.addEventListener("DOMContentLoaded", () => {

    // Cargar el logo
    loadComponent("main-logo-container", "components/logo.html")
    .then(() => {
        // UNA VEZ CARGADO EL HEADER, CARGAMOS SUS HIJOS:

        // Cargar logo dentro del header
        loadComponent("logo-container-header", "components/logo.html");

        loadComponent("main-menu-container", "components/menu.html");
    });
});

// Función para cargar HTML 
async function loadComponent(elementId, filePath) {
    const element = document.getElementById(elementId);
    if (!element) return;
    try {
        const response = await fetch(filePath);
        if (response.ok) {
            element.innerHTML = await response.text();
        } else {
            console.error(`Error loading ${filePath}: ${response.statusText}`);
        }
    } catch (error) { console.error(error); }
}

/* =========================================
   CÓDIGO DE AUDIO 
   ========================================= */

// 1. Tus notas originales
const notes = {
    'F': 349.23,
    'G': 392.00,
    'A': 440.00,
    'B': 493.88,
    // Agregué estas por si acaso alguna tecla no tiene letra asignada
    'C': 261.63, 'D': 293.66, 'E': 329.63 
};

// 2. Inicializar contexto (Igual que tu código)
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

// 3. Tu función playNote (Igual que tu código)
function playNote(note) {
    // Si el audio está suspendido (pasa en Chrome), lo reactivamos
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    // Si la nota no existe en la lista, usa 440 (A) por defecto para que no falle
    osc.frequency.value = notes[note] || 440.00; 
    
    const gain = audioCtx.createGain();
    gain.gain.value = 0.1;
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    setTimeout(() => {
        osc.stop();
    }, 350);
}

/* 4. EL CAMBIO IMPORTANTE:
   En lugar de 'querySelectorAll', usamos un 'Escucha Global'.
   Esto detecta las teclas AUNQUE se carguen después.
*/
document.addEventListener('mouseover', (e) => {
    // Verificamos si el mouse tocó algo que tenga la clase 'key-white'
    // OJO: Aquí es donde respondo tu pregunta: SÍ, usas .key-white
    if (e.target.classList.contains('key-white') || e.target.classList.contains('logo-part')) {
        
        const note = e.target.getAttribute('data-note');
        
        // Solo suena si tiene una nota asignada o si queremos que suene siempre
        if (note) {
            playNote(note);
        } else {
            // Opcional: Si la tecla no tiene nota, toca una por defecto
            playNote('G'); 
        }
    }
});