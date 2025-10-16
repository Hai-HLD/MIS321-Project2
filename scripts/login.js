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
    
    // Show/hide class code fields based on user type
    const classCodeField = document.getElementById('classCodeField');
    const teacherClassCodeField = document.getElementById('teacherClassCodeField');
    const classCodeLabel = document.getElementById('classCodeLabel');
    const classCodeHelp = document.getElementById('classCodeHelp');
    
    if (e.target.value === 'student') {
      // Show student class code field
      if (classCodeField) {
        classCodeField.style.display = 'block';
        classCodeField.querySelector('#classCode').required = true;
      }
      if (teacherClassCodeField) {
        teacherClassCodeField.style.display = 'none';
        teacherClassCodeField.querySelector('#teacherClassCode').required = false;
      }
    } else if (e.target.value === 'teacher') {
      // Show teacher class code field
      if (classCodeField) {
        classCodeField.style.display = 'none';
        classCodeField.querySelector('#classCode').required = false;
      }
      if (teacherClassCodeField) {
        teacherClassCodeField.style.display = 'block';
        teacherClassCodeField.querySelector('#teacherClassCode').required = true;
      }
    }
  });
});

// Initialize class code field visibility on page load
document.addEventListener('DOMContentLoaded', () => {
  const classCodeField = document.getElementById('classCodeField');
  const teacherClassCodeField = document.getElementById('teacherClassCodeField');
  const studentRadio = document.getElementById('studentType');
  const teacherRadio = document.getElementById('teacherType');
  
  if (studentRadio && studentRadio.checked) {
    // Show student class code field
    if (classCodeField) {
      classCodeField.style.display = 'block';
      classCodeField.querySelector('#classCode').required = true;
    }
    if (teacherClassCodeField) {
      teacherClassCodeField.style.display = 'none';
      teacherClassCodeField.querySelector('#teacherClassCode').required = false;
    }
  } else if (teacherRadio && teacherRadio.checked) {
    // Show teacher class code field
    if (classCodeField) {
      classCodeField.style.display = 'none';
      classCodeField.querySelector('#classCode').required = false;
    }
    if (teacherClassCodeField) {
      teacherClassCodeField.style.display = 'block';
      teacherClassCodeField.querySelector('#teacherClassCode').required = true;
    }
  }
});

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const id = document.getElementById('loginId').value.trim();
  const password = document.getElementById('loginPassword').value;
  const messageDiv = document.getElementById('loginMessage');
  
  messageDiv.innerHTML = '<div class="alert alert-info">Logging in...</div>';
  
  try {
    // Get all users from localStorage
    const allUsers = JSON.parse(localStorage.getItem('bridgeEd_users') || '[]');
    
    // Find user
    const user = allUsers.find(u => 
      u.userId === id && 
      u.password === password && 
      u.userType === currentUserType
    );
    
    if (!user) {
      messageDiv.innerHTML = '<div class="alert alert-danger">Invalid credentials. Please check your ID and password.</div>';
      return;
    }
    
    // Handle first login for teachers - generate class code
    if (user.userType === 'teacher' && user.firstLogin === true) {
      user.classCode = generateClassCode();
      user.firstLogin = false;
      
      // Update user in localStorage
      const userIndex = allUsers.findIndex(u => u.userId === id);
      allUsers[userIndex] = user;
      localStorage.setItem('bridgeEd_users', JSON.stringify(allUsers));
      
      // Show class code to teacher
      messageDiv.innerHTML = `
        <div class="alert alert-success">
          <strong>Welcome, ${user.name}!</strong><br>
          Your class code is: <strong>${user.classCode}</strong><br>
          Share this code with your students so they can join your class.
        </div>
      `;
    } else {
      messageDiv.innerHTML = '<div class="alert alert-success">Login successful! Redirecting...</div>';
    }
    
    // Set current user
    const userData = {
      type: user.userType,
      userId: user.userId,
      name: user.name,
      StudentID: user.userId,
      StudentName: user.name,
      TeacherID: user.userId,
      TeacherName: user.name,
      StudentScoreGame1: user.StudentScoreGame1 || 0,
      StudentScoreGame2: user.StudentScoreGame2 || 0,
      StudentScoreGame3: user.StudentScoreGame3 || 0,
      StudentScoreGame4: user.StudentScoreGame4 || 0,
      StudentScoreGame5: user.StudentScoreGame5 || 0
    };
    
    localStorage.setItem('bridgeEd_currentUser', JSON.stringify(userData));
    
    // Update last active
    user.lastActive = new Date().toISOString();
    const userIndex = allUsers.findIndex(u => u.userId === id);
    allUsers[userIndex] = user;
    localStorage.setItem('bridgeEd_users', JSON.stringify(allUsers));
    
    // Redirect after delay
      setTimeout(() => {
      if (user.userType === 'teacher') {
        console.log('Redirecting teacher to dashboard...');
        window.location.href = './teacher-dashboard.html';
      } else {
        console.log('Redirecting student to profile...');
        window.location.href = './profile.html';
    }
    }, user.userType === 'teacher' && user.firstLogin === true ? 5000 : 1000);
    
  } catch (error) {
    console.error('Login error:', error);
    messageDiv.innerHTML = '<div class="alert alert-danger">Login failed. Please try again.</div>';
  }
});

// Handle signup form submission
document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('signupName').value.trim();
  const id = document.getElementById('signupId').value.trim();
  const password = document.getElementById('signupPassword').value;
  const classCode = document.getElementById('classCode').value.trim();
  const teacherClassCode = document.getElementById('teacherClassCode').value.trim();
  const messageDiv = document.getElementById('signupMessage');
  
  messageDiv.innerHTML = '<div class="alert alert-info">Creating account...</div>';
  
  if (!name || !id || !password) {
    messageDiv.innerHTML = '<div class="alert alert-danger">Please fill in all fields.</div>';
    return;
  }
  
  // For students, class code is required
  if (currentUserType === 'student' && !classCode) {
    messageDiv.innerHTML = '<div class="alert alert-danger">Please enter a class code to join your teacher\'s class.</div>';
    return;
  }
  
  // For teachers, teacher class code is required
  if (currentUserType === 'teacher' && !teacherClassCode) {
    messageDiv.innerHTML = '<div class="alert alert-danger">Please create a class code for your students.</div>';
    return;
  }
  
  // Validate teacher class code is not empty
  if (currentUserType === 'teacher' && teacherClassCode && teacherClassCode.length === 0) {
    messageDiv.innerHTML = '<div class="alert alert-danger">Please enter a class code.</div>';
    return;
  }
  
  try {
    // Get existing users
    const allUsers = JSON.parse(localStorage.getItem('bridgeEd_users') || '[]');
    
    // Check if user ID already exists
    if (allUsers.find(user => user.userId === id)) {
      messageDiv.innerHTML = '<div class="alert alert-danger">User ID already exists. Please choose a different ID.</div>';
      return;
    }
    
    // For students, validate class code
    let teacherId = null;
    if (currentUserType === 'student' && classCode) {
      // Find teacher with matching class code
      const teacher = allUsers.find(user => 
        user.userType === 'teacher' && 
        user.classCode === classCode
      );
      
      if (!teacher) {
        messageDiv.innerHTML = '<div class="alert alert-danger">Invalid class code. Please check with your teacher.</div>';
        return;
      }
      
      teacherId = teacher.userId;
    }
    
    // Create new user
    const newUser = {
      userId: id,
      userType: currentUserType,
      name: name,
      password: password,
      email: `${id}@school.edu`,
      StudentScoreGame1: 0,
      StudentScoreGame2: 0,
      StudentScoreGame3: 0,
      StudentScoreGame4: 0,
      StudentScoreGame5: 0,
      lastActive: new Date().toISOString(),
      teacherId: teacherId, // Link student to teacher
      classCode: currentUserType === 'teacher' ? teacherClassCode : null, // Use teacher's chosen code
      firstLogin: false // No longer needed since teacher sets their own code
    };
    
    // Add to users array
    allUsers.push(newUser);
    localStorage.setItem('bridgeEd_users', JSON.stringify(allUsers));
    
    // Set current user
    const userData = {
      type: currentUserType,
      userId: id,
      name: name,
      StudentID: id,
      StudentName: name,
      TeacherID: id,
      TeacherName: name,
      StudentScoreGame1: 0,
      StudentScoreGame2: 0,
      StudentScoreGame3: 0,
      StudentScoreGame4: 0,
      StudentScoreGame5: 0
    };
    
    localStorage.setItem('bridgeEd_currentUser', JSON.stringify(userData));
    
    // Show success message
    if (currentUserType === 'teacher') {
      messageDiv.innerHTML = `
        <div class="alert alert-success">
          <strong>Account created successfully!</strong><br>
          Your class code is: <strong>${teacherClassCode}</strong><br>
          Share this code with your students so they can join your class.
        </div>
      `;
    } else {
      messageDiv.innerHTML = '<div class="alert alert-success">Account created successfully! You have joined your teacher\'s class.</div>';
    }
    
    // Redirect after a short delay
      setTimeout(() => {
      if (currentUserType === 'teacher') {
        window.location.href = './teacher-dashboard.html';
      } else {
        window.location.href = './profile.html';
    }
    }, 2000);
    
  } catch (error) {
    console.error('Registration error:', error);
    messageDiv.innerHTML = '<div class="alert alert-danger">Registration failed. Please try again.</div>';
  }
});

// Generate a random class code for teachers
function generateClassCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

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
        // Get all users from localStorage
        const allUsers = JSON.parse(localStorage.getItem('bridgeEd_users') || '[]');
        
        // Find the user
        const userIndex = allUsers.findIndex(user => 
          user.userId === userId && 
          user.userType === resetUserType
        );
        
        if (userIndex === -1) {
          messageDiv.innerHTML = '<div class="alert alert-danger">User not found. Please check your ID and user type.</div>';
          return;
        }
        
        // Update the user's password
        allUsers[userIndex].password = newPassword;
        allUsers[userIndex].lastActive = new Date().toISOString();
        
        // Save back to localStorage
        localStorage.setItem('bridgeEd_users', JSON.stringify(allUsers));
        
        messageDiv.innerHTML = '<div class="alert alert-success">Password reset successfully! You can now login with your new password.</div>';
        
        // Clear form and close modal after 2 seconds
        setTimeout(() => {
          document.getElementById('resetPasswordForm').reset();
          const modal = bootstrap.Modal.getInstance(document.getElementById('resetPasswordModal'));
          modal.hide();
          messageDiv.innerHTML = '';
        }, 2000);
        
      } catch (error) {
        console.error('Error resetting password:', error);
        messageDiv.innerHTML = '<div class="alert alert-danger">Password reset failed. Please try again.</div>';
      }
    });
  }
});

// Check if already logged in - automatically redirect
document.addEventListener('DOMContentLoaded', () => {
  const currentUser = JSON.parse(localStorage.getItem('bridgeEd_currentUser') || '{}');
  if (currentUser.userId && currentUser.type) {
    if (currentUser.type === 'teacher') {
      window.location.href = './teacher-dashboard.html';
    } else if (currentUser.type === 'student') {
  window.location.href = './profile.html';
}
  }
});

