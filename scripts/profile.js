// Profile page functionality

// Display current user's profile
async function displayCurrentUserProfile() {
  const profileDisplay = document.getElementById('profileDisplay');
  const profileDisplayBody = document.getElementById('profileDisplayBody');
  const notLoggedInMessage = document.getElementById('notLoggedInMessage');
  
  // Check if user is logged in
  if (!window.Auth.isLoggedIn()) {
    profileDisplay.style.display = 'none';
    profileDisplayBody.style.display = 'none';
    notLoggedInMessage.style.display = 'block';
    return;
  }
  
  // Check if we're viewing another user's profile (from teacher dashboard)
  const urlParams = new URLSearchParams(window.location.search);
  const targetUserId = urlParams.get('userId');
  
  let currentUser = window.Auth.getCurrentUser();
  
  // If viewing another user's profile, fetch their data
  if (targetUserId && currentUser.type === 'teacher') {
    try {
      const targetUser = await window.Auth.findUserById(targetUserId);
      if (targetUser) {
        currentUser = targetUser; // Use target user's data for display
        // Update page title to show it's viewing another user
        document.title = `${targetUser.name}'s Profile - BridgeEd`;
        const profileTitle = document.getElementById('profileTitle');
        if (profileTitle) {
          profileTitle.innerHTML = `<span class="text-gradient-stem">Student Profile</span>`;
        }
      }
    } catch (error) {
      console.error('Error fetching target user:', error);
      notLoggedInMessage.style.display = 'block';
      notLoggedInMessage.innerHTML = `
        <div class="alert alert-danger">
          <h4 class="alert-heading">Error</h4>
          <p>Could not load the requested user's profile.</p>
          <hr>
          <a href="./teacher-dashboard.html" class="btn btn-primary">Back to Dashboard</a>
        </div>
      `;
      profileDisplay.style.display = 'none';
      profileDisplayBody.style.display = 'none';
      return;
    }
  }
  
  // Only students have profiles for now (unless teacher is viewing student profile)
  if (currentUser.type !== 'student' && !targetUserId) {
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
    
    // Show class information (only for students)
    const classInfoSection = document.getElementById('classInfoSection');
    if (currentUser.type === 'student') {
      updateClassInfo(user);
      if (classInfoSection) classInfoSection.style.display = 'block';
    } else {
      if (classInfoSection) classInfoSection.style.display = 'none';
    }
    
    // Show profile sections
    profileDisplay.style.display = 'block';
    profileDisplayBody.style.display = 'block';
  } catch (error) {
    console.error('Error displaying profile:', error);
    profileDisplay.style.display = 'none';
    profileDisplayBody.style.display = 'none';
    notLoggedInMessage.style.display = 'block';
    notLoggedInMessage.innerHTML = `
      <h5 class="alert-heading">Error</h5>
      <p>Unable to load your profile. Please check your connection and try again.</p>
      <button onclick="location.reload()" class="btn btn-primary">Retry</button>
    `;
  }
}

// Update class information display
function updateClassInfo(user) {
  const currentClassInfo = document.getElementById('currentClassInfo');
  const joinClassForm = document.getElementById('joinClassForm');
  const currentClassIdSpan = document.getElementById('currentClassId');
  
  // Handle both camelCase and PascalCase property names
  const classId = user.classId || user.ClassId;
  
  if (classId) {
    // Student is in a class
    currentClassIdSpan.textContent = classId;
    currentClassInfo.style.display = 'block';
    joinClassForm.style.display = 'none';
  } else {
    // Student is not in a class - show join form
    currentClassInfo.style.display = 'none';
    joinClassForm.style.display = 'block';
  }
}

// Join class function (called from HTML onclick)
async function joinClass() {
  const classCodeInput = document.getElementById('classCodeInput');
  const joinClassMessage = document.getElementById('joinClassMessage');
  const classCode = classCodeInput.value.trim();
  
  // Validate class code
  if (!classCode) {
    joinClassMessage.innerHTML = '<div class="alert alert-warning">Please enter a class code.</div>';
    return;
  }
  
  if (!/^\d{8}$/.test(classCode)) {
    joinClassMessage.innerHTML = '<div class="alert alert-warning">Class code must be exactly 8 digits.</div>';
    return;
  }
  
  const currentUser = window.Auth.getCurrentUser();
  if (!currentUser || currentUser.type !== 'student') {
    joinClassMessage.innerHTML = '<div class="alert alert-danger">You must be logged in as a student to join a class.</div>';
    return;
  }
  
  // Disable button and show loading
  const joinButton = document.querySelector('#joinClassForm button');
  const originalButtonText = joinButton ? joinButton.innerHTML : '';
  if (joinButton) {
    joinButton.disabled = true;
    joinButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Joining...';
  }
  
  joinClassMessage.innerHTML = '';
  
  try {
    const result = await window.Auth.joinClass(currentUser.userId, classCode);
    
    if (result.success) {
      joinClassMessage.innerHTML = `<div class="alert alert-success">${result.data.message}</div>`;
      classCodeInput.value = '';
      
      // Refresh profile to show updated class info
      setTimeout(() => {
        displayCurrentUserProfile();
      }, 1000);
    } else {
      joinClassMessage.innerHTML = `<div class="alert alert-danger">${result.data.message || 'Failed to join class. Please try again.'}</div>`;
    }
  } catch (error) {
    console.error('Error joining class:', error);
    joinClassMessage.innerHTML = '<div class="alert alert-danger">An error occurred. Please try again.</div>';
  } finally {
    // Re-enable button
    if (joinButton) {
      joinButton.disabled = false;
      joinButton.innerHTML = originalButtonText;
    }
  }
}

// Make joinClass globally available
window.joinClass = joinClass;

// Load profile on page load
document.addEventListener('DOMContentLoaded', () => {
  // Debug: Check if profile title exists
  const profileTitle = document.getElementById('profileTitle');
  console.log('Profile title element:', profileTitle);
  if (profileTitle) {
    console.log('Profile title text:', profileTitle.textContent);
  }
  
  displayCurrentUserProfile();
  
  // Add Enter key support for class code input
  const classCodeInput = document.getElementById('classCodeInput');
  if (classCodeInput) {
    classCodeInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        joinClass();
      }
    });
  }
});

