// Elementos del DOM
const menuContainer = document.getElementById('menuContainer');
const gameContainer = document.getElementById('gameContainer');
const startButton = document.getElementById('startButton');
const wordContainer = document.getElementById('wordContainer');
const usedLettersElement = document.getElementById('usedLetters');
const hintContainer = document.getElementById('hintContainer');
const messageContainer = document.getElementById('messageContainer');
const gifContainer = document.getElementById('gifContainer');
const selectNewOfficioButton = document.getElementById('selectNewOfficioButton');  // Aquí aseguramos tener el botón

// Variables del juego
let selectedOfficio = null;
let selectedWord = null;
let selectedHint = null;
let usedLetters = [];
let mistakes = 0;
let hits = 0;

// Función para ir al menú de selección de oficio
const goToMenu = () => {
    resetGameState();  // Reseteamos el estado del juego
    menuContainer.style.display = 'flex';  // Mostrar el menú de selección de oficio
    gameContainer.style.display = 'none';  // Ocultar el contenedor del juego
    startButton.style.display = 'none';  // Ocultar el botón START
    selectNewOfficioButton.style.display = 'none';  // Ocultar el botón para seleccionar otro oficio
};

// GIFs de victoria y derrota
const victoryGif = "static/gifs/victory.gif";
const lossGif = "static/gifs/loss.gif";

// Coordenadas de las partes del cuerpo (errores)
const bodyParts = [
    [4, 2, 1, 1],   // Cabeza
    [4, 3, 1, 2],   // Cuerpo
    [3, 5, 1, 1],   // Brazo izquierdo
    [5, 5, 1, 1],   // Brazo derecho
    [3, 3, 1, 1],   // Pierna izquierda
    [5, 3, 1, 1]    // Pierna derecha
];

// Función para seleccionar el oficio
const selectOfficio = (officio) => {
    selectedOfficio = officio;
    if (!selectedOfficio) {
        console.error("Error: Oficio no válido.");
        return;
    }

    menuContainer.style.display = 'none';  // Ocultar el menú
    gameContainer.style.display = 'block'; // Mostrar el contenedor del juego
    startButton.style.display = 'block';   // Mostrar el botón "START"
    selectNewOfficioButton.style.display = 'none';  // Ocultar el botón "Seleccionar otro oficio" hasta que termine el juego
};

// Función para iniciar el juego
const startGame = () => {
    if (!selectedOfficio) {
        console.error("Error: No se ha seleccionado un oficio.");
        return;
    }

    resetGameState();  // Reseteamos el estado del juego
    selectRandomWord();  // Seleccionamos una palabra aleatoria

    if (!selectedWord || !selectedHint) {
        console.error("Error: Palabra o pista no válida.");
        return;
    }

    drawHangMan();  // Dibuja la estructura del ahorcado
    drawWord();  // Dibuja los guiones bajos
    hintContainer.innerHTML = `Pista: ${selectedHint}`;  // Muestra la pista

    // Escuchar eventos del teclado
    document.addEventListener('keydown', letterEvent);
};

// Función para seleccionar una palabra aleatoria
const selectRandomWord = () => {
    const words = wordsByOfficio[selectedOfficio];
    if (!words || words.length === 0) {
        console.error(`Error: No hay palabras para el oficio seleccionado (${selectedOfficio}).`);
        return;
    }
    const randomWordObj = words[Math.floor(Math.random() * words.length)];
    selectedWord = randomWordObj.palabra.toUpperCase().split(''); // Convertir en array de letras
    selectedHint = randomWordObj.pista;

    console.log('Palabra seleccionada:', selectedWord);  // Verificar la palabra seleccionada
};


// Resetea el estado del juego
const resetGameState = () => {
    usedLetters = [];
    mistakes = 0;
    hits = 0;

    // Limpiar estado del juego
    gifContainer.style.display = 'none';
    wordContainer.innerHTML = '';
    usedLettersElement.innerHTML = '';  // Limpiar letras usadas
    hintContainer.innerHTML = '';
    messageContainer.innerHTML = '';
    startButton.style.display = 'none';  // Ocultar el botón "START"
    selectNewOfficioButton.style.display = 'none';  // Ocultar el botón "Seleccionar otro oficio"
};

// Función para dibujar los guiones bajos (_ _ _)
const drawWord = () => {
    // Limpiar el contenedor antes de agregar los nuevos guiones bajos
    wordContainer.innerHTML = '';

    // Crear los guiones bajos visibles para cada letra de la palabra
    selectedWord.forEach(() => {
        const letterElement = document.createElement('span');
        letterElement.innerHTML = '_';  // Muestra el guion bajo inicialmente
        letterElement.classList.add('letter'); // Clase para darle estilo
        wordContainer.appendChild(letterElement);
    });

    console.log('Contenedor de la palabra:', wordContainer.innerHTML);
};




// Manejo de eventos de teclado
const letterEvent = (event) => {
    const newLetter = event.key.toUpperCase();
    if (newLetter.match(/^[A-ZÑ]$/) && !usedLetters.includes(newLetter)) {
        usedLetters.push(newLetter);
        if (selectedWord.includes(newLetter)) {
            correctLetter(newLetter);
        } else {
            wrongLetter(newLetter);
        }
        addLetter(newLetter);  // Agrega la letra al contenedor de letras usadas
    }
};

// Maneja letras correctas
const correctLetter = (letter) => {
    const { children } = wordContainer; // Obtén los elementos que representan las letras
    for (let i = 0; i < selectedWord.length; i++) {
        if (selectedWord[i] === letter) { // Si la letra coincide
            children[i].innerHTML = letter; // Reemplaza el guion bajo por la letra correcta
            hits++;
        }
    }

    if (hits === selectedWord.length) endGame(true); // El jugador gana si adivina todas las letras
};


// Maneja letras incorrectas
const wrongLetter = (letter) => {
    addBodyPart(bodyParts[mistakes]);  // Dibuja la parte correspondiente del cuerpo
    mistakes++;  // Aumenta el número de errores
    if (mistakes === 6) endGame(false); // Termina el juego si el jugador comete 6 errores
};

// Agrega una letra al contenedor de letras usadas
const addLetter = (letter) => {
    const letterElement = document.createElement('span');
    letterElement.innerHTML = letter;
    letterElement.classList.add('used-letter');  // Clase CSS opcional para estilo
    usedLettersElement.appendChild(letterElement);
};

// Termina el juego
// Modificar la función endGame para mostrar ambos botones
const endGame = (won) => {
    document.removeEventListener('keydown', letterEvent);  // Deja de escuchar eventos de teclado
    messageContainer.innerHTML = won ? "¡Felicidades, ganaste!" : "Perdiste, intenta de nuevo.";  // Mensaje de victoria o derrota
    gifContainer.innerHTML = `<img src="${won ? victoryGif : lossGif}" alt="${won ? 'Ganaste' : 'Perdiste'}" />`;
    gifContainer.style.display = 'block';
    
    // Mostrar ambos botones: "START" para continuar y "Seleccionar otro oficio" para regresar al menú
    startButton.style.display = 'block';
    selectNewOfficioButton.style.display = 'block';  // Asegúrate de que este botón se muestra
};

// Dibuja el soporte del ahorcado
const drawHangMan = () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.canvas.width = 120;  // Tamaño fijo para el lienzo
    ctx.canvas.height = 160; 
    ctx.scale(20, 20);  // Escalar el dibujo para que se vea más grande

    // Limpiar el lienzo antes de dibujar
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#d95d39';  // Color de las partes del soporte
    ctx.fillRect(0, 7, 4, 1);  // Base
    ctx.fillRect(1, 0, 1, 8);  // Poste vertical
    ctx.fillRect(2, 0, 3, 1);  // Techo
    ctx.fillRect(4, 1, 1, 1);  // Soporte para la cuerda
};

// Dibuja una parte del cuerpo (según los errores cometidos)
const addBodyPart = (bodyPart) => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';  // Color de las partes del cuerpo
    ctx.fillRect(...bodyPart);  // Dibuja la parte correspondiente del cuerpo
};

// Asignar eventos a los botones de oficio
document.querySelectorAll('.officioBtn').forEach(button => {
    button.addEventListener('click', (event) => {
        selectOfficio(event.target.dataset.oficio);
    });
});

// Asignar evento al botón START
startButton.addEventListener('click', startGame);