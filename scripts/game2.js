// Game 2: Science Lab - General Science Questions
const API_BASE_URL = 'http://localhost:5000';

// Question bank
const questions = [
  // Biology Questions
  {
    question: "What is the powerhouse of the cell?",
    options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi apparatus"],
    correct: 1,
    category: "Biology"
  },
  {
    question: "What is the process by which plants make their own food?",
    options: ["Respiration", "Photosynthesis", "Digestion", "Fermentation"],
    correct: 1,
    category: "Biology"
  },
  {
    question: "How many chromosomes does a normal human cell have?",
    options: ["23", "46", "48", "44"],
    correct: 1,
    category: "Biology"
  },
  {
    question: "What is DNA short for?",
    options: ["Deoxyribonucleic acid", "Dinitrogen acid", "Dynamic acid", "Dextrose acid"],
    correct: 0,
    category: "Biology"
  },
  {
    question: "Which organ in the human body filters blood?",
    options: ["Heart", "Liver", "Kidney", "Lungs"],
    correct: 2,
    category: "Biology"
  },
  {
    question: "What type of blood cells fight infection?",
    options: ["Red blood cells", "White blood cells", "Platelets", "Plasma"],
    correct: 1,
    category: "Biology"
  },
  
  // Chemistry Questions
  {
    question: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correct: 2,
    category: "Chemistry"
  },
  {
    question: "What is the pH of pure water?",
    options: ["7", "0", "14", "10"],
    correct: 0,
    category: "Chemistry"
  },
  {
    question: "What is the atomic number of carbon?",
    options: ["4", "6", "8", "12"],
    correct: 1,
    category: "Chemistry"
  },
  {
    question: "Which gas is most abundant in Earth's atmosphere?",
    options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"],
    correct: 2,
    category: "Chemistry"
  },
  {
    question: "What is H2O commonly known as?",
    options: ["Salt", "Water", "Peroxide", "Sugar"],
    correct: 1,
    category: "Chemistry"
  },
  {
    question: "What is the chemical formula for table salt?",
    options: ["NaCl", "KCl", "CaCl2", "NaOH"],
    correct: 0,
    category: "Chemistry"
  },
  {
    question: "Which element has the symbol 'Fe'?",
    options: ["Fluorine", "Iron", "Francium", "Fermium"],
    correct: 1,
    category: "Chemistry"
  },
  
  // Physics Questions
  {
    question: "What is the speed of light in a vacuum?",
    options: ["300,000 km/s", "150,000 km/s", "500,000 km/s", "200,000 km/s"],
    correct: 0,
    category: "Physics"
  },
  {
    question: "What force keeps us on the ground?",
    options: ["Magnetic force", "Gravity", "Friction", "Tension"],
    correct: 1,
    category: "Physics"
  },
  {
    question: "What is the SI unit of force?",
    options: ["Joule", "Newton", "Watt", "Pascal"],
    correct: 1,
    category: "Physics"
  },
  {
    question: "Who developed the theory of relativity?",
    options: ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Stephen Hawking"],
    correct: 1,
    category: "Physics"
  },
  {
    question: "What type of energy is stored in a battery?",
    options: ["Kinetic", "Chemical", "Nuclear", "Thermal"],
    correct: 1,
    category: "Physics"
  },
  {
    question: "What is the acceleration due to gravity on Earth?",
    options: ["9.8 m/s²", "10 m/s²", "8.9 m/s²", "11 m/s²"],
    correct: 0,
    category: "Physics"
  },
  
  // Earth Science Questions
  {
    question: "What is the largest planet in our solar system?",
    options: ["Saturn", "Jupiter", "Neptune", "Uranus"],
    correct: 1,
    category: "Earth Science"
  },
  {
    question: "What causes Earth's seasons?",
    options: ["Distance from the sun", "Earth's tilt", "Solar flares", "Moon phases"],
    correct: 1,
    category: "Earth Science"
  },
  {
    question: "What is the Earth's outermost layer called?",
    options: ["Mantle", "Core", "Crust", "Magma"],
    correct: 2,
    category: "Earth Science"
  },
  {
    question: "What type of rock is formed from cooled lava?",
    options: ["Sedimentary", "Metamorphic", "Igneous", "Limestone"],
    correct: 2,
    category: "Earth Science"
  },
  {
    question: "What percentage of Earth's surface is covered by water?",
    options: ["50%", "60%", "71%", "80%"],
    correct: 2,
    category: "Earth Science"
  },
  {
    question: "What is the center of an atom called?",
    options: ["Electron", "Proton", "Neutron", "Nucleus"],
    correct: 3,
    category: "Earth Science"
  }
];

// Game state
let currentQuestionIndex = 0;
let score = 0;
let selectedQuestions = [];
let timeLeft = 30;
let timerInterval = null;
let questionsAnswered = 0;

// Initialize game
function initGame() {
  // Select 10 random questions
  selectedQuestions = shuffleArray([...questions]).slice(0, 10);
  currentQuestionIndex = 0;
  score = 0;
  questionsAnswered = 0;
  
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
          <div class="card-body text-center p-5">
            <h1 class="display-4 mb-4">🔬 Science Lab</h1>
            <p class="lead mb-4">Test your knowledge of biology, chemistry, physics, and earth science!</p>
            <div class="alert alert-info">
              <h5>Game Rules:</h5>
              <ul class="list-unstyled mb-0">
                <li>✓ Answer 10 questions</li>
                <li>✓ 30 seconds per question</li>
                <li>✓ Each correct answer = 10 points</li>
                <li>✓ Questions cover multiple science topics</li>
              </ul>
            </div>
            <button class="btn btn-success btn-lg mt-3" onclick="startGame()">
              Start Game
            </button>
            <a href="./game.html" class="btn btn-outline-secondary btn-lg mt-3 ms-2">
              Back to Games
            </a>
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
  showQuestion();
}

// Show question
function showQuestion() {
  if (currentQuestionIndex >= selectedQuestions.length) {
    endGame();
    return;
  }

  const question = selectedQuestions[currentQuestionIndex];
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card shadow-lg">
          <div class="card-header bg-success text-white">
            <div class="d-flex justify-content-between align-items-center">
              <span class="badge bg-light text-success">Question ${currentQuestionIndex + 1}/10</span>
              <span class="badge bg-warning text-dark" id="timer">Time: 30s</span>
              <span class="badge bg-light text-success">Score: ${score}</span>
            </div>
          </div>
          <div class="card-body p-4">
            <div class="mb-3">
              <span class="badge bg-info">${question.category}</span>
            </div>
            <h3 class="mb-4">${question.question}</h3>
            <div class="d-grid gap-3">
              ${question.options.map((option, index) => `
                <button class="btn btn-outline-success btn-lg text-start answer-btn" 
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
      btn.classList.remove('btn-outline-success');
      btn.classList.add('btn-success');
    } else if (index === selectedIndex && !isCorrect) {
      btn.classList.remove('btn-outline-success');
      btn.classList.add('btn-danger');
    }
  });

  // Show feedback message
  const app = document.getElementById('app');
  const feedbackDiv = document.createElement('div');
  feedbackDiv.className = 'row justify-content-center mt-3';
  feedbackDiv.innerHTML = `
    <div class="col-lg-8">
      <div class="alert ${isCorrect ? 'alert-success' : 'alert-danger'} alert-dismissible fade show">
        <h5>${timeoutMessage || (isCorrect ? '✓ Correct!' : '✗ Incorrect')}</h5>
        <p class="mb-0">
          ${timeoutMessage ? 'The correct answer was: ' : (isCorrect ? 'Great job!' : 'The correct answer is: ')}
          <strong>${question.options[question.correct]}</strong>
        </p>
      </div>
      <div class="d-grid">
        <button class="btn btn-success" onclick="nextQuestion()">
          ${currentQuestionIndex < selectedQuestions.length - 1 ? 'Next Question' : 'See Results'}
        </button>
      </div>
    </div>
  `;
  app.appendChild(feedbackDiv);
}

// Next question
function nextQuestion() {
  currentQuestionIndex++;
  showQuestion();
}

// End game
async function endGame() {
  const app = document.getElementById('app');
  
  const percentage = (score / (selectedQuestions.length * 10)) * 100;
  let message = '';
  let badgeClass = '';
  
  if (percentage >= 90) {
    message = 'Science Master! 🏆';
    badgeClass = 'bg-success';
  } else if (percentage >= 70) {
    message = 'Great scientist! 🎉';
    badgeClass = 'bg-info';
  } else if (percentage >= 50) {
    message = 'Good effort! 👍';
    badgeClass = 'bg-warning';
  } else {
    message = 'Keep learning! 💪';
    badgeClass = 'bg-secondary';
  }

  app.innerHTML = `
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card shadow-lg">
          <div class="card-body text-center p-5">
            <h1 class="display-4 mb-4">Experiment Complete!</h1>
            <div class="mb-4">
              <span class="badge ${badgeClass} fs-5 px-4 py-3">${message}</span>
            </div>
            <div class="row g-3 mb-4">
              <div class="col-md-4">
                <div class="card bg-success text-white">
                  <div class="card-body">
                    <h3 class="display-6 mb-0">${score}</h3>
                    <p class="mb-0">Total Score</p>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card bg-primary text-white">
                  <div class="card-body">
                    <h3 class="display-6 mb-0">${Math.round(percentage)}%</h3>
                    <p class="mb-0">Accuracy</p>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card bg-info text-white">
                  <div class="card-body">
                    <h3 class="display-6 mb-0">${questionsAnswered}/10</h3>
                    <p class="mb-0">Questions</p>
                  </div>
                </div>
              </div>
            </div>
            <div id="saveScoreMessage" class="mb-3"></div>
            <div class="d-grid gap-2">
              <button class="btn btn-success btn-lg" onclick="startGame()">
                Play Again
              </button>
              <a href="./game.html" class="btn btn-outline-secondary btn-lg">
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
    // Check if student is logged in
    if (!window.GameProgress || !window.GameProgress.isStudentLoggedIn()) {
      messageDiv.innerHTML = `
        <div class="alert alert-warning">
          <small>Please log in as a student to save your score!</small>
        </div>
      `;
      return;
    }

    // Save progress using the new system
    const success = window.GameProgress.saveGameProgress(2, finalScore);
    
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

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', initGame);

