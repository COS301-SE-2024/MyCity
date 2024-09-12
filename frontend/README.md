> [!Important]
> Clone the repository into WSL. Running the following commands in Windows might lead to problems.
> 
> Don't have WSL installed? Check out [How to install WSL](https://learn.microsoft.com/en-us/windows/wsl/install)

## Get Started With Frontend

#### 1. Working directory setup:
Open a terminal in your IDE and set frontend folder as the current working directory (if you have not already done so):
```
cd frontend
```

#### 2. Install Node.js (skip if already installed)
* To check if it is installed run the following command:
 ```
  node -v
 ```

Steps to install

```
# installs nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# download and install Node.js
nvm install 20

# verifies the right Node.js version is in the environment
node -v # should print `v20.13.1`

# verifies the right NPM version is in the environment
npm -v # should print `10.5.2`
```
   
#### 3. Install dependencies for the app
Install the required dependencies from package.json by running:
```
npm install
```

## How to run the app
To start the app, run the following command:
```
npm run dev
```

The command will start the application in development mode with hot-code reloading, error reporting, and more at the default address http://localhost:3000. It might take a while to render on the initial page
load; be patient and in a few moments you should be able to view and navigate the app.

## How to run tests
To run tests inside the \__tests\__ folder, execute the following command:
```
npm test
```
To run tests inside the \__tests\__ folder for a specific file, execute the following command (example):
```
npm test -- __tests__/components/Login/CitizenLogin.test.tsx
```

### Frameworks and libraries
> [!Note]
> The app is already configured to work with NextUI. Other frameworks and libraries may be added as needed.

