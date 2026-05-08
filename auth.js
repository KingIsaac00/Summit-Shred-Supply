// Amplify Gen 2 Authentication Handler
// This file is loaded directly in the browser, so it uses CDN ESM imports.

import { Amplify } from 'https://esm.sh/aws-amplify@6.16.4';
import {
  confirmSignUp,
  getCurrentUser,
  resendSignUpCode,
  signIn,
  signOut,
  signUp,
} from 'https://esm.sh/aws-amplify@6.16.4/auth';

const CONFIG_PATHS = ['/amplify_outputs.json', '/amplifyconfiguration.json'];

let authReady = false;
let pendingEmail = '';

window.summitAuthModuleLoaded = true;

const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const confirmForm = document.getElementById('confirmForm');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const confirmBtn = document.getElementById('confirmBtn');
const resendCodeBtn = document.getElementById('resendCodeBtn');

async function loadAmplifyConfig() {
  for (const path of CONFIG_PATHS) {
    try {
      const response = await fetch(path, { cache: 'no-store' });
      if (response.ok) return normalizeAmplifyConfig(await response.json());
    } catch {
      // Try the next known Amplify config filename.
    }
  }

  throw new Error('Missing Amplify config. Run `npx ampx sandbox` locally or deploy/generate outputs in Amplify.');
}

function normalizeAmplifyConfig(config) {
  if (config.Auth?.Cognito?.userPoolId && config.Auth?.Cognito?.userPoolClientId) {
    return config;
  }

  if (config.auth) {
    const auth = config.auth;
    return {
      ...config,
      Auth: {
        Cognito: {
          userPoolId: auth.user_pool_id,
          userPoolClientId: auth.user_pool_client_id,
          identityPoolId: auth.identity_pool_id,
          allowGuestAccess: auth.unauthenticated_identities_enabled,
          groups: auth.groups,
          loginWith: {
            email: auth.username_attributes?.includes('email') ?? true,
            phone: auth.username_attributes?.includes('phone_number') ?? false,
            username: auth.username_attributes?.includes('username') ?? false,
          },
          mfa: auth.mfa_configuration ? {
            status: auth.mfa_configuration === 'OPTIONAL' ? 'optional' : auth.mfa_configuration === 'REQUIRED' ? 'on' : 'off',
            smsEnabled: auth.mfa_methods?.includes('SMS') ?? false,
            totpEnabled: auth.mfa_methods?.includes('TOTP') ?? false,
          } : undefined,
          passwordFormat: auth.password_policy ? {
            minLength: auth.password_policy.min_length ?? 8,
            requireLowercase: auth.password_policy.require_lowercase ?? false,
            requireNumbers: auth.password_policy.require_numbers ?? false,
            requireSpecialCharacters: auth.password_policy.require_symbols ?? false,
            requireUppercase: auth.password_policy.require_uppercase ?? false,
          } : undefined,
          signUpVerificationMethod: 'code',
          userAttributes: auth.standard_required_attributes?.reduce((attributes, name) => {
            attributes[name] = { required: true };
            return attributes;
          }, {}),
        },
      },
    };
  }

  if (config.aws_user_pools_id && config.aws_user_pools_web_client_id) {
    return {
      ...config,
      Auth: {
        Cognito: {
          userPoolId: config.aws_user_pools_id,
          userPoolClientId: config.aws_user_pools_web_client_id,
          identityPoolId: config.aws_cognito_identity_pool_id,
          loginWith: {
            email: config.aws_cognito_username_attributes?.includes('EMAIL') ?? true,
            phone: config.aws_cognito_username_attributes?.includes('PHONE_NUMBER') ?? false,
            username: !(config.aws_cognito_username_attributes?.includes('EMAIL') || config.aws_cognito_username_attributes?.includes('PHONE_NUMBER')),
          },
          signUpVerificationMethod: config.aws_cognito_sign_up_verification_method || 'code',
        },
      },
    };
  }

  return config;
}

function setButtonsDisabled(disabled) {
  [loginBtn, signupBtn, confirmBtn, resendCodeBtn].forEach(btn => {
    if (btn) btn.disabled = disabled;
  });
}

function setButtonLoading(btn, loading) {
  if (!btn) return;
  if (loading) {
    btn.dataset.originalText = btn.textContent;
    btn.innerHTML = '<span class="loading"></span>';
    btn.disabled = true;
  } else {
    btn.textContent = btn.dataset.originalText || btn.textContent;
    btn.disabled = false;
  }
}

function showMessage(text, type) {
  const messageEl = document.getElementById('authMessage');
  messageEl.textContent = text;
  messageEl.className = `auth-message show ${type}`;
}

function clearMessage() {
  const messageEl = document.getElementById('authMessage');
  messageEl.className = 'auth-message';
  messageEl.textContent = '';
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

function setActiveForm(formName) {
  document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
  document.querySelectorAll('.auth-tab').forEach(tab => tab.classList.toggle('active', tab.dataset.tab === formName));

  const formMap = {
    login: loginForm,
    signup: signupForm,
    confirm: confirmForm,
  };

  formMap[formName]?.classList.add('active');
}

function getFriendlyError(error) {
  const message = error?.message || 'Something went wrong. Please try again.';
  if (message.includes('UserAlreadyAuthenticatedException')) return 'You are already signed in. Redirecting...';
  if (message.includes('UserNotConfirmedException')) return 'Please confirm your email with the code Cognito sent you.';
  if (message.includes('UsernameExistsException')) return 'An account with that email already exists. Try signing in.';
  if (message.includes('NotAuthorizedException')) return 'Incorrect email or password.';
  if (message.includes('CodeMismatchException')) return 'That confirmation code is not correct.';
  if (message.includes('ExpiredCodeException')) return 'That confirmation code expired. Send a new code and try again.';
  return message;
}

async function redirectIfSignedIn() {
  try {
    await getCurrentUser();
    window.location.href = '/index.html';
  } catch {
    // No active session, stay on auth page.
  }
}

async function configureAuth() {
  setButtonsDisabled(true);
  try {
    const config = await loadAmplifyConfig();
    Amplify.configure(config);
    authReady = true;
    setButtonsDisabled(false);
    await redirectIfSignedIn();
  } catch (error) {
    setButtonsDisabled(false);
    showMessage(getFriendlyError(error), 'error');
  }
}

document.querySelectorAll('.auth-tab').forEach(tab => {
  tab.addEventListener('click', e => {
    const tabName = e.currentTarget.dataset.tab;
    clearErrors();
    clearMessage();
    setActiveForm(tabName);
  });
});

loginForm.addEventListener('submit', async e => {
  e.preventDefault();
  clearErrors();
  clearMessage();

  if (!authReady) {
    showMessage('Amplify Auth is not configured yet.', 'error');
    return;
  }

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (!email) {
    showError('loginEmailError', 'Email is required');
    return;
  }
  if (!password) {
    showError('loginPasswordError', 'Password is required');
    return;
  }

  setButtonLoading(loginBtn, true);
  try {
    const result = await signIn({ username: email, password });

    if (result.isSignedIn) {
      localStorage.setItem('userEmail', email);
      showMessage('Login successful. Redirecting...', 'success');
      window.location.href = '/index.html';
      return;
    }

    if (result.nextStep?.signInStep === 'CONFIRM_SIGN_UP') {
      pendingEmail = email;
      document.getElementById('confirmEmail').value = email;
      setActiveForm('confirm');
      showMessage('Check your email for the confirmation code.', 'success');
      return;
    }

    showMessage(`Next step required: ${result.nextStep?.signInStep || 'unknown'}`, 'error');
  } catch (error) {
    if (error?.name === 'UserNotConfirmedException') {
      pendingEmail = email;
      document.getElementById('confirmEmail').value = email;
      setActiveForm('confirm');
    }
    const message = getFriendlyError(error);
    showMessage(message, message.includes('already signed in') ? 'success' : 'error');
    if (message.includes('already signed in')) window.location.href = '/index.html';
  } finally {
    setButtonLoading(loginBtn, false);
  }
});

signupForm.addEventListener('submit', async e => {
  e.preventDefault();
  clearErrors();
  clearMessage();

  if (!authReady) {
    showMessage('Amplify Auth is not configured yet. Check that amplify_outputs.json exists or that the Amplify Hosting backend build completed.', 'error');
    return;
  }

  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('signupConfirmPassword').value;

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

  setButtonLoading(signupBtn, true);
  try {
    const result = await signUp({
      username: email,
      password,
      options: {
        userAttributes: { email },
      },
    });

    pendingEmail = email;

    if (result.isSignUpComplete || result.nextStep?.signUpStep === 'DONE') {
      showMessage('Account created. You can sign in now.', 'success');
      setActiveForm('login');
      document.getElementById('loginEmail').value = email;
      signupForm.reset();
      return;
    }

    document.getElementById('confirmEmail').value = email;
    signupForm.reset();
    setActiveForm('confirm');
    showMessage('Account created. Enter the confirmation code from your email.', 'success');
  } catch (error) {
    showMessage(getFriendlyError(error), 'error');
  } finally {
    setButtonLoading(signupBtn, false);
  }
});

confirmForm.addEventListener('submit', async e => {
  e.preventDefault();
  clearErrors();
  clearMessage();

  const email = document.getElementById('confirmEmail').value.trim() || pendingEmail;
  const code = document.getElementById('confirmCode').value.trim();

  if (!email) {
    showError('confirmEmailError', 'Email is required');
    return;
  }
  if (!code) {
    showError('confirmCodeError', 'Confirmation code is required');
    return;
  }

  setButtonLoading(confirmBtn, true);
  try {
    await confirmSignUp({ username: email, confirmationCode: code });
    pendingEmail = '';
    confirmForm.reset();
    document.getElementById('loginEmail').value = email;
    setActiveForm('login');
    showMessage('Email confirmed. You can sign in now.', 'success');
  } catch (error) {
    showMessage(getFriendlyError(error), 'error');
  } finally {
    setButtonLoading(confirmBtn, false);
  }
});

resendCodeBtn.addEventListener('click', async () => {
  clearErrors();
  clearMessage();

  const email = document.getElementById('confirmEmail').value.trim() || pendingEmail;
  if (!email) {
    showError('confirmEmailError', 'Email is required to resend a code');
    return;
  }

  setButtonLoading(resendCodeBtn, true);
  try {
    await resendSignUpCode({ username: email });
    showMessage('A new confirmation code was sent.', 'success');
  } catch (error) {
    showMessage(getFriendlyError(error), 'error');
  } finally {
    setButtonLoading(resendCodeBtn, false);
  }
});

window.summitAuth = {
  signOut,
  getCurrentUser,
};

configureAuth();
