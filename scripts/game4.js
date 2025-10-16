// Game 4: Labyrinth of Lies functionality

// Game state
let currentRoom = 1;
let timeRemaining = 120; // 2 minutes in seconds
let timerInterval = null;
let roomsCompleted = 0;
let highestRoomReached = 0; // Track the furthest room reached
let correctDoorIndex = 0; // Which door is correct (randomized)
let isLoading = false; // Prevent spam clicking during transitions
let currentPuzzle = null; // Current puzzle data

// Embedded puzzle data to avoid CORS issues
// Converted from resources/game4questions/door#/door#-#.txt files
const PUZZLE_DATA = {
  1: [
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way."] },
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way way."] },
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way?."] },
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way!."] },
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way."] }
  ],
  2: [
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way."] },
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way way."] },
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way?."] },
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way!."] },
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way."] }
  ],
  3: [
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way."] },
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way way."] },
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way?."] },
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way!."] },
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way."] }
  ],
  4: [
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way."] },
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way way."] },
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way?."] },
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way!."] },
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way."] }
  ],
  5: [
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way."] },
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way way."] },
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way?."] },
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way!."] },
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way."] }
  ],
  6: [
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way."] },
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way way."] },
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way?."] },
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way!."] },
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way."] }
  ],
  7: [
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way."] },
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way way."] },
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way?."] },
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way!."] },
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way."] }
  ],
  8: [
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way."] },
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way way."] },
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way?."] },
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way!."] },
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way."] }
  ],
  9: [
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way."] },
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way way."] },
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way?."] },
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way!."] },
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way."] }
  ],
  10: [
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way."] },
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way way."] },
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way?."] },
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way!."] },
    { correctDoor: 2, wallNote: "All 3 doors tell the truth", doorMessages: ["This is not the way", "The Right Door is the Way", "This is the way."] }
  ]
};

// DOM elements
let menuButtons;
let titleSection;
let gameArea;
let gameOverScreen;

// Initialize DOM elements after page load
document.addEventListener('DOMContentLoaded', () => {
  menuButtons = document.getElementById('menuButtons');
  titleSection = document.getElementById('titleSection');
  gameArea = document.getElementById('gameArea');
  gameOverScreen = document.getElementById('gameOverScreen');
  
  // Set up button listeners
  document.getElementById('playBtn').addEventListener('click', startGame);
  document.getElementById('pastResultsBtn').addEventListener('click', showPastResults);
  document.getElementById('howToPlayBtn').addEventListener('click', showHowToPlay);
});

// Start the game
function startGame() {
  // Hide menu and title, show game
  menuButtons.style.display = 'none';
  titleSection.style.display = 'none';
  gameArea.style.display = 'block';
  gameOverScreen.style.display = 'none';
  
  // Reset game state
  currentRoom = 1;
  roomsCompleted = 0;
  highestRoomReached = 0;
  timeRemaining = 120;
  isLoading = false;
  
  // Make sure doors and note are visible
  showDoorsAndNote();
  hideFeedback();
  
  // Update UI (will load puzzle data)
  updateRoomDisplay();
  updateTimer();
  
  // Start timer
  startTimer();
  
  // Set up door click handlers
  setupDoorHandlers();
  
  // Set up quit button
  document.getElementById('quitGameBtn').addEventListener('click', quitGame);
}

// Set up door click handlers
function setupDoorHandlers() {
  const doorClickables = document.querySelectorAll('.door-clickable');
  doorClickables.forEach(area => {
    area.addEventListener('click', handleDoorClick);
  });
}

// Handle door selection
function handleDoorClick(event) {
  // Prevent spam clicking during loading
  if (isLoading) return;
  
  const doorCard = event.currentTarget;
  const doorIndex = parseInt(doorCard.getAttribute('data-door'));
  
  // Check if the selected door is the correct one
  const isCorrect = doorIndex === correctDoorIndex;
  
  isLoading = true;
  pauseTimer();
  hideDoorsAndNote();
  
  if (isCorrect) {
    // Check if this is a new room (not previously reached)
    if (currentRoom > highestRoomReached) {
      highestRoomReached = currentRoom;
      roomsCompleted++;
      
      // Add 1 minute (60 seconds) for completing a NEW room IMMEDIATELY
      timeRemaining += 60;
      updateTimer(); // Update display immediately
    }
    
    showFeedback('Correct! Loading next room...', 'success');
    
    setTimeout(() => {
      if (currentRoom < 10) {
        currentRoom++;
        updateRoomDisplay();
        showDoorsAndNote();
        hideFeedback();
        isLoading = false;
        resumeTimer();
      } else {
        // Game completed successfully!
        isLoading = false;
        endGame(true);
      }
    }, 500);
  } else {
    showFeedback('Wrong door! Returning to Room 1...', 'danger');
    setTimeout(() => {
      // Send back to room 1, don't end game
      currentRoom = 1;
      updateRoomDisplay();
      showDoorsAndNote();
      hideFeedback();
      isLoading = false;
      resumeTimer();
    }, 500);
  }
}

// Load puzzle data from embedded data
function loadPuzzle(roomNumber) {
  // Randomly select one of 5 puzzle variants
  const puzzleVariant = Math.floor(Math.random() * 5); // Random index 0-4
  
  // Get puzzles for this room
  const roomPuzzles = PUZZLE_DATA[roomNumber];
  
  if (!roomPuzzles || !roomPuzzles[puzzleVariant]) {
    console.error('Puzzle not found for room:', roomNumber);
    return {
      correctDoor: 0,
      wallNote: 'Puzzle not found',
      doorMessages: ['Door 1', 'Door 2', 'Door 3']
    };
  }
  
  return roomPuzzles[puzzleVariant];
}

// Update room display with puzzle data
function updateRoomDisplay() {
  document.getElementById('currentRoom').textContent = currentRoom;
  
  // Load puzzle for current room
  currentPuzzle = loadPuzzle(currentRoom);
  correctDoorIndex = currentPuzzle.correctDoor;
  
  // Update wall note
  document.getElementById('wallNote').textContent = currentPuzzle.wallNote;
  
  // Update door messages
  for (let i = 0; i < 3; i++) {
    document.getElementById(`door${i}Message`).textContent = currentPuzzle.doorMessages[i];
  }
}

// Timer functions
function startTimer() {
  timerInterval = setInterval(() => {
    timeRemaining--;
    updateTimer();
    
    if (timeRemaining <= 0) {
      endGame(false);
    }
  }, 1000);
}

function updateTimer() {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  document.getElementById('timer').textContent = 
    `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function pauseTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function resumeTimer() {
  if (!timerInterval) {
    startTimer();
  }
}

// Show feedback message
function showFeedback(message, type) {
  const feedbackDiv = document.getElementById('feedbackMessage');
  feedbackDiv.innerHTML = `<div class="alert alert-${type} text-center">${message}</div>`;
  feedbackDiv.style.display = 'block';
}

function hideFeedback() {
  document.getElementById('feedbackMessage').style.display = 'none';
}

// Hide doors and note during loading
function hideDoorsAndNote() {
  document.getElementById('doorsContainer').style.display = 'none';
}

// Show doors and note after loading
function showDoorsAndNote() {
  document.getElementById('doorsContainer').style.display = '';
}

// End game
async function endGame(completed, includeTimeBonus = true) {
  stopTimer();
  gameArea.style.display = 'none';
  gameOverScreen.style.display = 'block';
  
  // Calculate score
  const timeBonus = includeTimeBonus ? Math.floor(Math.max(0, timeRemaining) / 30) : 0;
  const currentScore = roomsCompleted + timeBonus;
  
  // Update game over screen
  if (completed) {
    document.getElementById('gameOverTitle').textContent = 'Congratulations! 🎉';
  } else if (!includeTimeBonus) {
    document.getElementById('gameOverTitle').textContent = 'Game Quit';
  } else {
    document.getElementById('gameOverTitle').textContent = 'Game Over!';
  }
  
  document.getElementById('roomsCompleted').textContent = roomsCompleted;
  document.getElementById('timeBonus').textContent = timeBonus;
  document.getElementById('currentScore').textContent = currentScore;
  
  // Get previous high score and check if this is a new record
  const currentUser = getCurrentUser();
  let previousHighScore = 0;
  let isNewHighScore = false;
  
  if (currentUser && currentUser.type === 'student') {
    try {
      const user = await findUserById(currentUser.StudentID);
      previousHighScore = user ? (user.StudentScoreGame4 || 0) : 0;
      isNewHighScore = currentScore > previousHighScore;
    } catch (error) {
      console.error('Error fetching previous high score:', error);
    }
  }
  
  // Display high score (will be updated after save if new record)
  const finalHighScore = isNewHighScore ? currentScore : previousHighScore;
  document.getElementById('highScore').textContent = finalHighScore;
  
  // Show "New High Score!" message if applicable
  const newHighScoreMessage = document.getElementById('newHighScoreMessage');
  if (isNewHighScore) {
    newHighScoreMessage.style.display = 'block';
  } else {
    newHighScoreMessage.style.display = 'none';
  }
  
  // Save score to database (only if new high score)
  await saveScore(currentScore);
  
  // Set up buttons
  document.getElementById('playAgainBtn').onclick = startGame;
  document.getElementById('backToMenuBtn').onclick = backToMenu;
}

// Quit game
function quitGame() {
  stopTimer();
  // End game without time bonus
  endGame(false, false);
}

// Back to menu
function backToMenu() {
  stopTimer();
  gameArea.style.display = 'none';
  gameOverScreen.style.display = 'none';
  titleSection.style.display = 'block';
  menuButtons.style.display = '';
  showDoorsAndNote();
  hideFeedback();
}

// Save score using local progress tracking
async function saveScore(score) {
  try {
    // Check if student is logged in
    if (!window.GameProgress || !window.GameProgress.isStudentLoggedIn()) {
      console.log('Score not saved: Student not logged in');
      return;
    }

    // Save progress using the new system
    const success = window.GameProgress.saveGameProgress(4, score);
    
    if (success) {
      console.log('Score saved successfully:', score);
    } else {
      console.error('Failed to save score');
    }
  } catch (error) {
    console.error('Error saving score:', error);
  }
}

// Show past results
async function showPastResults() {
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    // Not logged in
    document.getElementById('highestScore').textContent = '0';
    document.getElementById('scoreMessage').textContent = 'Please log in to view your scores.';
  } else if (currentUser.type !== 'student') {
    // Teacher account
    document.getElementById('highestScore').textContent = '-';
    document.getElementById('scoreMessage').textContent = 'Scores are only available for student accounts.';
  } else {
    // Student account - fetch latest score from API
    try {
      const userId = currentUser.StudentID;
      const user = await findUserById(userId);
      
      if (user && user.StudentScoreGame4 !== undefined) {
        const score = user.StudentScoreGame4;
        document.getElementById('highestScore').textContent = score;
        
        if (score === 0) {
          document.getElementById('scoreMessage').textContent = 'Play the game to set your first score!';
        } else {
          document.getElementById('scoreMessage').textContent = 'Keep playing to beat your high score!';
        }
      } else {
        document.getElementById('highestScore').textContent = '0';
        document.getElementById('scoreMessage').textContent = 'Unable to load your score.';
      }
    } catch (error) {
      console.error('Error loading score:', error);
      document.getElementById('highestScore').textContent = '0';
      document.getElementById('scoreMessage').textContent = 'Error loading your score.';
    }
  }
  
  // Show the modal
  const modal = new bootstrap.Modal(document.getElementById('pastResultsModal'));
  modal.show();
}

// Show how to play instructions
function showHowToPlay() {
  const modal = new bootstrap.Modal(document.getElementById('howToPlayModal'));
  modal.show();
}

