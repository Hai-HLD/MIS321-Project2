// Game 3: Robot Beeper Challenge - Visual Programming Game

// Game state
let currentLevel = 1;
let robot = { x: 0, y: 0, direction: 0 }; // 0=East, 1=South, 2=West, 3=North
let beepers = [];
let obstacles = [];
let collectedBeepers = 0;
let movesUsed = 0;
let isRunning = false;
let program = [];
let timeLimit = 0;
let timeLeft = 0;
let gameTimer = null;

// Level configurations
const levels = {
  1: {
    name: "Easy",
    beepers: [{ x: 2, y: 1 }, { x: 5, y: 3 }, { x: 1, y: 6 }],
    obstacles: [],
    timeLimit: 0,
    description: "Simple 3-beeper collection"
  },
  2: {
    name: "Medium", 
    beepers: [{ x: 1, y: 2 }, { x: 3, y: 1 }, { x: 5, y: 4 }, { x: 2, y: 6 }, { x: 6, y: 2 }],
    obstacles: [{ x: 3, y: 3 }, { x: 4, y: 4 }],
    timeLimit: 0,
    description: "5 beepers with obstacles"
  },
  3: {
    name: "Hard",
    beepers: [{ x: 7, y: 1 }, { x: 1, y: 7 }, { x: 6, y: 6 }, { x: 2, y: 3 }, { x: 5, y: 1 }],
    obstacles: [{ x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 3 }, { x: 5, y: 3 }, { x: 3, y: 5 }],
    timeLimit: 0,
    description: "Complex maze navigation"
  },
  4: {
    name: "Extreme",
    beepers: [{ x: 1, y: 1 }, { x: 6, y: 1 }, { x: 1, y: 6 }, { x: 6, y: 6 }, { x: 3, y: 3 }],
    obstacles: [{ x: 2, y: 2 }, { x: 4, y: 2 }, { x: 2, y: 4 }, { x: 4, y: 4 }],
    timeLimit: 30,
    description: "Time-limited beeper hunt"
  },
  5: {
    name: "Master",
    beepers: [{ x: 7, y: 0 }, { x: 0, y: 7 }, { x: 7, y: 7 }, { x: 0, y: 0 }, { x: 3, y: 3 }, { x: 4, y: 4 }],
    obstacles: [{ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 5, y: 5 }, { x: 6, y: 6 }, { x: 3, y: 1 }, { x: 4, y: 2 }],
    timeLimit: 45,
    description: "Ultimate programming test"
  }
};

// Initialize game
function initGame() {
  createGrid();
  updateDisplay();
}

function loadLevel(levelNum) {
  currentLevel = levelNum;
  const level = levels[levelNum];
  
  robot = { x: 0, y: 0, direction: 0 };
  beepers = [...level.beepers];
  obstacles = [...level.obstacles];
  collectedBeepers = 0;
  movesUsed = 0;
  isRunning = false;
  program = [];
  timeLimit = level.timeLimit;
  timeLeft = timeLimit;
  
  // Show game content
  document.getElementById('gameContent').style.display = 'block';
  document.querySelector('.level-selector').style.display = 'none';
  
  // Update level title
  document.querySelector('.game-area h2').textContent = `🤖 Level ${levelNum}: ${level.name}`;
  document.querySelector('.game-area .lead').textContent = level.description;
  
  // Start timer if needed
  if (timeLimit > 0) {
    startTimer();
  }
  
  updateDisplay();
  updateCodeDisplay();
}

function startTimer() {
  if (gameTimer) clearInterval(gameTimer);
  timeLeft = timeLimit;
  gameTimer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(gameTimer);
      alert('⏰ Time\'s up! Try again!');
      resetGame();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const timerEl = document.getElementById('timer');
  if (timerEl) {
    timerEl.textContent = `⏱️ ${timeLeft}s`;
  }
}

function createGrid() {
  const grid = document.getElementById('gameGrid');
  grid.innerHTML = '';
  
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.x = x;
      cell.dataset.y = y;
      grid.appendChild(cell);
    }
  }
}

function updateDisplay() {
  // Clear all cells
  document.querySelectorAll('.cell').forEach(cell => {
    cell.innerHTML = '';
  });

  // Place robot
  const robotCell = document.querySelector(`[data-x="${robot.x}"][data-y="${robot.y}"]`);
  if (robotCell) {
    const robotEl = document.createElement('div');
    robotEl.className = 'robot';
    robotEl.textContent = '🤖';
    robotEl.style.transform = `rotate(${robot.direction * 90}deg)`;
    robotCell.appendChild(robotEl);
  }

  // Place obstacles
  obstacles.forEach(obstacle => {
    const obstacleCell = document.querySelector(`[data-x="${obstacle.x}"][data-y="${obstacle.y}"]`);
    if (obstacleCell) {
      const obstacleEl = document.createElement('div');
      obstacleEl.className = 'obstacle';
      obstacleEl.textContent = '⬛';
      obstacleEl.style.background = '#dc3545';
      obstacleEl.style.borderRadius = '4px';
      obstacleEl.style.color = 'white';
      obstacleEl.style.fontSize = '20px';
      obstacleCell.appendChild(obstacleEl);
    }
  });

  // Place beepers
  beepers.forEach(beeper => {
    const beeperCell = document.querySelector(`[data-x="${beeper.x}"][data-y="${beeper.y}"]`);
    if (beeperCell) {
      const beeperEl = document.createElement('div');
      beeperEl.className = 'beeper';
      beeperEl.textContent = '●';
      beeperCell.appendChild(beeperEl);
    }
  });

  // Update stats
  document.getElementById('beepersCollected').textContent = collectedBeepers;
  document.getElementById('movesUsed').textContent = movesUsed;
  document.getElementById('beepersRemaining').textContent = beepers.length;
}

function addCommand(command) {
  if (isRunning) return;
  
  program.push(command);
  updateCodeDisplay();
}

function updateCodeDisplay() {
  const codeArea = document.getElementById('codeArea');
  codeArea.innerHTML = '';
  
  if (program.length === 0) {
    codeArea.innerHTML = '<div class="code-line" style="color: #6c757d;">Click commands above to build your program...</div>';
    return;
  }

  program.forEach((cmd, index) => {
    const line = document.createElement('div');
    line.className = 'code-line';
    line.textContent = `${index + 1}. ${getCommandText(cmd)}`;
    line.dataset.index = index;
    line.addEventListener('click', () => removeCommand(index));
    codeArea.appendChild(line);
  });
}

function getCommandText(command) {
  const texts = {
    move: '⬆️ Move Forward',
    turnLeft: '↩️ Turn Left',
    turnRight: '↪️ Turn Right',
    pickBeeper: '🤖 Pick Beeper',
    putBeeper: '📦 Put Beeper',
    turnAround: '🔄 Turn Around'
  };
  return texts[command] || command;
}

function removeCommand(index) {
  if (isRunning) return;
  program.splice(index, 1);
  updateCodeDisplay();
}

async function runProgram() {
  if (isRunning || program.length === 0) return;
  
  isRunning = true;
  document.getElementById('runBtn').textContent = '⏸️ Running...';
  document.getElementById('runBtn').disabled = true;

  for (let i = 0; i < program.length; i++) {
    const command = program[i];
    await executeCommand(command);
    await new Promise(resolve => setTimeout(resolve, 800)); // Animation delay
    
        if (beepers.length === 0) {
          alert('🎉 Congratulations! You collected all beepers!');
          // Save progress when level is completed
          saveLevelProgress();
          break;
        }
  }

  isRunning = false;
  document.getElementById('runBtn').textContent = '▶️ Run Program';
  document.getElementById('runBtn').disabled = false;
}

async function executeCommand(command) {
  switch (command) {
    case 'move':
      const newPos = getNewPosition(robot.x, robot.y, robot.direction);
      if (isValidPosition(newPos.x, newPos.y)) {
        robot.x = newPos.x;
        robot.y = newPos.y;
        movesUsed++;
      }
      break;
    case 'turnLeft':
      robot.direction = (robot.direction + 3) % 4;
      movesUsed++;
      break;
    case 'turnRight':
      robot.direction = (robot.direction + 1) % 4;
      movesUsed++;
      break;
    case 'turnAround':
      robot.direction = (robot.direction + 2) % 4;
      movesUsed++;
      break;
    case 'pickBeeper':
      const beeperIndex = beepers.findIndex(b => b.x === robot.x && b.y === robot.y);
      if (beeperIndex !== -1) {
        beepers.splice(beeperIndex, 1);
        collectedBeepers++;
      }
      break;
    case 'putBeeper':
      if (collectedBeepers > 0) {
        beepers.push({ x: robot.x, y: robot.y });
        collectedBeepers--;
      }
      break;
  }
  updateDisplay();
}

function getNewPosition(x, y, direction) {
  const directions = [
    { x: 1, y: 0 },  // East
    { x: 0, y: 1 },  // South
    { x: -1, y: 0 }, // West
    { x: 0, y: -1 }  // North
  ];
  const dir = directions[direction];
  return { x: x + dir.x, y: y + dir.y };
}

function isValidPosition(x, y) {
  return x >= 0 && x < 8 && y >= 0 && y < 8;
}

function resetGame() {
  if (gameTimer) {
    clearInterval(gameTimer);
    gameTimer = null;
  }
  loadLevel(currentLevel);
}

function backToLevelSelect() {
  document.getElementById('gameContent').style.display = 'none';
  document.querySelector('.level-selector').style.display = 'block';
  if (gameTimer) {
    clearInterval(gameTimer);
    gameTimer = null;
  }
}

function clearCode() {
  if (isRunning) return;
  program = [];
  updateCodeDisplay();
  // Visual feedback
  const clearBtn = document.getElementById('clearBtn');
  const originalText = clearBtn.textContent;
  clearBtn.textContent = '✅ Cleared!';
  clearBtn.style.background = '#198754';
  setTimeout(() => {
    clearBtn.textContent = originalText;
    clearBtn.style.background = '#6c757d';
  }, 1000);
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  initGame();
  
  // Level selection
  document.querySelectorAll('.level-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadLevel(parseInt(btn.dataset.level));
    });
  });
  
  // Command buttons
  document.querySelectorAll('.cmd-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      addCommand(btn.dataset.command);
    });
  });

  // Game buttons
  document.getElementById('runBtn').addEventListener('click', runProgram);
  document.getElementById('resetBtn').addEventListener('click', resetGame);
  document.getElementById('clearBtn').addEventListener('click', clearCode);
});

// Save level progress
function saveLevelProgress() {
  try {
    // Check if student is logged in
    if (!window.GameProgress || !window.GameProgress.isStudentLoggedIn()) {
      console.log('Progress not saved: Student not logged in');
      return;
    }

    // Calculate score based on level and performance
    let score = 0;
    const baseScore = currentLevel * 20; // Base score per level
    const efficiencyBonus = Math.max(0, 100 - movesUsed); // Bonus for fewer moves
    const timeBonus = timeLimit > 0 ? Math.max(0, timeLeft * 2) : 50; // Time bonus if applicable
    
    score = baseScore + efficiencyBonus + timeBonus;
    
    // Save progress using the new system
    const success = window.GameProgress.saveGameProgress(3, score);
    
    if (success) {
      console.log('Level progress saved:', score);
    } else {
      console.error('Failed to save level progress');
    }
  } catch (error) {
    console.error('Error saving level progress:', error);
  }
}

// Auth check
if (window.Auth) {
  Auth.requireAuth('./login.html');
}
