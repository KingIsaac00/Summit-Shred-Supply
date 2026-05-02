# Setting Up Cognito Auth with Amplify Gen 2

This project uses Amplify Gen 2. Auth is defined in TypeScript at `amplify/auth/resource.ts` with `defineAuth`, and the browser is configured from `amplify_outputs.json`.

Do not use the Gen 1 commands `amplify init`, `amplify add auth`, or `amplify push` for this repo.

## Prerequisites

1. Install Node.js 18 or newer.
2. Configure AWS credentials for the account where you want the backend.
3. Install dependencies from the repo root:

```powershell
npm ci
```

Check your tools:

```powershell
node --version
npm --version
npx ampx --version
```

## Auth Backend

The Cognito User Pool is already declared here:

```ts
// amplify/auth/resource.ts
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
});
```

That means users sign up and sign in with email. Cognito sends an email confirmation code after signup, and `auth.html` now includes the confirmation-code screen.

## Local Development

From the project root, start an Amplify Gen 2 sandbox:

```powershell
npx ampx sandbox
```

The sandbox deploys the backend and writes `amplify_outputs.json` at the repo root. Keep the sandbox terminal running while you test.

Then run the site with Live Server and open:

```text
/auth.html
```

Test this flow:

1. Create an account with an email and password.
2. Copy the confirmation code from your email.
3. Enter the code on the confirm screen.
4. Sign in.
5. Confirm you land on `/index.html`.
6. Use the logout icon to return to `/auth.html`.

`amplify_outputs.json` is intentionally ignored by git. It is environment-specific and should be generated locally or by Amplify Hosting.

## Amplify Hosting Deployment

The repo has `amplify.yml` configured for Gen 2:

```yaml
backend:
  phases:
    build:
      commands:
        - npm ci --cache .npm --prefer-offline
        - npx ampx pipeline-deploy --branch $AWS_BRANCH --app-id $AWS_APP_ID --outputs-out-dir . --outputs-format json
```

When the app is connected to Amplify Hosting as a Gen 2 app, Amplify provides `AWS_BRANCH` and `AWS_APP_ID`. The backend phase deploys the Cognito resources and generates the frontend outputs file for that branch.

The frontend is a static site, so it publishes only the browser assets from the repo root. Do not use `**/*` here after running `npm ci`, because that can publish `node_modules` and backend build files.

```yaml
artifacts:
  baseDirectory: .
  files:
    - index.html
    - auth.html
    - auth.js
    - auth-config.js
    - homepage.css
    - items.js
    - amplify_outputs.json
    - images/**/*
    - HomePage/**/*
```

## Files That Matter

- `amplify/auth/resource.ts`: declares Cognito email login.
- `amplify/backend.ts`: registers auth and data resources.
- `amplify.yml`: deploys the Gen 2 backend in Amplify Hosting.
- `auth.html`: login, signup, and email confirmation UI.
- `auth.js`: browser-safe Amplify Auth calls using `amplify_outputs.json`.
- `index.html`: protects the shop page and handles logout.

## Troubleshooting

### Auth page says Amplify config is missing

Run:

```powershell
npx ampx sandbox
```

For a deployed app, confirm the Amplify Hosting build ran the backend phase successfully.

### Browser console shows failed imports from aws-amplify

Make sure `auth.html` loads `/auth.js` and that `auth.js` uses the CDN imports. This repo is not bundled by Vite/Webpack, so bare imports like `import { Amplify } from 'aws-amplify'` will not work in the browser.

### Signup succeeds but login fails

Confirm the account first. Cognito email auth requires the verification code sent to the user's email unless you change the backend auth policy.

### Password is rejected

Use the password policy shown in the generated `amplify_outputs.json`. The current backend may require uppercase, lowercase, number, and symbol characters.

### Amplify Hosting build cannot find `ampx`

Run `npm ci` during the build. This repo includes `@aws-amplify/backend-cli`, which provides `npx ampx`.

### Deploy fails with `BootstrapDetectionError` or `ssm:GetParameter`

If the build reaches `npx ampx pipeline-deploy` and fails with an error like:

```text
Unable to detect CDK bootstrap stack due to permission issues
is not authorized to perform: ssm:GetParameter
arn:aws:ssm:REGION:ACCOUNT_ID:parameter/cdk-bootstrap/hnb659fds/version
```

the repo is fine; the Amplify Hosting build role needs permission to read the CDK bootstrap version from SSM.

In IAM, find the role shown in the error. In this project's latest failure it was:

```text
AemiliaControlPlaneLambda-CodeBuildRole-WZ7YQ9FM4OVR
```

Add this inline policy, replacing the region/account if your error shows different values:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "ssm:GetParameter",
      "Resource": "arn:aws:ssm:us-east-2:264748200621:parameter/cdk-bootstrap/*"
    }
  ]
}
```

Redeploy after saving the policy. If another permission error appears after this, grant the next missing action to the same build role.

## References

- Amplify Gen 2 outputs: https://docs.amplify.aws/react-native/reference/amplify_outputs/
- Amplify Gen 2 CI/CD and `pipeline-deploy`: https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/custom-pipelines/
