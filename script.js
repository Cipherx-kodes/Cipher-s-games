// Get DOM elements
const choices = document.querySelectorAll('.choice');
const playerScoreElement = document.getElementById('player-score');
const computerScoreElement = document.getElementById('computer-score');
const resultDisplay = document.getElementById('result-display');

// Initialize scores
let playerScore = 0;
let computerScore = 0;
const maxScore = 5; // Adjust this value to change the winning score

// Game options
const options = ['rock', 'paper', 'scissors'];

// Add click event listeners to choices
choices.forEach(choice => {
    choice.addEventListener('click', playRound);
});

function playRound(e) {
    const playerChoice = e.currentTarget.dataset.choice;
    disableChoices();
    displayResult(playerChoice, null, 'waiting');
    
    setTimeout(() => {
        const computerChoice = getComputerChoice();
        const result = getWinner(playerChoice, computerChoice);
        updateScores(result);
        displayResult(playerChoice, computerChoice, result);
        highlightChoices(playerChoice, computerChoice);
        blinkComputerChoice(computerChoice);
        checkGameEnd();
        if (!isGameOver()) {
            enableChoices();
        }
    }, 2000);
}

function getComputerChoice() {
    return options[Math.floor(Math.random() * options.length)];
}

function getWinner(player, computer) {
    if (player === computer) return 'tie';
    if (
        (player === 'rock' && computer === 'scissors') ||
        (player === 'paper' && computer === 'rock') ||
        (player === 'scissors' && computer === 'paper')
    ) {
        return 'player';
    }
    return 'computer';
}

function updateScores(winner) {
    if (winner === 'player') {
        playerScore++;
    } else if (winner === 'computer') {
        computerScore++;
    }

    updateScoreDisplay();
    updateMeter('player-meter', playerScore);
    updateMeter('computer-meter', computerScore);
    updateWinnerCrown();
    checkGameEnd();
}

function animateScore(elementId, newScore) {
    const scoreElement = document.getElementById(elementId);
    const oldScore = parseInt(scoreElement.textContent);
    const duration = 1000; // Animation duration in milliseconds
    const start = performance.now();

    function updateScore(timestamp) {
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        const currentScore = Math.floor(oldScore + (newScore - oldScore) * progress);
        scoreElement.textContent = currentScore;

        if (progress < 1) {
            requestAnimationFrame(updateScore);
        }
    }

    requestAnimationFrame(updateScore);
}

function updateMeter(meterId, score) {
    const percentage = (score / maxScore) * 100;
    const meterElement = document.getElementById(meterId);
    meterElement.style.width = `${percentage}%`;
    
    // Add color transition based on the score
    if (percentage <= 33) {
        meterElement.style.backgroundColor = '#60A5FA'; // blue-400
    } else if (percentage <= 66) {
        meterElement.style.backgroundColor = '#FBBF24'; // yellow-400
    } else {
        meterElement.style.backgroundColor = '#EF4444'; // red-500
    }
}

function checkWinner() {
    if (playerScore >= maxScore || computerScore >= maxScore) {
        // The winner announcement is now handled by showWinnerAnnouncement
        // so we don't need to do anything here
    }
}

function displayResult(playerChoice, computerChoice, result) {
    let resultText = `You chose <span class="highlight">${playerChoice}</span>. `;
    if (result === 'waiting') {
        resultText += "Waiting for computer's choice...";
    } else {
        resultText += `Computer chose <span class="highlight">${computerChoice}</span>. `;
        if (result === 'tie') {
            resultText += "It's a tie!";
        } else if (result === 'player') {
            resultText += "<span class='highlight'>You win!</span>";
        } else {
            resultText += "<span class='highlight'>Computer wins!</span>";
        }
    }
    resultDisplay.innerHTML = resultText;
}

function highlightChoices(playerChoice, computerChoice) {
    choices.forEach(choice => {
        choice.style.opacity = '0.5';
        choice.style.transform = 'scale(0.9)';
    });

    const playerChoiceElement = document.querySelector(`[data-choice="${playerChoice}"]`);
    const computerChoiceElement = document.querySelector(`[data-choice="${computerChoice}"]`);

    playerChoiceElement.style.opacity = '1';
    playerChoiceElement.style.transform = 'scale(1.1)';
    computerChoiceElement.style.opacity = '1';
    computerChoiceElement.style.transform = 'scale(1.1)';

    setTimeout(() => {
        choices.forEach(choice => {
            choice.style.opacity = '1';
            choice.style.transform = 'scale(1)';
        });
    }, 1500);
}

function blinkComputerChoice(computerChoice) {
    const computerChoiceElement = document.querySelector(`[data-choice="${computerChoice}"]`);
    computerChoiceElement.classList.add('blink');
    setTimeout(() => {
        computerChoiceElement.classList.remove('blink');
    }, 1500); // Remove the blink class after the animation completes
}

function checkGameEnd() {
    if (playerScore >= maxScore || computerScore >= maxScore) {
        const winner = playerScore >= maxScore ? 'You' : 'Computer';
        disableChoices();
        setTimeout(() => showWinnerAnnouncement(winner), 1000);
    }
}

function showWinnerAnnouncement(winner) {
    const modal = document.getElementById('winner-modal');
    const winnerText = document.getElementById('winner-text');
    const finalScore = document.getElementById('final-score');
    const playAgainBtn = document.getElementById('play-again');

    winnerText.textContent = `${winner} Wins!`;
    finalScore.textContent = `Final Score: You ${playerScore} - ${computerScore} Computer`;

    modal.classList.remove('hidden');

    // Trigger confetti animation
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });

    playAgainBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        resetGame();
    });
}

function resetGame() {
    playerScore = 0;
    computerScore = 0;
    updateScoreDisplay();
    updateMeter('player-meter', playerScore);
    updateMeter('computer-meter', computerScore);
    updateWinnerCrown();
    resultDisplay.textContent = 'New game started. Make your choice!';
    enableChoices();
}

function enableChoices() {
    choices.forEach(choice => {
        choice.removeEventListener('click', playRound);
        choice.addEventListener('click', playRound);
        choice.style.cursor = 'pointer';
    });
}

function isGameOver() {
    return playerScore >= maxScore || computerScore >= maxScore;
}

function updateScoreDisplay() {
    animateScore('player-score', playerScore);
    animateScore('computer-score', computerScore);
}

function updateWinnerCrown() {
    const playerCrown = document.getElementById('player-winner');
    const computerCrown = document.getElementById('computer-winner');
    
    if (playerScore > computerScore) {
        playerCrown.classList.remove('hidden');
        computerCrown.classList.add('hidden');
    } else if (computerScore > playerScore) {
        computerCrown.classList.remove('hidden');
        playerCrown.classList.add('hidden');
    } else {
        playerCrown.classList.add('hidden');
        computerCrown.classList.add('hidden');
    }
}

function disableChoices() {
    choices.forEach(choice => {
        choice.removeEventListener('click', playRound);
        choice.style.cursor = 'default';
    });
}
