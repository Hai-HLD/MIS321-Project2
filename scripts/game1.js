// Game 1: Math Challenge - Algebra Questions Only
const API_BASE_URL = 'http://localhost:5000';

// Question bank - 30 Algebra Questions
const questions = [
  {
    question: "Solve for x: 2x + 5 = 13",
    options: ["x = 4", "x = 9", "x = 8", "x = 6"],
    correct: 0,
    category: "Algebra"
  },
  {
    question: "Solve for x: 3x - 7 = 14",
    options: ["x = 5", "x = 7", "x = 21", "x = 3"],
    correct: 1,
    category: "Algebra"
  },
  {
    question: "Simplify: 4x + 3x - 2x",
    options: ["9x", "5x", "x", "7x"],
    correct: 1,
    category: "Algebra"
  },
  {
    question: "What is the value of x if 5x = 35?",
    options: ["5", "7", "8", "6"],
    correct: 1,
    category: "Algebra"
  },
  {
    question: "Solve for x: x/4 = 3",
    options: ["7", "12", "16", "9"],
    correct: 1,
    category: "Algebra"
  },
  {
    question: "What is 2³?",
    options: ["6", "8", "9", "4"],
    correct: 1,
    category: "Algebra"
  },
  {
    question: "Solve for x: 4x + 8 = 2x + 18",
    options: ["x = 5", "x = 10", "x = 3", "x = 8"],
    correct: 0,
    category: "Algebra"
  },
  {
    question: "If y = 2x + 3 and x = 4, what is y?",
    options: ["11", "9", "7", "13"],
    correct: 0,
    category: "Algebra"
  },
  {
    question: "Simplify: (3x)(4x)",
    options: ["7x", "12x", "12x²", "7x²"],
    correct: 2,
    category: "Algebra"
  },
  {
    question: "What is the value of x² when x = 5?",
    options: ["10", "25", "15", "20"],
    correct: 1,
    category: "Algebra"
  },
  {
    question: "Solve for x: 6x + 3 = 21",
    options: ["x = 3", "x = 4", "x = 2", "x = 5"],
    correct: 0,
    category: "Algebra"
  },
  {
    question: "What is 3⁴?",
    options: ["12", "27", "64", "81"],
    correct: 3,
    category: "Algebra"
  },
  {
    question: "Solve for x: 2x - 5 = 13",
    options: ["x = 4", "x = 9", "x = 8", "x = 6"],
    correct: 1,
    category: "Algebra"
  },
  {
    question: "Simplify: 3x² + 2x²",
    options: ["5x²", "6x²", "x⁴", "5x⁴"],
    correct: 0,
    category: "Algebra"
  },
  {
    question: "What is the value of y if 2y + 10 = 24?",
    options: ["5", "7", "8", "6"],
    correct: 1,
    category: "Algebra"
  },
  {
    question: "Solve for x: 5x = 40",
    options: ["6", "7", "8", "9"],
    correct: 2,
    category: "Algebra"
  },
  {
    question: "Simplify: (2x + 3) + (x - 2)",
    options: ["3x + 1", "3x - 1", "2x + 1", "x + 5"],
    correct: 0,
    category: "Algebra"
  },
  {
    question: "What is the value of 4²?",
    options: ["8", "16", "12", "20"],
    correct: 1,
    category: "Algebra"
  },
  {
    question: "Solve for x: x + 7 = 15",
    options: ["6", "7", "8", "9"],
    correct: 2,
    category: "Algebra"
  },
  {
    question: "Simplify: 8x - 3x + 2x",
    options: ["13x", "7x", "5x", "9x"],
    correct: 1,
    category: "Algebra"
  },
  {
    question: "What is the value of x if 3x + 4 = 19?",
    options: ["4", "5", "6", "7"],
    correct: 1,
    category: "Algebra"
  },
  {
    question: "Solve for x: 7x - 10 = 25",
    options: ["x = 3", "x = 4", "x = 5", "x = 6"],
    correct: 2,
    category: "Algebra"
  },
  {
    question: "What is (-3)²?",
    options: ["-9", "-6", "9", "6"],
    correct: 2,
    category: "Algebra"
  },
  {
    question: "Simplify: 2(x + 5)",
    options: ["2x + 5", "2x + 10", "x + 10", "3x + 5"],
    correct: 1,
    category: "Algebra"
  },
  {
    question: "Solve for x: 9x = 72",
    options: ["7", "8", "9", "10"],
    correct: 1,
    category: "Algebra"
  },
  {
    question: "What is the value of x³ when x = 3?",
    options: ["9", "18", "27", "12"],
    correct: 2,
    category: "Algebra"
  },
  {
    question: "Solve for x: 6x + 4 = 28",
    options: ["x = 3", "x = 4", "x = 5", "x = 6"],
    correct: 1,
    category: "Algebra"
  },
  {
    question: "Simplify: x² - 2x²",
    options: ["-x²", "x²", "3x²", "-3x²"],
    correct: 0,
    category: "Algebra"
  },
  {
    question: "What is the value of y if y/3 = 7?",
    options: ["21", "10", "14", "24"],
    correct: 0,
    category: "Algebra"
  },
  {
    question: "Solve for x: 10 - x = 3",
    options: ["x = 5", "x = 6", "x = 7", "x = 8"],
    correct: 2,
    category: "Algebra"
  },
  {
    question: "Simplify: 5x + 2x - x",
    options: ["8x", "7x", "6x", "4x"],
    correct: 2,
    category: "Algebra"
  }
];

// Game state
let currentQuestionIndex = 0;
let score = 0;
let selectedQuestions = [];
let timeLeft = 30;
let timerInterval = null;
let questionsAnswered = 0;

// Road game state
let chickenPosition = 0; // 0 = bottom lane, 5 = top lane
let incorrectAnswers = 0;
let maxIncorrect = 3;
let cars = []; // Array to store car positions and animations
let gameWon = false;

// Initialize game
function initGame() {
  // Select 30 random questions from the pool
  selectedQuestions = shuffleArray([...questions]).slice(0, 30);
  currentQuestionIndex = 0;
  score = 0;
  questionsAnswered = 0;
  
  // Reset road game state
  chickenPosition = 0;
  incorrectAnswers = 0;
  cars = [];
  gameWon = false;
  
  // Set up quit button
  const quitBtn = document.getElementById('quitGameBtn');
  if (quitBtn) {
    quitBtn.addEventListener('click', quitGame);
  }
  
  showStartScreen();
}

// Shuffle array helper
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Show start screen
function showStartScreen() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card shadow-lg">
          <div class="card-body text-center p-4">
            <h1 class="display-5 mb-3">🧮 Math Challenge - Algebra</h1>
            <p class="lead mb-3">Test your algebra skills!</p>
            <div class="alert alert-info mb-3">
              <h6 class="mb-2">Game Rules:</h6>
              <div class="row text-start">
                <div class="col-md-6">
                  <small>✓ Answer questions correctly</small><br>
                  <small>✓ 30 seconds per question</small>
                </div>
                <div class="col-md-6">
                  <small>✓ Each correct = 10 points</small><br>
                  <small>✓ Try to get highest score!</small>
                </div>
              </div>
            </div>
            <div class="d-grid gap-2">
              <button class="btn btn-primary" onclick="startGame()">
                Start Game
              </button>
              <a href="./game.html" class="btn btn-outline-secondary">
                Back to Games
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Start game
function startGame() {
  currentQuestionIndex = 0;
  score = 0;
  questionsAnswered = 0;
  
  // Reset road game state
  chickenPosition = 0;
  incorrectAnswers = 0;
  cars = [];
  gameWon = false;
  
  // Show quit button when starting new game
  const quitBtn = document.getElementById('quitGameBtn');
  if (quitBtn) {
    quitBtn.style.display = 'block';
  }
  
  showQuestion();
}

// Show question
function showQuestion() {
  if (currentQuestionIndex >= selectedQuestions.length || gameWon) {
    endGame();
    return;
  }

  const question = selectedQuestions[currentQuestionIndex];
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <div class="row justify-content-center">
      <div class="col-lg-10">
        <div class="card shadow-lg">
          <div class="card-header bg-primary text-white">
            <div class="d-flex justify-content-between align-items-center">
              <span class="badge bg-light text-primary">Question ${currentQuestionIndex + 1}/${selectedQuestions.length}</span>
              <span class="badge bg-warning text-dark" id="timer">Time: 30s</span>
              <span class="badge bg-light text-primary">Score: ${score}</span>
              <span class="badge bg-danger text-white">Strikes: ${incorrectAnswers}/${maxIncorrect}</span>
            </div>
          </div>
          <div class="card-body p-3">
            <div class="mb-2">
              <span class="badge bg-info">${question.category}</span>
            </div>
            <h4 class="mb-3">${question.question}</h4>
            
            <!-- Road Game Area -->
            <div class="road-container mb-4">
              <div class="road">
                ${Array.from({length: 6}, (_, laneIndex) => `
                  <div class="lane ${laneIndex === chickenPosition ? 'chicken-lane' : ''}" data-lane="${laneIndex}">
                    <div class="lane-content">
                      ${laneIndex === chickenPosition ? '<div class="chicken">🐔</div>' : ''}
                      <div class="cars" id="cars-lane-${laneIndex}"></div>
                    </div>
                  </div>
                `).join('')}
              </div>
              <div class="road-markings"></div>
            </div>
            
            <!-- Question Options -->
            <div class="d-grid gap-2">
              ${question.options.map((option, index) => `
                <button class="btn btn-outline-primary text-start answer-btn" 
                        onclick="selectAnswer(${index})"
                        data-index="${index}">
                  ${String.fromCharCode(65 + index)}. ${option}
                </button>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Start car animations
  startCarAnimations();
  startTimer();
}

// Start timer
function startTimer() {
  timeLeft = 30;
  updateTimerDisplay();
  
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      handleTimeout();
    }
  }, 1000);
}

// Update timer display
function updateTimerDisplay() {
  const timerElement = document.getElementById('timer');
  if (timerElement) {
    timerElement.textContent = `Time: ${timeLeft}s`;
    if (timeLeft <= 5) {
      timerElement.classList.remove('bg-warning', 'text-dark');
      timerElement.classList.add('bg-danger', 'text-white');
    }
  }
}

// Handle timeout
function handleTimeout() {
  // Move chicken back and increment strikes (same as wrong answer)
  chickenPosition = Math.max(chickenPosition - 1, 0);
  incorrectAnswers++;
  
  // Check if too many strikes
  if (incorrectAnswers >= maxIncorrect) {
    // Game over - chicken got run over
    showGameOverScreen('chicken-run-over');
    return;
  }
  
  questionsAnswered++;
  showFeedback(false, "Time's up!");
}

// Select answer
function selectAnswer(selectedIndex) {
  if (timerInterval) {
    clearInterval(timerInterval);
  }

  const question = selectedQuestions[currentQuestionIndex];
  const isCorrect = selectedIndex === question.correct;
  
  if (isCorrect) {
    score += 10;
    // Move chicken up
    chickenPosition = Math.min(chickenPosition + 1, 5);
    
    // Check if chicken reached the top (won the game)
    if (chickenPosition === 5) {
      gameWon = true;
    }
  } else {
    // Move chicken back and increment strikes
    chickenPosition = Math.max(chickenPosition - 1, 0);
    incorrectAnswers++;
    
    // Check if too many strikes
    if (incorrectAnswers >= maxIncorrect) {
      // Game over - chicken got run over
      showGameOverScreen('chicken-run-over');
      return;
    }
  }
  
  questionsAnswered++;
  showFeedback(isCorrect, null, selectedIndex);
}

// Show feedback
function showFeedback(isCorrect, timeoutMessage = null, selectedIndex = null) {
  const question = selectedQuestions[currentQuestionIndex];
  const buttons = document.querySelectorAll('.answer-btn');
  
  // Disable all buttons
  buttons.forEach(btn => {
    btn.disabled = true;
    const index = parseInt(btn.dataset.index);
    
    if (index === question.correct) {
      btn.classList.remove('btn-outline-primary');
      btn.classList.add('btn-success');
    } else if (index === selectedIndex && !isCorrect) {
      btn.classList.remove('btn-outline-primary');
      btn.classList.add('btn-danger');
    }
  });

  // Show feedback popup that covers the screen
  const feedbackPopup = document.createElement('div');
  feedbackPopup.id = 'feedbackPopup';
  feedbackPopup.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    backdrop-filter: blur(5px);
  `;
  
  feedbackPopup.innerHTML = `
    <div class="card shadow-lg" style="max-width: 400px; width: 90%;">
      <div class="card-body text-center p-4">
        <div class="mb-3">
          <i class="fas fa-${isCorrect ? 'check-circle text-success' : 'times-circle text-danger'}" style="font-size: 3rem;"></i>
        </div>
        <h3 class="mb-3 ${isCorrect ? 'text-success' : 'text-danger'}">
          ${timeoutMessage || (isCorrect ? 'Correct!' : 'Incorrect')}
        </h3>
        <p class="mb-3">
          ${timeoutMessage ? 'The correct answer was: ' : (isCorrect ? 'Great job!' : 'The correct answer is: ')}
          <strong>${question.options[question.correct]}</strong>
        </p>
        <div class="progress mb-3" style="height: 6px;">
          <div class="progress-bar ${isCorrect ? 'bg-success' : 'bg-danger'}" role="progressbar" style="width: 100%;" id="feedbackProgress"></div>
        </div>
        <small class="text-muted">Moving to next question...</small>
      </div>
    </div>
  `;
  
  document.body.appendChild(feedbackPopup);
  
  // Animate progress bar
  const progressBar = document.getElementById('feedbackProgress');
  progressBar.style.transition = 'width 1s linear';
  progressBar.style.width = '0%';
  
  // Auto-advance after 1 second
  setTimeout(() => {
    // Remove feedback popup
    const popup = document.getElementById('feedbackPopup');
    if (popup) {
      popup.remove();
    }
    
    if (currentQuestionIndex < selectedQuestions.length - 1) {
      nextQuestion();
    } else {
      endGame();
    }
  }, 1000);
}

// Next question
function nextQuestion() {
  currentQuestionIndex++;
  showQuestion();
}

// Quit game
function quitGame() {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  // End game without completing all questions
  endGame(true);
}

// End game
async function endGame(quitGame = false) {
  const app = document.getElementById('app');
  
  // Hide quit button when showing end screen
  const quitBtn = document.getElementById('quitGameBtn');
  if (quitBtn) {
    quitBtn.style.display = 'none';
  }
  
  const percentage = questionsAnswered > 0 ? (score / (questionsAnswered * 10)) * 100 : 0;
  let title = quitGame ? 'Game Quit' : (gameWon ? 'Victory! 🎉' : 'Game Over!');
  let message = '';
  let badgeClass = '';
  
  if (quitGame) {
    message = 'You quit the game';
    badgeClass = 'bg-secondary';
  } else if (gameWon) {
    message = '🐔 The chicken made it across! 🏆';
    badgeClass = 'bg-success';
  } else if (percentage >= 90) {
    message = 'Outstanding! 🏆';
    badgeClass = 'bg-success';
  } else if (percentage >= 70) {
    message = 'Great job! 🎉';
    badgeClass = 'bg-info';
  } else if (percentage >= 50) {
    message = 'Good effort! 👍';
    badgeClass = 'bg-warning';
  } else {
    message = 'Keep practicing! 💪';
    badgeClass = 'bg-secondary';
  }

  app.innerHTML = `
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card shadow-lg">
          <div class="card-body text-center p-4">
            <h1 class="display-5 mb-3">${title}</h1>
            <div class="mb-3">
              <span class="badge ${badgeClass} fs-6 px-3 py-2">${message}</span>
            </div>
            <div class="row g-2 mb-3">
              <div class="col-md-4">
                <div class="card bg-primary text-white">
                  <div class="card-body py-2">
                    <h4 class="mb-0">${score}</h4>
                    <small>Total Score</small>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card bg-success text-white">
                  <div class="card-body py-2">
                    <h4 class="mb-0">${questionsAnswered > 0 ? Math.round(percentage) : 0}%</h4>
                    <small>Accuracy</small>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card bg-info text-white">
                  <div class="card-body py-2">
                    <h4 class="mb-0">${questionsAnswered}/${selectedQuestions.length}</h4>
                    <small>Questions</small>
                  </div>
                </div>
              </div>
            </div>
            <div id="saveScoreMessage" class="mb-2"></div>
            <div class="d-grid gap-2">
              <button class="btn btn-primary" onclick="startGame()">
                Play Again
              </button>
              <a href="./game.html" class="btn btn-outline-secondary">
                Back to Games
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Try to save score to API
  await saveScore(score);
}

// Save score using local progress tracking
async function saveScore(finalScore) {
  const messageDiv = document.getElementById('saveScoreMessage');
  
  try {
    // Check if user is logged in and get user type
    const currentUser = window.Auth ? window.Auth.getCurrentUser() : null;
    
    if (!currentUser) {
      messageDiv.innerHTML = `
        <div class="alert alert-warning">
          <small>Please log in to save your score!</small>
        </div>
      `;
      return;
    }

    // Show admin-specific message
    if (currentUser.type === 'admin') {
      messageDiv.innerHTML = `
        <div class="alert alert-info">
          <small>Admin playing - Score: ${finalScore} (not saved)</small>
        </div>
      `;
      return;
    }

    // Check if student is logged in (for non-admin users)
    if (!window.GameProgress || !window.GameProgress.isStudentLoggedIn()) {
      messageDiv.innerHTML = `
        <div class="alert alert-warning">
          <small>Please log in as a student to save your score!</small>
        </div>
      `;
      return;
    }

    // Save progress using the new system
    const success = await window.GameProgress.saveGameProgress(1, finalScore);
    
    if (success) {
      messageDiv.innerHTML = `
        <div class="alert alert-success">
          <small>✓ Score saved successfully! Your progress has been recorded.</small>
        </div>
      `;
    } else {
      throw new Error('Failed to save score');
    }
  } catch (error) {
    console.error('Error saving score:', error);
    messageDiv.innerHTML = `
      <div class="alert alert-warning">
        <small>Could not save score. Please try again.</small>
      </div>
    `;
  }
}

// Start car animations
function startCarAnimations() {
  // Clear existing cars
  cars = [];
  
  // Create cars in random lanes
  for (let i = 0; i < 3; i++) {
    const lane = Math.floor(Math.random() * 6);
    createCar(lane);
  }
  
  // Add new cars periodically
  setInterval(() => {
    if (cars.length < 4) {
      const lane = Math.floor(Math.random() * 6);
      createCar(lane);
    }
  }, 3000);
}

// Create a car in a specific lane
function createCar(lane) {
  const carElement = document.createElement('div');
  carElement.className = 'car';
  carElement.innerHTML = '🚗';
  carElement.style.cssText = `
    position: absolute;
    right: -50px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 24px;
    animation: driveLeft 6s linear forwards;
    z-index: 2;
  `;
  
  const carsContainer = document.getElementById(`cars-lane-${lane}`);
  if (carsContainer) {
    carsContainer.appendChild(carElement);
    
    // Remove car after animation
    setTimeout(() => {
      if (carElement.parentNode) {
        carElement.parentNode.removeChild(carElement);
      }
    }, 6000);
  }
}

// Show game over screen for chicken run over
function showGameOverScreen(reason) {
  const app = document.getElementById('app');
  
  // Hide quit button
  const quitBtn = document.getElementById('quitGameBtn');
  if (quitBtn) {
    quitBtn.style.display = 'none';
  }
  
  app.innerHTML = `
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card shadow-lg">
          <div class="card-body text-center p-4">
            <h1 class="display-5 mb-3">💥 Game Over!</h1>
            <div class="mb-3">
              <span class="badge bg-danger fs-6 px-3 py-2">🐔 The chicken got run over!</span>
            </div>
            <div class="alert alert-danger mb-3">
              <h6 class="mb-2">Too many wrong answers!</h6>
              <p class="mb-0">The chicken couldn't make it across the road safely. Try again!</p>
            </div>
            <div class="row g-2 mb-3">
              <div class="col-md-4">
                <div class="card bg-primary text-white">
                  <div class="card-body py-2">
                    <h4 class="mb-0">${score}</h4>
                    <small>Total Score</small>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card bg-danger text-white">
                  <div class="card-body py-2">
                    <h4 class="mb-0">${incorrectAnswers}</h4>
                    <small>Wrong Answers</small>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card bg-info text-white">
                  <div class="card-body py-2">
                    <h4 class="mb-0">${questionsAnswered}</h4>
                    <small>Questions</small>
                  </div>
                </div>
              </div>
            </div>
            <div class="d-grid gap-2">
              <button class="btn btn-primary" onclick="startGame()">
                Try Again
              </button>
              <a href="./game.html" class="btn btn-outline-secondary">
                Back to Games
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Save score even on game over
  saveScore(score);
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', initGame);

