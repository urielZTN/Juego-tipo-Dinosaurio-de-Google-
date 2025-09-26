document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener los elementos del DOM que vamos a manipular
    const choiceButtons = document.querySelectorAll('.choice-btn-v2');
    const playerChoiceText = document.getElementById('player-choice-text');
    const computerChoiceText = document.getElementById('computer-choice-text');
    const resultText = document.getElementById('result-text');
    const winsCount = document.getElementById('wins-count');
    const lossesCount = document.getElementById('losses-count');
    const tiesCount = document.getElementById('ties-count');

    // 2. Inicializar las variables para el marcador
    let wins = 0;
    let losses = 0;
    let ties = 0;

    // 3. Lógica del juego y sus funciones
    const choices = ['piedra', 'papel', 'tijera'];

    /**
     * @description Genera y retorna una elección aleatoria para la computadora.
     * @returns {string} La elección de la computadora (piedra, papel o tijera).
     */
    function getComputerChoice() {
        const randomIndex = Math.floor(Math.random() * choices.length);
        return choices[randomIndex];
    }

    /**
     * @description Compara la elección del jugador y la de la computadora para determinar el ganador.
     * @param {string} playerChoice - La elección del jugador.
     * @param {string} computerChoice - La elección de la computadora.
     * @returns {string} El resultado del juego ('¡Ganaste!', '¡Perdiste!' o '¡Empate!').
     */
    function determineWinner(playerChoice, computerChoice) {
        if (playerChoice === computerChoice) {
            return '¡Empate!';
        } else if (
            (playerChoice === 'piedra' && computerChoice === 'tijera') ||
            (playerChoice === 'papel' && computerChoice === 'piedra') ||
            (playerChoice === 'tijera' && computerChoice === 'papel')
        ) {
            return '¡Ganaste!';
        } else {
            return '¡Perdiste!';
        }
    }

    /**
     * @description Actualiza el marcador según el resultado del juego.
     * @param {string} result - El resultado del juego.
     */
    function updateScore(result) {
        if (result === '¡Ganaste!') {
            wins++;
        } else if (result === '¡Perdiste!') {
            losses++;
        } else {
            ties++;
        }
        winsCount.textContent = wins;
        lossesCount.textContent = losses;
        tiesCount.textContent = ties;
    }

    // 4. Añadir un 'event listener' a cada botón de elección
    choiceButtons.forEach(button => {
        button.addEventListener('click', () => {
            const playerChoice = button.dataset.choice;
            const computerChoice = getComputerChoice();
            const result = determineWinner(playerChoice, computerChoice);

            // 5. Actualizar el contenido de la página con los resultados
            playerChoiceText.textContent = `Elegiste: ${playerChoice.charAt(0).toUpperCase() + playerChoice.slice(1)}`;
            computerChoiceText.textContent = `La computadora eligió: ${computerChoice.charAt(0).toUpperCase() + computerChoice.slice(1)}`;
            resultText.textContent = result;

            // 6. Actualizar el marcador
            updateScore(result);
        });
    });
});