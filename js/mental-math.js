/* MENTAL MATH GAME LOGIC */

let mathCurrentLevel = 1;
let mathScore = 0;
let mathCorrect = 0;
let mathTimeLeft = 30;
let mathAnswer = 0;
let mathGameActive = false;
let mathTimerInterval = null;

const mathDifficulty = [
  { level: 1, min: 1, max: 10, operators: ['+', '-'], time: 30 },
  { level: 2, min: 1, max: 15, operators: ['+', '-'], time: 28 },
  { level: 3, min: 1, max: 20, operators: ['+', '-', '*'], time: 26 },
  { level: 4, min: 5, max: 25, operators: ['+', '-', '*'], time: 24 },
  { level: 5, min: 10, max: 30, operators: ['+', '-', '*', '÷'], time: 22 },
  { level: 6, min: 15, max: 40, operators: ['+', '-', '*', '÷'], time: 20 },
  { level: 7, min: 20, max: 50, operators: ['+', '-', '*', '÷'], time: 18 },
  { level: 8, min: 25, max: 60, operators: ['+', '-', '*', '÷'], time: 16 },
  { level: 9, min: 30, max: 75, operators: ['+', '-', '*', '÷'], time: 15 },
  { level: 10, min: 40, max: 100, operators: ['+', '-', '*', '÷'], time: 14 },
  { level: 11, min: 50, max: 150, operators: ['+', '-', '*', '÷'], time: 13 },
  { level: 12, min: 60, max: 200, operators: ['+', '-', '*', '÷'], time: 12 },
  { level: 13, min: 75, max: 250, operators: ['+', '-', '*', '÷'], time: 11 },
  { level: 14, min: 100, max: 300, operators: ['+', '-', '*', '÷'], time: 10 },
  { level: 15, min: 125, max: 400, operators: ['+', '-', '*', '÷'], time: 9 },
  { level: 16, min: 150, max: 500, operators: ['+', '-', '*', '÷'], time: 8 },
  { level: 17, min: 200, max: 600, operators: ['+', '-', '*', '÷'], time: 7 },
  { level: 18, min: 250, max: 750, operators: ['+', '-', '*', '÷'], time: 6 },
  { level: 19, min: 300, max: 1000, operators: ['+', '-', '*', '÷'], time: 5 },
  { level: 20, min: 500, max: 1500, operators: ['+', '-', '*', '÷'], time: 5 }
];

function startMathGame(level = 1) {
  mathCurrentLevel = level;
  mathScore = 0;
  mathCorrect = 0;
  mathGameActive = true;
  
  const difficulty = mathDifficulty[mathCurrentLevel - 1];
  mathTimeLeft = difficulty.time;
  
  document.getElementById('level-info').textContent = `Nível ${mathCurrentLevel} de 20 - ${difficulty.time}s`;
  document.getElementById('score-display').textContent = '0';
  document.getElementById('correct-count').textContent = '0';
  
  generateMathProblem();
  startMathTimer();
  
  document.getElementById('answer-input').focus();
}

function generateMathProblem() {
  const difficulty = mathDifficulty[mathCurrentLevel - 1];
  const num1 = Math.floor(Math.random() * (difficulty.max - difficulty.min + 1)) + difficulty.min;
  const num2 = Math.floor(Math.random() * (difficulty.max - difficulty.min + 1)) + difficulty.min;
  const op = difficulty.operators[Math.floor(Math.random() * difficulty.operators.length)];
  
  let displayOp = op;
  if (op === '÷') {
    // Garantir divisão exata
    mathAnswer = num1;
    displayOp = '÷';
    document.getElementById('equation').textContent = `${mathAnswer * num2} ${displayOp} ${num2}`;
  } else if (op === '*') {
    displayOp = '×';
    mathAnswer = num1 * num2;
    document.getElementById('equation').textContent = `${num1} ${displayOp} ${num2}`;
  } else if (op === '+') {
    mathAnswer = num1 + num2;
    document.getElementById('equation').textContent = `${num1} ${op} ${num2}`;
  } else if (op === '-') {
    mathAnswer = num1 - num2;
    document.getElementById('equation').textContent = `${num1} ${op} ${num2}`;
  }
  
  document.getElementById('answer-input').value = '';
  document.getElementById('answer-input').classList.remove('correct', 'wrong');
  document.getElementById('answer-input').focus();
}

function startMathTimer() {
  clearInterval(mathTimerInterval);
  
  mathTimerInterval = setInterval(() => {
    mathTimeLeft--;
    document.getElementById('time-display').textContent = mathTimeLeft + 's';
    document.getElementById('timer-fill').style.width = (mathTimeLeft / mathDifficulty[mathCurrentLevel - 1].time) * 100 + '%';
    
    if (mathTimeLeft <= 0) {
      endMathGame();
    }
  }, 1000);
}

function checkMathAnswer() {
  if (!mathGameActive) return;
  
  const input = document.getElementById('answer-input');
  const userAnswer = parseInt(input.value);
  
  if (userAnswer === mathAnswer) {
    input.classList.add('correct');
    playSound('correct');
    mathCorrect++;
    mathScore += (10 * mathCurrentLevel) + Math.ceil(mathTimeLeft);
    document.getElementById('score-display').textContent = mathScore;
    document.getElementById('correct-count').textContent = mathCorrect;
    addXP(10 * mathCurrentLevel);
    
    setTimeout(() => {
      generateMathProblem();
    }, 500);
  } else if (input.value !== '') {
    input.classList.add('wrong');
    playSound('wrong');
    
    setTimeout(() => {
      input.classList.remove('wrong');
      input.value = '';
    }, 500);
  }
}

function endMathGame() {
  mathGameActive = false;
  clearInterval(mathTimerInterval);
  
  const difficulty = mathDifficulty[mathCurrentLevel - 1];
  const expected = 3; // Expected number of correct answers
  const passed = mathCorrect >= expected;
  
  const modal = document.getElementById('result-modal');
  const emoji = document.getElementById('result-emoji');
  const title = document.getElementById('result-title');
  const message = document.getElementById('result-message');
  
  if (passed) {
    emoji.textContent = '🎉';
    title.textContent = 'Excelente!';
    playSound('levelup');
  } else {
    emoji.textContent = '😔';
    title.textContent = 'Tenta Novamente!';
    playSound('gameover');
  }
  
  message.innerHTML = `
    <strong>Score: ${mathScore}</strong><br>
    Respostas Corretas: ${mathCorrect}<br>
    Nível: ${mathCurrentLevel}/20
  `;
  
  modal.classList.add('show');
}

function nextMathLevel() {
  if (mathCurrentLevel < 20) {
    mathCurrentLevel++;
    document.getElementById('result-modal').classList.remove('show');
    startMathGame(mathCurrentLevel);
  } else {
    alert('🏆 Completaste todos os níveis!');
    backToMathHome();
  }
}

function retryMathLevel() {
  document.getElementById('result-modal').classList.remove('show');
  startMathGame(mathCurrentLevel);
}

function backToMathHome() {
  window.location.href = '../index.html';
}

// Input handling
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('answer-input');
  
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      checkMathAnswer();
    }
  });
  
  input.addEventListener('input', () => {
    if (input.classList.contains('wrong')) {
      input.classList.remove('wrong');
    }
  });
  
  startMathGame(1);
});
