// Game 5: Geometry Challenge - Ladder Climbing
const API_BASE_URL = 'http://localhost:5000';

// Question bank - 30 Geometry Questions
const questions = [
  {
    question: "What is the area of a rectangle with length 8 cm and width 5 cm?",
    options: ["40 cm²", "13 cm²", "26 cm²", "80 cm²"],
    correct: 0,
    category: "Geometry"
  },
  {
    question: "What is the perimeter of a square with side length 6 cm?",
    options: ["12 cm", "24 cm", "36 cm", "18 cm"],
    correct: 1,
    category: "Geometry"
  },
  {
    question: "In a right triangle, if one leg is 3 and the other leg is 4, what is the hypotenuse?",
    options: ["5", "7", "6", "8"],
    correct: 0,
    category: "Geometry"
  },
  {
    question: "What is the area of a triangle with base 10 cm and height 6 cm?",
    options: ["60 cm²", "30 cm²", "16 cm²", "20 cm²"],
    correct: 1,
    category: "Geometry"
  },
  {
    question: "What is the circumference of a circle with radius 7? (Use π ≈ 3.14)",
    options: ["21.98", "43.96", "153.86", "14"],
    correct: 1,
    category: "Geometry"
  },
  {
    question: "What is the sum of angles in a triangle?",
    options: ["90°", "180°", "360°", "270°"],
    correct: 1,
    category: "Geometry"
  },
  {
    question: "What is the area of a circle with radius 5? (Use π ≈ 3.14)",
    options: ["31.4", "78.5", "15.7", "25"],
    correct: 1,
    category: "Geometry"
  },
  {
    question: "If two angles of a triangle are 45° and 65°, what is the third angle?",
    options: ["70°", "80°", "60°", "90°"],
    correct: 0,
    category: "Geometry"
  },
  {
    question: "What is the perimeter of a rectangle with length 12 cm and width 5 cm?",
    options: ["34 cm", "17 cm", "60 cm", "24 cm"],
    correct: 0,
    category: "Geometry"
  },
  {
    question: "How many degrees in a right angle?",
    options: ["45°", "90°", "180°", "360°"],
    correct: 1,
    category: "Geometry"
  },
  {
    question: "What is the area of a square with side length 9?",
    options: ["18", "36", "81", "27"],
    correct: 2,
    category: "Geometry"
  },
  {
    question: "In a parallelogram, opposite sides are:",
    options: ["Equal and perpendicular", "Equal and parallel", "Different lengths", "Only equal"],
    correct: 1,
    category: "Geometry"
  },
  {
    question: "What is the volume of a cube with side length 3?",
    options: ["9", "18", "27", "12"],
    correct: 2,
    category: "Geometry"
  },
  {
    question: "What is the area of a trapezoid with bases 5 and 9, and height 4?",
    options: ["28", "18", "36", "56"],
    correct: 0,
    category: "Geometry"
  },
  {
    question: "How many vertices does a cube have?",
    options: ["6", "8", "10", "12"],
    correct: 1,
    category: "Geometry"
  },
  {
    question: "What is the perimeter of an equilateral triangle with side 8?",
    options: ["16", "24", "32", "21"],
    correct: 1,
    category: "Geometry"
  },
  {
    question: "What is the area of a rhombus with diagonals 6 and 8?",
    options: ["14", "24", "28", "48"],
    correct: 1,
    category: "Geometry"
  },
  {
    question: "How many sides does a hexagon have?",
    options: ["5", "6", "7", "8"],
    correct: 1,
    category: "Geometry"
  },
  {
    question: "What is the surface area of a rectangular prism with dimensions 3×4×5?",
    options: ["94", "60", "47", "74"],
    correct: 0,
    category: "Geometry"
  },
  {
    question: "What is the diameter of a circle with radius 6?",
    options: ["12", "18", "36", "6"],
    correct: 0,
    category: "Geometry"
  },
  {
    question: "What is the area of a parallelogram with base 10 and height 7?",
    options: ["17", "70", "34", "35"],
    correct: 1,
    category: "Geometry"
  },
  {
    question: "How many degrees in an acute angle?",
    options: ["Less than 90°", "Exactly 90°", "Greater than 90°", "180°"],
    correct: 0,
    category: "Geometry"
  },
  {
    question: "What is the perimeter of a circle with radius 5? (Use π ≈ 3.14)",
    options: ["31.4", "15.7", "78.5", "25"],
    correct: 0,
    category: "Geometry"
  },
  {
    question: "What is the area of an isosceles triangle with base 8 and height 6?",
    options: ["24", "48", "14", "20"],
    correct: 0,
    category: "Geometry"
  },
  {
    question: "How many edges does a triangular prism have?",
    options: ["6", "9", "12", "15"],
    correct: 1,
    category: "Geometry"
  },
  {
    question: "What is the area of a sector of a circle with radius 10 and angle 60°?",
    options: ["≈ 47", "≈ 52.4", "≈ 31.4", "≈ 62.8"],
    correct: 1,
    category: "Geometry"
  },
  {
    question: "What is the area of a right triangle with legs 6 and 8?",
    options: ["14", "24", "48", "28"],
    correct: 1,
    category: "Geometry"
  },
  {
    question: "How many diagonals does a pentagon have?",
    options: ["3", "4", "5", "6"],
    correct: 2,
    category: "Geometry"
  },
  {
    question: "What is the circumference of a circle with diameter 10? (Use π ≈ 3.14)",
    options: ["15.7", "31.4", "78.5", "10"],
    correct: 1,
    category: "Geometry"
  },
  {
    question: "What is the volume of a cylinder with radius 3 and height 5? (Use π ≈ 3.14)",
    options: ["≈ 141.3", "≈ 47.1", "≈ 70.7", "≈ 94.2"],
    correct: 0,
    category: "Geometry"
  }
];

// Game state
let currentQuestionIndex = 0;
let score = 0;
let selectedQuestions = [];
let timeLeft = 30;
let timerInterval = null;
let questionsAnswered = 0;

// Ladder game state
let ladderRung = 0; // 0 = bottom, 10 = top
let incorrectAnswers = 0;
let maxIncorrect = 3;
let gameWon = false;

// Initialize game
function initGame() {
  // Select 30 random questions from the pool
  selectedQuestions = shuffleArray([...questions]).slice(0, 30);
  currentQuestionIndex = 0;
  score = 0;
  questionsAnswered = 0;
  
  // Reset ladder game state
  ladderRung = 0;
  incorrectAnswers = 0;
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
            <h1 class="display-5 mb-3">📐 Geometry Challenge</h1>
            <p class="lead mb-3">Climb the ladder by answering geometry questions!</p>
            <div class="alert alert-info mb-3">
              <h6 class="mb-2">Game Rules:</h6>
              <div class="row text-start">
                <div class="col-md-6">
                  <small>✓ Answer questions correctly</small><br>
                  <small>✓ 30 seconds per question</small>
                </div>
                <div class="col-md-6">
                  <small>✓ Reach the top of the ladder!</small><br>
                  <small>✓ 3 wrong answers = fall down</small>
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
  
  // Reset ladder game state
  ladderRung = 0;
  incorrectAnswers = 0;
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
              <span class="badge bg-danger text-white">Wrong: ${incorrectAnswers}/${maxIncorrect}</span>
            </div>
          </div>
          <div class="card-body p-3">
            <div class="mb-2">
              <span class="badge bg-info">${question.category}</span>
            </div>
            <h4 class="mb-3">${question.question}</h4>
            
            <!-- Ladder Game Area -->
            <div class="ladder-container mb-4">
              <div class="ladder" id="ladder">
                ${Array.from({length: 11}, (_, rungIndex) => {
                  const isActive = rungIndex === ladderRung;
                  return `
                    <div class="ladder-rung ${isActive ? 'active' : ''}" data-rung="${10 - rungIndex}">
                      <div class="rung-number">${10 - rungIndex}</div>
                      ${isActive ? '<div class="climber">🧗</div>' : ''}
                    </div>
                  `;
                }).join('')}
              </div>
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
  // Shake ladder and increment strikes (same as wrong answer)
  shakeLadder();
  incorrectAnswers++;
  
  // Check if too many strikes
  if (incorrectAnswers >= maxIncorrect) {
    // Game over - fall down ladder
    fallDownLadder();
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
    // Move up ladder
    ladderRung = Math.min(ladderRung + 1, 10);
    
    // Check if reached the top (won the game)
    if (ladderRung === 10) {
      gameWon = true;
    }
  } else {
    // Shake ladder and increment strikes
    shakeLadder();
    incorrectAnswers++;
    
    // Check if too many strikes
    if (incorrectAnswers >= maxIncorrect) {
      // Game over - fall down ladder
      fallDownLadder();
      return;
    }
  }
  
  questionsAnswered++;
  showFeedback(isCorrect, null, selectedIndex);
}

// Shake ladder animation
function shakeLadder() {
  const ladder = document.getElementById('ladder');
  if (ladder) {
    ladder.classList.add('shake');
    setTimeout(() => {
      ladder.classList.remove('shake');
    }, 500);
  }
}

// Fall down ladder animation
function fallDownLadder() {
  const ladder = document.getElementById('ladder');
  if (ladder) {
    ladder.classList.add('fall');
    setTimeout(() => {
      ladder.classList.remove('fall');
      // Move player to bottom
      ladderRung = 0;
      showGameOverScreen('fallen');
    }, 1000);
  }
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
    message = '🎯 You reached the top of the ladder! 🏆';
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
    const success = await window.GameProgress.saveGameProgress(5, finalScore);
    
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

// Show game over screen for falling down
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
              <span class="badge bg-danger fs-6 px-3 py-2">You fell down the ladder!</span>
            </div>
            <div class="alert alert-danger mb-3">
              <h6 class="mb-2">Too many wrong answers!</h6>
              <p class="mb-0">You lost your grip and fell down. Try again!</p>
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

