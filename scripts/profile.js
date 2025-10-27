// Profile page functionality

// Display current user's profile
async function displayCurrentUserProfile() {
  const profileDisplay = document.getElementById('profileDisplay');
  const notLoggedInMessage = document.getElementById('notLoggedInMessage');
  
  // Check if user is logged in
  const currentUser = JSON.parse(localStorage.getItem('bridgeEd_currentUser') || '{}');
  if (!currentUser.userId) {
    profileDisplay.style.display = 'none';
    notLoggedInMessage.style.display = 'block';
    return;
  }
  
  // Only students have profiles for now
  if (currentUser.type !== 'student') {
    notLoggedInMessage.style.display = 'block';
    notLoggedInMessage.innerHTML = `
      <h5 class="alert-heading">Teacher Profile</h5>
      <p>Teacher features are coming soon!</p>
      <a href="./home.html" class="btn btn-primary">Go to Home</a>
    `;
    return;
  }
  
  try {
    // Fetch fresh data from API
    const userId = currentUser.userId;
    const user = await window.Auth.findUserById(userId);
    
    if (!user) {
      notLoggedInMessage.style.display = 'block';
      notLoggedInMessage.innerHTML = `
        <h5 class="alert-heading">Profile Not Found</h5>
        <p>Unable to load your profile. Please try logging in again.</p>
        <a href="./login.html" class="btn btn-primary">Go to Login</a>
      `;
      return;
    }
    
    // Hide error message
    notLoggedInMessage.style.display = 'none';
    
    // Get user details
    const name = user.name;
    const id = user.userId;
    const initial = name.charAt(0).toUpperCase();
    
    // Update profile display
    document.getElementById('userInitial').textContent = initial;
    document.getElementById('userName').textContent = name;
    document.getElementById('userId').textContent = id;
    
    // Show scores
    document.getElementById('score1').textContent = user.scoreGame1 || 0;
    document.getElementById('score2').textContent = user.scoreGame2 || 0;
    document.getElementById('score3').textContent = user.scoreGame3 || 0;
    document.getElementById('score4').textContent = user.scoreGame4 || 0;
    document.getElementById('score5').textContent = user.scoreGame5 || 0;
    
    // Show profile
    profileDisplay.style.display = 'block';
  } catch (error) {
    console.error('Error displaying profile:', error);
    profileDisplay.style.display = 'none';
    notLoggedInMessage.style.display = 'block';
    notLoggedInMessage.innerHTML = `
      <h5 class="alert-heading">Error</h5>
      <p>Unable to load your profile. Please check your connection and try again.</p>
      <button onclick="location.reload()" class="btn btn-primary">Retry</button>
    `;
  }
}

// Load profile on page load
document.addEventListener('DOMContentLoaded', () => {
  displayCurrentUserProfile();
});

