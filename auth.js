// Toggle between login and signup forms
function toggleForms() {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  
  loginForm.classList.toggle('active');
  signupForm.classList.toggle('active');
  
  // Clear any messages when switching
  clearMessages();
}

// Show error message
function showError(message) {
  const errorDiv = document.getElementById('errorMessage');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
  
  const successDiv = document.getElementById('successMessage');
  successDiv.style.display = 'none';
}

// Show success message
function showSuccess(message) {
  const successDiv = document.getElementById('successMessage');
  successDiv.textContent = message;
  successDiv.style.display = 'block';
  
  const errorDiv = document.getElementById('errorMessage');
  errorDiv.style.display = 'none';
}

// Clear all messages
function clearMessages() {
  document.getElementById('errorMessage').style.display = 'none';
  document.getElementById('successMessage').style.display = 'none';
}

// Get all users from localStorage
function getAllUsers() {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
}

// Save users to localStorage
function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

// Get current logged-in user
function getCurrentUser() {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
}

// Set logged-in user
function setCurrentUser(user) {
  localStorage.setItem('currentUser', JSON.stringify(user));
}

// Login form handler
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  clearMessages();
  
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;
  
  if (!username || !password) {
    showError('Please fill in all fields');
    return;
  }
  
  const users = getAllUsers();
  const user = users.find(u => u.username === username);
  
  if (!user) {
    showError('Username not found');
    return;
  }
  
  // Simple password check (in production, this should be hashed)
  if (user.password !== password) {
    showError('Incorrect password');
    return;
  }
  
  // Login successful
  setCurrentUser({
    userId: user.userId,
    username: user.username,
    email: user.email,
    fullName: user.fullName,
    userType: user.userType
  });
  
  showSuccess('Login successful! Redirecting...');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1000);
});

// Signup form handler
document.getElementById('signupForm').addEventListener('submit', function(e) {
  e.preventDefault();
  clearMessages();
  
  const username = document.getElementById('signupUsername').value.trim();
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('signupConfirmPassword').value;
  const email = document.getElementById('signupEmail').value.trim();
  const fullName = document.getElementById('signupFullName').value.trim();
  const phone = document.getElementById('signupPhone').value.trim();
  const userType = document.getElementById('signupUserType').value;
  
  // Validation
  if (!username || !password || !confirmPassword || !email || !fullName || !phone || !userType) {
    showError('Please fill in all fields');
    return;
  }
  
  if (username.length < 3) {
    showError('Username must be at least 3 characters');
    return;
  }
  
  if (password.length < 6) {
    showError('Password must be at least 6 characters');
    return;
  }
  
  if (password !== confirmPassword) {
    showError('Passwords do not match');
    return;
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showError('Please enter a valid email');
    return;
  }
  
  const users = getAllUsers();
  
  // Check if username or email already exists
  if (users.some(u => u.username === username)) {
    showError('Username already taken');
    return;
  }
  
  if (users.some(u => u.email === email)) {
    showError('Email already registered');
    return;
  }
  
  // Create new user
  const newUser = {
    userId: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    username: username,
    password: password, // In production, this should be hashed
    email: email,
    fullName: fullName,
    phone: phone,
    userType: userType,
    profilePictureUrl: null,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  saveUsers(users);
  
  // Auto-login
  setCurrentUser({
    userId: newUser.userId,
    username: newUser.username,
    email: newUser.email,
    fullName: newUser.fullName,
    userType: newUser.userType
  });
  
  showSuccess('Account created successfully! Redirecting...');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1000);
});

// Check authentication on page load
window.addEventListener('DOMContentLoaded', function() {
  const currentUser = getCurrentUser();
  if (currentUser) {
    // User already logged in, redirect to home
    window.location.href = 'index.html';
  }
});
