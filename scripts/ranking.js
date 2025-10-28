// Ranking system for educational minigames
// Handles total score rankings and individual game rankings

// Game configuration
const GAME_CONFIG = {
  1: { name: 'Algebra', color: 'primary' },
  2: { name: 'Science', color: 'success' },
  3: { name: 'Coding', color: 'info' },
  4: { name: 'Logic', color: 'warning' },
  5: { name: 'Geometry', color: 'danger' }
};

// Current ranking type
let currentRankingType = 'total'; // 'total' or game number (1-5)
let allStudents = [];

// DOM elements
let totalRankingsBtn;
let gameButtons;
let rankingTitle;
let rankingSubtitle;
let loadingSpinner;
let errorMessage;
let rankingsTable;
let noDataMessage;
let rankingsBody;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeElements();
  setupEventListeners();
  loadRankings('total');
});

// Initialize DOM elements
function initializeElements() {
  totalRankingsBtn = document.getElementById('totalRankingsBtn');
  gameButtons = {
    1: document.getElementById('game1Btn'),
    2: document.getElementById('game2Btn'),
    3: document.getElementById('game3Btn'),
    4: document.getElementById('game4Btn'),
    5: document.getElementById('game5Btn')
  };
  rankingTitle = document.getElementById('rankingTitle');
  rankingSubtitle = document.getElementById('rankingSubtitle');
  loadingSpinner = document.getElementById('loadingSpinner');
  errorMessage = document.getElementById('errorMessage');
  rankingsTable = document.getElementById('rankingsTable');
  noDataMessage = document.getElementById('noDataMessage');
  rankingsBody = document.getElementById('rankingsBody');
}

// Setup event listeners
function setupEventListeners() {
  // Total rankings button
  totalRankingsBtn.addEventListener('click', () => {
    loadRankings('total');
    updateButtonStates('total');
  });

  // Individual game buttons
  Object.keys(gameButtons).forEach(gameNum => {
    gameButtons[gameNum].addEventListener('click', () => {
      loadRankings(parseInt(gameNum));
      updateButtonStates(parseInt(gameNum));
    });
  });
}

// Update button states
function updateButtonStates(activeType) {
  // Reset all buttons
  totalRankingsBtn.className = 'btn btn-outline-primary';
  Object.values(gameButtons).forEach(btn => {
    btn.className = 'btn btn-outline-primary';
  });

  // Set active button
  if (activeType === 'total') {
    totalRankingsBtn.className = 'btn btn-primary';
  } else {
    gameButtons[activeType].className = 'btn btn-primary';
  }
}

// Load rankings based on type
async function loadRankings(type) {
  currentRankingType = type;
  showLoading();

  try {
    if (type === 'total') {
      await loadTotalRankings();
    } else {
      await loadGameRankings(type);
    }
  } catch (error) {
    console.error('Error loading rankings:', error);
    showError('Failed to load rankings. Please try again.');
  }
}

// Load total score rankings
async function loadTotalRankings() {
  try {
    // Fetch all students
    const response = await fetch(`${window.API_URL}/profile/students`);
    if (!response.ok) {
      throw new Error('Failed to fetch students');
    }
    
    allStudents = await response.json();
    
    // Calculate total scores and sort
    const rankings = calculateTotalRankings(allStudents);
    
    // Update UI
    updateRankingTitle('Total Score Rankings', 'Top 10 students by combined score across all games');
    displayRankings(rankings, 'total');
    
  } catch (error) {
    console.error('Error loading total rankings:', error);
    throw error;
  }
}

// Load individual game rankings
async function loadGameRankings(gameNumber) {
  try {
    // Fetch rankings for specific game
    const response = await fetch(`${window.API_URL}/score/rankings/${gameNumber}`);
    if (!response.ok) {
      throw new Error('Failed to fetch game rankings');
    }
    
    const rankings = await response.json();
    
    // Update UI
    const gameName = GAME_CONFIG[gameNumber].name;
    updateRankingTitle(`${gameName} Rankings`, `Top 5 students in ${gameName}`);
    displayRankings(rankings, gameNumber);
    
  } catch (error) {
    console.error('Error loading game rankings:', error);
    throw error;
  }
}

// Calculate total score rankings
function calculateTotalRankings(students) {
  // Calculate total score for each student
  const studentsWithTotal = students.map(student => {
    const totalScore = (student.scoreGame1 || 0) + 
                      (student.scoreGame2 || 0) + 
                      (student.scoreGame3 || 0) + 
                      (student.scoreGame4 || 0) + 
                      (student.scoreGame5 || 0);
    
    const gamesPlayed = [student.scoreGame1, student.scoreGame2, student.scoreGame3, 
                        student.scoreGame4, student.scoreGame5].filter(score => score > 0).length;
    
    return {
      ...student,
      totalScore,
      gamesPlayed
    };
  });

  // Sort by total score (descending), then by name (ascending) for ties
  return studentsWithTotal
    .sort((a, b) => {
      if (b.totalScore !== a.totalScore) {
        return b.totalScore - a.totalScore;
      }
      return a.name.localeCompare(b.name);
    })
    .slice(0, 10); // Top 10
}

// Update ranking title and subtitle
function updateRankingTitle(title, subtitle) {
  rankingTitle.textContent = title;
  rankingSubtitle.textContent = subtitle;
}

// Display rankings in the table
function displayRankings(rankings, type) {
  hideAllElements();
  
  if (rankings.length === 0) {
    noDataMessage.style.display = 'block';
    return;
  }

  // Generate table rows
  const maxRankings = type === 'total' ? 10 : 5;
  const limitedRankings = rankings.slice(0, maxRankings);
  
  rankingsBody.innerHTML = limitedRankings.map((student, index) => {
    const rank = index + 1;
    const score = type === 'total' ? student.totalScore : getGameScore(student, type);
    const gamesPlayed = type === 'total' ? student.gamesPlayed : (score > 0 ? 1 : 0);
    
    return `
      <tr>
        <td>
          <span class="badge bg-${getRankBadgeClass(rank)} fs-6">${rank}</span>
        </td>
        <td>
          <strong>${student.name}</strong>
        </td>
        <td>
          <span class="badge bg-${GAME_CONFIG[type]?.color || 'primary'} fs-6">${score}</span>
        </td>
        <td>
          <span class="text-muted">${gamesPlayed}</span>
        </td>
      </tr>
    `;
  }).join('');

  rankingsTable.style.display = 'block';
}

// Get score for specific game
function getGameScore(student, gameNumber) {
  switch (gameNumber) {
    case 1: return student.scoreGame1 || 0;
    case 2: return student.scoreGame2 || 0;
    case 3: return student.scoreGame3 || 0;
    case 4: return student.scoreGame4 || 0;
    case 5: return student.scoreGame5 || 0;
    default: return 0;
  }
}

// Get rank badge class
function getRankBadgeClass(rank) {
  if (rank === 1) return 'warning'; // Gold
  if (rank === 2) return 'secondary'; // Silver
  if (rank === 3) return 'danger'; // Bronze
  return 'dark';
}

// Show loading spinner
function showLoading() {
  hideAllElements();
  loadingSpinner.style.display = 'block';
}

// Show error message
function showError(message) {
  hideAllElements();
  document.getElementById('errorText').textContent = message;
  errorMessage.style.display = 'block';
}

// Hide all display elements
function hideAllElements() {
  loadingSpinner.style.display = 'none';
  errorMessage.style.display = 'none';
  rankingsTable.style.display = 'none';
  noDataMessage.style.display = 'none';
}
