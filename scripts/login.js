// Login page functionality
let currentUserType = 'student';

// Local storage keys
const USERS_KEY = 'bridgeEd_users';
const CURRENT_USER_KEY = 'bridgeEd_currentUser';

// Initialize users storage if not exists
function initUsersStorage() {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify([]));
  }
}

// Get all users
function getAllUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}

// Save users
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Add new user
function addUser(userData) {
  const users = getAllUsers();
  users.push(userData);
  saveUsers(users);
}

// Find user by ID and type
function findUser(userId, userType) {
  const users = getAllUsers();
  return users.find(user => user.userId === userId && user.userType === userType);
}

// Use global Auth functions directly - no need to redeclare them

// Update labels based on user type
function updateUserTypeLabels() {
  const loginIdLabel = document.getElementById('loginIdLabel');
  const signupIdLabel = document.getElementById('signupIdLabel');
  
  if (currentUserType === 'student') {
    loginIdLabel.textContent = 'Student ID';
    signupIdLabel.textContent = 'Student ID';
  } else {
    loginIdLabel.textContent = 'Teacher ID';
    signupIdLabel.textContent = 'Teacher ID';
  }
}

// Handle user type change
document.querySelectorAll('input[name="userType"]').forEach(radio => {
  radio.addEventListener('change', (e) => {
    currentUserType = e.target.value;
    updateUserTypeLabels();
  });
});

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const id = document.getElementById('loginId').value.trim();
  const password = document.getElementById('loginPassword').value;
  const messageDiv = document.getElementById('loginMessage');
  
  messageDiv.innerHTML = '<div class="alert alert-info">Logging in...</div>';
  
  try {
    // Call API to login
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: id,
        password: password,
        userType: currentUserType
      })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      // Login successful
      const userData = {
        type: result.userType,
        userId: result.userId,
        name: result.name,
        StudentID: result.userId,
        StudentName: result.name,
        TeacherID: result.userId,
        TeacherName: result.name,
        StudentScoreGame1: result.scoreGame1 || 0,
        StudentScoreGame2: result.scoreGame2 || 0,
        StudentScoreGame3: result.scoreGame3 || 0,
        StudentScoreGame4: result.scoreGame4 || 0,
        StudentScoreGame5: result.scoreGame5 || 0
      };
      window.Auth.setCurrentUser(userData);
      messageDiv.innerHTML = '<div class="alert alert-success">Login successful! Redirecting...</div>';
      setTimeout(() => {
        if (currentUserType === 'teacher') {
          window.location.href = './teacher-dashboard.html';
        } else {
          window.location.href = './profile.html';
        }
      }, 1000);
    } else {
      messageDiv.innerHTML = `<div class="alert alert-danger">${result.message || 'Login failed. Please check your credentials.'}</div>`;
    }
  } catch (error) {
    console.error('Login error:', error);
    messageDiv.innerHTML = '<div class="alert alert-danger">Unable to connect to server. Please make sure the API is running.</div>';
  }
});

// Handle signup form submission
document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('signupName').value.trim();
  const id = document.getElementById('signupId').value.trim();
  const password = document.getElementById('signupPassword').value;
  const messageDiv = document.getElementById('signupMessage');
  
  messageDiv.innerHTML = '<div class="alert alert-info">Creating account...</div>';
  
  if (!name || !id || !password) {
    messageDiv.innerHTML = '<div class="alert alert-danger">Please fill in all fields.</div>';
    return;
  }
  
  try {
    // Call API to register
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: id,
        name: name,
        password: password,
        userType: currentUserType
      })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      // Registration successful
      const userData = {
        type: result.userType,
        userId: result.userId,
        name: result.name,
        StudentID: result.userId,
        StudentName: result.name,
        TeacherID: result.userId,
        TeacherName: result.name,
        StudentScoreGame1: result.scoreGame1 || 0,
        StudentScoreGame2: result.scoreGame2 || 0,
        StudentScoreGame3: result.scoreGame3 || 0,
        StudentScoreGame4: result.scoreGame4 || 0,
        StudentScoreGame5: result.scoreGame5 || 0
      };
      
      window.Auth.setCurrentUser(userData);
      messageDiv.innerHTML = '<div class="alert alert-success">Account created successfully! Redirecting...</div>';
      setTimeout(() => {
        if (currentUserType === 'teacher') {
          window.location.href = './teacher-dashboard.html';
        } else {
          window.location.href = './profile.html';
        }
      }, 1000);
    } else {
      messageDiv.innerHTML = `<div class="alert alert-danger">${result.message || 'Registration failed.'}</div>`;
    }
  } catch (error) {
    console.error('Registration error:', error);
    messageDiv.innerHTML = '<div class="alert alert-danger">Unable to connect to server. Please make sure the API is running.</div>';
  }
});

// Initialize storage and labels
initUsersStorage();
updateUserTypeLabels();

// Password reset functionality
let resetUserType = 'student';

// Update reset form labels based on user type
function updateResetUserTypeLabels() {
  const resetUserIdLabel = document.getElementById('resetUserIdLabel');
  
  if (resetUserType === 'student') {
    resetUserIdLabel.textContent = 'Student ID';
  } else {
    resetUserIdLabel.textContent = 'Teacher ID';
  }
}

// Handle reset user type change
document.addEventListener('DOMContentLoaded', () => {
  // Handle reset form user type changes
  document.querySelectorAll('input[name="resetUserType"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      resetUserType = e.target.value;
      updateResetUserTypeLabels();
    });
  });
});

// Handle password reset form submission
document.addEventListener('DOMContentLoaded', () => {
  const resetForm = document.getElementById('resetPasswordForm');
  if (resetForm) {
    resetForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const userId = document.getElementById('resetUserId').value.trim();
      const newPassword = document.getElementById('resetNewPassword').value;
      const confirmPassword = document.getElementById('resetConfirmPassword').value;
      const messageDiv = document.getElementById('resetPasswordMessage');
      
      // Validate inputs
      if (!userId || !newPassword || !confirmPassword) {
        messageDiv.innerHTML = '<div class="alert alert-danger">All fields are required.</div>';
        return;
      }
      
      if (newPassword !== confirmPassword) {
        messageDiv.innerHTML = '<div class="alert alert-danger">Passwords do not match.</div>';
        return;
      }
      
      if (newPassword.length < 6) {
        messageDiv.innerHTML = '<div class="alert alert-danger">Password must be at least 6 characters long.</div>';
        return;
      }
      
      messageDiv.innerHTML = '<div class="alert alert-info">Resetting password...</div>';
      
      try {
        const response = await fetch('http://localhost:5000/api/auth/reset-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: userId,
            newPassword: newPassword,
            userType: resetUserType
          })
        });
        
        const result = await response.json();
        
        if (response.ok) {
          messageDiv.innerHTML = '<div class="alert alert-success">Password reset successfully! You can now login with your new password.</div>';
          
          // Clear form and close modal after 2 seconds
          setTimeout(() => {
            document.getElementById('resetPasswordForm').reset();
            const modal = bootstrap.Modal.getInstance(document.getElementById('resetPasswordModal'));
            modal.hide();
            messageDiv.innerHTML = '';
          }, 2000);
        } else {
          messageDiv.innerHTML = `<div class="alert alert-danger">${result.message || 'Password reset failed.'}</div>`;
        }
      } catch (error) {
        console.error('Error resetting password:', error);
        messageDiv.innerHTML = '<div class="alert alert-danger">Unable to connect to server. Please try again later.</div>';
      }
    });
  }
});

// Check if already logged in - automatically redirect
if (window.Auth.isLoggedIn()) {
  const user = window.Auth.getCurrentUser();
  if (user && user.type === 'teacher') {
    window.location.href = './teacher-dashboard.html';
  } else {
    window.location.href = './profile.html';
  }
}

