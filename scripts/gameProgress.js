// Game Progress Tracking System
// This file handles saving and loading game progress for students

// Save game progress for a student
function saveGameProgress(gameId, score, level = null) {
  try {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('bridgeEd_currentUser') || '{}');
    
    if (!currentUser.userId || currentUser.userType !== 'student') {
      console.log('No student logged in, progress not saved');
      return false;
    }

    // Get all users
    const allUsers = JSON.parse(localStorage.getItem('bridgeEd_users') || '[]');
    
    // Find the current user in the users array
    const userIndex = allUsers.findIndex(user => 
      user.userId === currentUser.userId && user.userType === 'student'
    );
    
    if (userIndex === -1) {
      console.error('User not found in users array');
      return false;
    }

    // Update the user's game score
    const gameScoreField = `StudentScoreGame${gameId}`;
    const gameDateField = `game${gameId}Date`;
    
    allUsers[userIndex][gameScoreField] = Math.max(
      allUsers[userIndex][gameScoreField] || 0, 
      score
    );
    allUsers[userIndex][gameDateField] = new Date().toISOString();
    allUsers[userIndex].lastActive = new Date().toISOString();

    // Save back to localStorage
    localStorage.setItem('bridgeEd_users', JSON.stringify(allUsers));
    
    // Update current user data
    currentUser[gameScoreField] = allUsers[userIndex][gameScoreField];
    currentUser[gameDateField] = allUsers[userIndex][gameDateField];
    currentUser.lastActive = allUsers[userIndex].lastActive;
    localStorage.setItem('bridgeEd_currentUser', JSON.stringify(currentUser));
    
    console.log(`Game ${gameId} progress saved: ${score} points`);
    return true;
    
  } catch (error) {
    console.error('Error saving game progress:', error);
    return false;
  }
}

// Get game progress for current student
function getGameProgress(gameId) {
  try {
    const currentUser = JSON.parse(localStorage.getItem('bridgeEd_currentUser') || '{}');
    const gameScoreField = `StudentScoreGame${gameId}`;
    return currentUser[gameScoreField] || 0;
  } catch (error) {
    console.error('Error getting game progress:', error);
    return 0;
  }
}

// Get all game progress for current student
function getAllGameProgress() {
  try {
    const currentUser = JSON.parse(localStorage.getItem('bridgeEd_currentUser') || '{}');
    return {
      game1: currentUser.StudentScoreGame1 || 0,
      game2: currentUser.StudentScoreGame2 || 0,
      game3: currentUser.StudentScoreGame3 || 0,
      game4: currentUser.StudentScoreGame4 || 0,
      game5: currentUser.StudentScoreGame5 || 0
    };
  } catch (error) {
    console.error('Error getting all game progress:', error);
    return { game1: 0, game2: 0, game3: 0, game4: 0, game5: 0 };
  }
}

// Check if student is logged in
function isStudentLoggedIn() {
  try {
    const currentUser = JSON.parse(localStorage.getItem('bridgeEd_currentUser') || '{}');
    return currentUser.userType === 'student' && currentUser.userId;
  } catch (error) {
    return false;
  }
}

// Get student's total progress
function getStudentTotalProgress() {
  try {
    const progress = getAllGameProgress();
    const scores = Object.values(progress);
    const completedGames = scores.filter(score => score > 0);
    
    return {
      totalGames: 5,
      completedGames: completedGames.length,
      averageScore: completedGames.length > 0 ? 
        Math.round(completedGames.reduce((sum, score) => sum + score, 0) / completedGames.length) : 0,
      totalScore: scores.reduce((sum, score) => sum + score, 0)
    };
  } catch (error) {
    console.error('Error getting student total progress:', error);
    return { totalGames: 5, completedGames: 0, averageScore: 0, totalScore: 0 };
  }
}

// Make functions globally available
window.GameProgress = {
  saveGameProgress,
  getGameProgress,
  getAllGameProgress,
  isStudentLoggedIn,
  getStudentTotalProgress
};
