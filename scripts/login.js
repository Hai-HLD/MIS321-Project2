// Login page functionality
let currentUserType = 'student';

// Update labels based on user type
function updateUserTypeLabels() {
  const loginIdLabel = document.getElementById('loginIdLabel');
  const signupIdLabel = document.getElementById('signupIdLabel');
  const classIdField = document.getElementById('classIdField');
  const signupClassId = document.getElementById('signupClassId');
  const signupForm = document.getElementById('signupForm');
  const signupCard = signupForm ? signupForm.closest('.col-md-6') : null;
  const loginForm = document.getElementById('loginForm');
  // Find the login card container regardless of its current class
  const loginCard = loginForm ? loginForm.parentElement.parentElement : null;
  
  // Find the "Forgot Password" link
  const forgotPasswordLink = document.querySelector('a[data-bs-target="#resetPasswordModal"]');
  
  console.log('Current user type:', currentUserType);
  console.log('Login card element:', loginCard);
  console.log('Signup card element:', signupCard);
  
  if (currentUserType === 'student') {
    loginIdLabel.textContent = 'Student ID';
    signupIdLabel.textContent = 'Student ID';
    classIdField.style.display = 'block';
    signupClassId.required = true;
    // Show signup form for students
    if (signupCard) signupCard.style.display = 'block';
    if (loginCard) {
      loginCard.classList.remove('col-md-12');
      loginCard.classList.add('col-md-6');
      console.log('Set login card to col-md-6 for student');
    }
    // Show forgot password link for students
    if (forgotPasswordLink) forgotPasswordLink.style.display = 'block';
  } else if (currentUserType === 'teacher') {
    loginIdLabel.textContent = 'Teacher ID';
    signupIdLabel.textContent = 'Teacher ID';
    classIdField.style.display = 'none';
    signupClassId.required = false;
    // Show signup form for teachers
    if (signupCard) signupCard.style.display = 'block';
    if (loginCard) {
      loginCard.classList.remove('col-md-12');
      loginCard.classList.add('col-md-6');
      console.log('Set login card to col-md-6 for teacher');
    }
    // Show forgot password link for teachers
    if (forgotPasswordLink) forgotPasswordLink.style.display = 'block';
  } else if (currentUserType === 'admin') {
    loginIdLabel.textContent = 'Admin ID';
    signupIdLabel.textContent = 'Admin ID';
    classIdField.style.display = 'none';
    signupClassId.required = false;
    // Hide signup form for admins (no account creation)
    if (signupCard) signupCard.style.display = 'none';
    // Make login form full width for admin
    if (loginCard) {
      loginCard.classList.remove('col-md-6');
      loginCard.classList.add('col-md-12');
      console.log('Set login card to col-md-12 for admin');
    }
    // Hide forgot password link for admins (hardcoded credentials)
    if (forgotPasswordLink) forgotPasswordLink.style.display = 'none';
  }
}

// Initialize currentUserType from the checked radio button
function initializeUserType() {
  const checkedRadio = document.querySelector('input[name="userType"]:checked');
  if (checkedRadio) {
    currentUserType = checkedRadio.value;
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
    // Check for hardcoded admin credentials first
    if (currentUserType === 'admin') {
      if (id === 'admin' && password === 'admin123') {
        // Hardcoded admin login successful
        const userData = {
          type: 'admin',
          userId: 'admin',
          name: 'Administrator',
          AdminID: 'admin',
          AdminName: 'Administrator'
        };
        
        window.Auth.setCurrentUser(userData);
        
        messageDiv.innerHTML = '<div class="alert alert-success">Admin login successful! Redirecting...</div>';
        setTimeout(() => {
          window.location.href = './admin.html';
        }, 1000);
        return;
      } else {
        messageDiv.innerHTML = '<div class="alert alert-danger">Invalid admin credentials.</div>';
        return;
      }
    }
    
    // Call API to login for student/teacher
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
        StudentScoreGame1: result.scoreGame1 || 0,
        StudentScoreGame2: result.scoreGame2 || 0,
        StudentScoreGame3: result.scoreGame3 || 0,
        StudentScoreGame4: result.scoreGame4 || 0,
        StudentScoreGame5: result.scoreGame5 || 0
      };
      
      // Add type-specific fields
      if (result.userType === 'student') {
        userData.StudentID = result.userId;
        userData.StudentName = result.name;
      } else if (result.userType === 'teacher') {
        userData.TeacherID = result.userId;
        userData.TeacherName = result.name;
      }
      
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
  const classId = currentUserType === 'student' ? document.getElementById('signupClassId').value.trim() : null;
  const messageDiv = document.getElementById('signupMessage');
  
  messageDiv.innerHTML = '<div class="alert alert-info">Creating account...</div>';
  
  if (!name || !id || !password) {
    messageDiv.innerHTML = '<div class="alert alert-danger">Please fill in all fields.</div>';
    return;
  }
  
  // Prevent admin registration
  if (currentUserType === 'admin') {
    messageDiv.innerHTML = '<div class="alert alert-danger">Admin accounts cannot be registered through this form.</div>';
    return;
  }
  
  if (currentUserType === 'student' && !classId) {
    messageDiv.innerHTML = '<div class="alert alert-danger">Class ID is required for student registration.</div>';
    return;
  }
  
  if (currentUserType === 'student' && classId && !/^\d{8}$/.test(classId)) {
    messageDiv.innerHTML = '<div class="alert alert-danger">Class ID must be exactly 8 digits.</div>';
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
        userType: currentUserType,
        classID: classId
      })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      // Registration successful
      const userData = {
        type: result.userType,
        userId: result.userId,
        name: result.name,
        StudentScoreGame1: result.scoreGame1 || 0,
        StudentScoreGame2: result.scoreGame2 || 0,
        StudentScoreGame3: result.scoreGame3 || 0,
        StudentScoreGame4: result.scoreGame4 || 0,
        StudentScoreGame5: result.scoreGame5 || 0
      };
      
      // Add type-specific fields
      if (result.userType === 'student') {
        userData.StudentID = result.userId;
        userData.StudentName = result.name;
      } else if (result.userType === 'teacher') {
        userData.TeacherID = result.userId;
        userData.TeacherName = result.name;
      }
      
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
    messageDiv.innerHTML = '<div class="alert alert-danger">Registration failed. Please try again.</div>';
  }
});

// Initialize labels
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

// Initialize labels on page load
document.addEventListener('DOMContentLoaded', function() {
  initializeUserType();
  updateUserTypeLabels();
});

// Also initialize immediately in case DOMContentLoaded already fired
initializeUserType();
updateUserTypeLabels();

// Check if already logged in - automatically redirect
if (window.Auth.isLoggedIn()) {
  const user = window.Auth.getCurrentUser();
  if (user && user.type === 'teacher') {
    window.location.href = './teacher-dashboard.html';
  } else if (user && user.type === 'admin') {
    window.location.href = './admin.html';
  } else {
    window.location.href = './profile.html';
  }
}

