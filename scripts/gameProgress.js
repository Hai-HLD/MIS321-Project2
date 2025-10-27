// Game Progress Tracking System
// This file handles saving and loading game progress for students via API

// Save game progress for a student
async function saveGameProgress(gameId, score, level = null) {
  try {
    // Get current user from sessionStorage
    const currentUser = window.Auth.getCurrentUser();
    
    if (!currentUser || !currentUser.userId) {
      console.error('Cannot save score: No user data available');
      return false;
    }

    // Call API to update score
    const requestData = {
      GameNumber: gameId,
      Score: score
    };
    
    const response = await fetch(`${window.API_URL}/score/${currentUser.userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });
    
    if (response.ok) {
      const responseData = await response.json();
      return true; // Always return true for successful API call, regardless of whether score was updated
    } else {
      const errorData = await response.json();
      console.error('Failed to save game progress to API:', response.status, errorData);
      return false;
    }
  } catch (error) {
    console.error('Error saving game progress:', error);
    return false;
  }
}

// Get game progress for current student
async function getGameProgress(gameId) {
  try {
    const currentUser = window.Auth.getCurrentUser();
    
    if (!currentUser || !currentUser.userId) {
      return 0;
    }

    // Get user profile from API
    const userProfile = await window.Auth.findUserById(currentUser.userId);
    if (userProfile) {
      const gameScoreField = `scoreGame${gameId}`;
      return userProfile[gameScoreField] || 0;
    }
    
    return 0;
  } catch (error) {
    console.error('Error getting game progress:', error);
    return 0;
  }
}

// Get all game progress for current student
async function getAllGameProgress() {
  try {
    const currentUser = window.Auth.getCurrentUser();
    
    if (!currentUser || !currentUser.userId) {
      return { game1: 0, game2: 0, game3: 0, game4: 0, game5: 0 };
    }

    // Get user profile from API
    const userProfile = await window.Auth.findUserById(currentUser.userId);
    if (userProfile) {
      return {
        game1: userProfile.scoreGame1 || 0,
        game2: userProfile.scoreGame2 || 0,
        game3: userProfile.scoreGame3 || 0,
        game4: userProfile.scoreGame4 || 0,
        game5: userProfile.scoreGame5 || 0
      };
    }
    
    return { game1: 0, game2: 0, game3: 0, game4: 0, game5: 0 };
  } catch (error) {
    console.error('Error getting all game progress:', error);
    return { game1: 0, game2: 0, game3: 0, game4: 0, game5: 0 };
  }
}

// Check if user is logged in
function isStudentLoggedIn() {
  try {
    const currentUser = window.Auth.getCurrentUser();
    return currentUser && currentUser.userId;
  } catch (error) {
    return false;
  }
}

// Get student's total progress
async function getStudentTotalProgress() {
  try {
    const progress = await getAllGameProgress();
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