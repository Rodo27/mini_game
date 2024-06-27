let score = 0;
let timer;
let timeLeft = 40;
let currentLevel = 1;

const $scoreElement = $('#score');
const $timerElement = $('#timer');
const $gameBoard = $('#game-board');

function startGame() {
    $('#popup').addClass('hidden');
    $('#game').removeClass('hidden');
    initializeLevel(currentLevel);
    startTimer();
}

function initializeLevel(level) {
    // Clear previous objects
    $('.draggable').remove();

    // Generate objects based on the level
    const numberOfObjects = level === 1 ? 6 : level === 2 ? 12 : 15;
    const colors = ['red', 'green', 'yellow', 'blue'];

    for (let i = 0; i < numberOfObjects; i++) {
        const color = colors[i % 4];
        const $div = $('<div>')
            .addClass(`draggable ${color}`)
            .css({
                top: `${Math.random() * 60 + 20}%`,
                left: `${Math.random() * 60 + 20}%`
            });
        $gameBoard.append($div);
    }

    $('.draggable').draggable({
        containment: '#game-board',
        scroll: false
    });
}

$('.container').droppable({
    accept: '.draggable',
    tolerance: 'fit',
    drop: function (event, ui) {
        const $draggable = ui.draggable;
        const color = $draggable.attr('class').split(' ')[1];
        const $container = $(this);

        if ($container.attr('id').includes(color)) {
            score += 5;
            $draggable.remove();
        } else {
            score -= 5;
        }

        $scoreElement.text(`Puntaje: ${score}`);
        checkLevelCompletion();
    }
});

function startTimer() {
    timeLeft = currentLevel === 1 ? 40 : currentLevel === 2 ? 30 : 20;
    $timerElement.text(`Tiempo: 0:${timeLeft}`);
    timer = setInterval(() => {
        timeLeft--;
        $timerElement.text(`Tiempo: 0:${timeLeft < 10 ? '0' : ''}${timeLeft}`);
        if (timeLeft === 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}

function checkLevelCompletion() {
    const remainingObjects = $('.draggable').length;
    if (remainingObjects === 0 && score > 0) {
        currentLevel++;
        if (currentLevel > 3) {
            alert('¡Felicidades! Has completado el juego.');
            resetGame();
        } else {
            alert(`Nivel ${currentLevel - 1} completado. ¡Vamos al siguiente nivel!`);
            clearInterval(timer);
            initializeLevel(currentLevel);
            startTimer();
        }
    }
}

function endGame() {
    alert('Tiempo terminado. ¡Inténtalo de nuevo!');
    resetGame();
}

function resetGame() {
    currentLevel = 1;
    score = 0;
    $scoreElement.text('Puntaje: 0');
    $('#popup').removeClass('hidden');
    $('#game').addClass('hidden');
}
