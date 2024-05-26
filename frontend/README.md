> [!Important]
> Clone the repository into WSL. Running the following commands in Windows might lead to problems.

## Get Started With Frontend
#### 1. Working directory setup:
Open a terminal in your IDE and set frontend folder as the current working directory (if you have not already done so):
```
cd frontend
```
   
#### 2. Install npm dependencies for the app
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

> [!Note]
> The app is already configured to work with NextUI. Other frameworks and libraries may be added as needed.

