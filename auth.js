// AWS Cognito Authentication Handler
// This file handles login, signup, and session management

class CognitoAuth {
  constructor() {
    // These will be set after Amplify CLI sets up your Cognito
    this.userPool = null;
    this.initialized = false;
    this.init();
  }

  init() {
    // For now, we'll set up a mock implementation
    // After you run "amplify add auth", update these values
    const poolData = {
      UserPoolId: localStorage.getItem('userPoolId') || 'YOUR_USER_POOL_ID',
      ClientId: localStorage.getItem('clientId') || 'YOUR_CLIENT_ID'
    };

    if (poolData.UserPoolId !== 'YOUR_USER_POOL_ID') {
      this.userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
      this.initialized = true;
    }
  }

  async login(email, password) {
    return new Promise((resolve, reject) => {
      if (!this.initialized) {
        reject(new Error('Cognito not configured. Please set up Amazon Cognito first.'));
        return;
      }

      const authDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username: email,
        Password: password
      });

      const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
        Username: email,
        Pool: this.userPool
      });

      cognitoUser.authenticateUser(authDetails, {
        onSuccess: (result) => {
          const accessToken = result.getAccessToken().getJwtToken();
          const idToken = result.getIdToken().getJwtToken();
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('idToken', idToken);
          localStorage.setItem('userEmail', email);
          resolve({ success: true, user: email });
        },
        onFailure: (err) => {
          reject(new Error(err.message || 'Login failed'));
        }
      });
    });
  }

  async signup(email, password) {
    return new Promise((resolve, reject) => {
      if (!this.initialized) {
        reject(new Error('Cognito not configured. Please set up Amazon Cognito first.'));
        return;
      }

      this.userPool.signUp(email, password, [], null, (err, result) => {
        if (err) {
          reject(new Error(err.message || 'Signup failed'));
          return;
        }
        resolve({ success: true, userSub: result.userSub });
      });
    });
  }

  getCurrentUser() {
    return this.userPool?.getCurrentUser();
  }

  logout() {
    const cognitoUser = this.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.signOut();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('idToken');
      localStorage.removeItem('userEmail');
    }
  }

  isLoggedIn() {
    return !!localStorage.getItem('accessToken');
  }
}

// Initialize Cognito Auth
const auth = new CognitoAuth();

// Tab switching
document.querySelectorAll('.auth-tab').forEach(tab => {
  tab.addEventListener('click', (e) => {
    const tabName = e.target.dataset.tab;
    
    // Update active tab
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    e.target.classList.add('active');
    
    // Update active form
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    document.getElementById(tabName === 'login' ? 'loginForm' : 'signupForm').classList.add('active');
    
    // Clear messages
    clearMessage();
  });
});

// Helper functions
function showMessage(text, type) {
  const messageEl = document.getElementById('authMessage');
  messageEl.textContent = text;
  messageEl.className = `auth-message show ${type}`;
}

function clearMessage() {
  const messageEl = document.getElementById('authMessage');
  messageEl.className = 'auth-message';
}

function showError(fieldId, message) {
  const errorEl = document.getElementById(fieldId);
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add('show');
  }
}

function clearErrors() {
  document.querySelectorAll('.form-error').forEach(el => {
    el.textContent = '';
    el.classList.remove('show');
  });
}

// Login Form Handler
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErrors();
  clearMessage();

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const btn = document.getElementById('loginBtn');

  // Validation
  if (!email) {
    showError('loginEmailError', 'Email is required');
    return;
  }
  if (!password) {
    showError('loginPasswordError', 'Password is required');
    return;
  }

  // Disable button and show loading
  btn.disabled = true;
  const originalText = btn.textContent;
  btn.innerHTML = '<span class="loading"></span>';

  try {
    const result = await auth.login(email, password);
    showMessage('Login successful! Redirecting...', 'success');
    
    setTimeout(() => {
      window.location.href = '/index.html';
    }, 1500);
  } catch (error) {
    showMessage(error.message, 'error');
    btn.disabled = false;
    btn.textContent = originalText;
  }
});

// Signup Form Handler
document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErrors();
  clearMessage();

  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('signupConfirmPassword').value;
  const btn = document.getElementById('signupBtn');

  // Validation
  if (!email) {
    showError('signupEmailError', 'Email is required');
    return;
  }
  if (!password) {
    showError('signupPasswordError', 'Password is required');
    return;
  }
  if (password.length < 8) {
    showError('signupPasswordError', 'Password must be at least 8 characters');
    return;
  }
  if (password !== confirmPassword) {
    showError('signupConfirmError', 'Passwords do not match');
    return;
  }

  // Disable button and show loading
  btn.disabled = true;
  const originalText = btn.textContent;
  btn.innerHTML = '<span class="loading"></span>';

  try {
    const result = await auth.signup(email, password);
    showMessage('Account created! Check your email for verification.', 'success');
    document.getElementById('signupForm').reset();
    
    setTimeout(() => {
      // Switch to login tab
      document.querySelector('[data-tab="login"]').click();
      document.getElementById('loginEmail').value = email;
    }, 2000);
  } catch (error) {
    showMessage(error.message, 'error');
    btn.disabled = false;
    btn.textContent = originalText;
  }
});

// Auto-redirect if already logged in
window.addEventListener('load', () => {
  if (auth.isLoggedIn()) {
    window.location.href = '/index.html';
  }
});
