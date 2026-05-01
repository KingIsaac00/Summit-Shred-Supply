# Setting Up Amazon Cognito for Summit Shred Supply

## Prerequisites (Windows)

1. **Node.js** - Download from https://nodejs.org (LTS version)
2. **AWS Account** - Create one at https://aws.amazon.com if you don't have one
3. **AWS Credentials** - Generate from AWS IAM console
4. **PowerShell or Command Prompt**

## Step 1: Verify Node.js Installation

**Open PowerShell and check if Node.js is installed:**

```powershell
node --version
npm --version
```

If these show version numbers, go to Step 2. If not, download Node.js from https://nodejs.org (then restart PowerShell).

## Step 2: Install Amplify CLI

```powershell
npm install -g @aws-amplify/cli
```

**Verify installation:**

```powershell
amplify --version
```

## Step 3: Initialize Amplify in Your Project

**Navigate to your project folder:**

```powershell
cd c:\Users\brade\Documents\GitHub\Summit-Shred-Supply
```

**Initialize Amplify:**

```powershell
amplify init
```

Follow the prompts:
- Project name: `summitshredsupply`
- Environment: `prod` (or your choice)
- Editor: Choose your editor
- App type: `javascript`
- Framework: `none` (since it's a static site)
- Source directory: `.`
- Distribution directory: `.`
- Build command: `echo "No build needed"`
- Start command: `echo "No start needed"`

## Step 4: Add Authentication with Cognito

```powershell
amplify add auth
```

Follow the prompts:
- Do you want to use the default authentication configuration? → **Yes, use the default config**
- How do you want users to be able to sign in? → **Email** (or Email and username)
- Do you want to configure advanced settings? → **No, I'm done**

## Step 5: Deploy

```powershell
amplify push
```

## Step 6: Get Your Cognito Credentials

After deployment, your Cognito credentials will be in `src/aws-exports.js`. Copy these values:
- `aws_user_pools_id` (User Pool ID)
- `aws_user_pools_web_client_id` (Client ID)
- `aws_cognito_region` (Region)

## Step 7: Update auth.js

Open `auth.js` and replace:
```javascript
const poolData = {
  UserPoolId: 'YOUR_USER_POOL_ID',
  ClientId: 'YOUR_CLIENT_ID'
};
```

With your actual values from step 5.

## Step 8: Update Your Main Page

Add a logout button to your main page. Add this to `index.html` in the header:

```html
<button class="icon-btn" id="logoutBtn" type="button" aria-label="Logout">
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M16 17l4-4m0 0l-4-4m4 4H9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>
</button>
```

Add this script to the bottom of `index.html` (before closing body):

```html
<script src="/auth.js"></script>
<script>
  // Logout button handler
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      auth.logout();
      window.location.href = '/auth.html';
    });
  }

  // Protect page - redirect to login if not authenticated
  if (!auth.isLoggedIn() && !window.location.pathname.includes('auth')) {
    window.location.href = '/auth.html';
  }
</script>
```

## Step 9: Link to Login Page

Add a login link in your header. Update the header brand or add:

```html
<a href="/auth.html" class="icon-btn" type="button" aria-label="Login">
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.5"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>
</a>
```

## Next Steps

1. **Set up Cognito** using the steps above
2. **Update your HTML files** with the logout button
3. **Commit and push** to GitHub
4. **Redeploy** to Amplify
5. Test login/signup functionality

## Troubleshooting (Windows)

If you see errors about Cognito not being configured:
1. Make sure you ran `amplify push` successfully
2. Check that your User Pool ID and Client ID are correct in `auth.js`
3. Verify your AWS credentials are configured:
   ```powershell
   aws configure
   ```
   Then enter your AWS Access Key ID and Secret Access Key when prompted

For more info, see: https://docs.amplify.aws/javascript/build-a-backend/auth/
