import promptFunction from 'prompt-sync';

import { Amplify } from 'aws-amplify';
import { signUp } from "aws-amplify/auth";

import dotenv from "dotenv";

import fs from 'fs';
import * as path from 'path';

const envPath = path.join(__dirname, "..", ".env.local");
dotenv.config({ path: envPath });


type User = {
  email: string;
  password: string;
  given_name: string;
  family_name: string;
  picture: string;
  user_role: "CITIZEN" | "MUNICIPALITY" | "PRIVATE-COMPANY";
  municipality?: string;
  auth_code?: string;
};

type ErrorLog = {
  index: number;
  email: string;
  error: Error;
};

type Result = {
  userId: string | undefined;
  email: string;
};




const importUsers = async (users: User[]) => {
  configureAmplify();

  const results: Result[] = [];
  const errorList: ErrorLog[] = [];

  let count = 0;

  let signupComplete: boolean = false;
  let userID: string | undefined = undefined;

  for (const user of users) {
    signupComplete = false;
    userID = undefined;

    try {
      if (user.user_role == "CITIZEN") {
        const { isSignUpComplete, userId } = await signupCitizen(user);

        signupComplete = isSignUpComplete;
        userID = userId;
      }

      else if (user.user_role == "MUNICIPALITY") {
        const { isSignUpComplete, userId } = await signupMunicipalityEmployee(user);

        signupComplete = isSignUpComplete;
        userID = userId;
      }
      else if (user.user_role == "PRIVATE-COMPANY") {
        const { isSignUpComplete, userId } = await signupPrivateCompanyEmployee(user);

        signupComplete = isSignUpComplete;
        userID = userId;
      }

      if (signupComplete) {
        console.log(`${count}. (${user.user_role}): ${userID} ${user.given_name} ${user.family_name}.`);

        results.push({ userId: userID, email: user.email });
      }
      else {
        console.log(`${count}.  (${user.user_role}): signup failed.`);

        logError(errorList, user, count, { name: "UserConfirmationError", message: "signup not complete." });
      }

    }
    catch (e) {
      const error = e as Error;

      if (error.name != "UsernameExistsException") {
        console.log(`${count}. (${user.user_role}): signup failed.`);
        logError(errorList, user, count, error);
      }
    }

    count++;
  }


  return { results, errorList };
};

const logError = (list: ErrorLog[], user: User, count: number, error: Error) => {
  const signupError: ErrorLog = { email: user.email, index: count, error: { name: error.name, message: error.message } };
  list.push(signupError);
};

const signupCitizen = async (user: User) => {
  const response = await signUp({
    username: user.email,
    password: user.password,
    options: {
      userAttributes: {
        email: user.email,
        given_name: user.given_name,
        family_name: user.family_name,
        picture: user.picture,
        "custom:user_role": user.user_role,
        "custom:municipality": user.municipality
      },
    }
  });

  return response;
};

const signupMunicipalityEmployee = async (user: User) => {
  const response = await signUp({
    username: user.email,
    password: user.password,
    options: {
      userAttributes: {
        email: user.email,
        given_name: user.given_name,
        family_name: user.family_name,
        picture: user.picture,
        "custom:municipality": user.municipality,
        "custom:auth_code": user.auth_code
      },
    }
  });

  return response;
};

const signupPrivateCompanyEmployee = async (user: User) => {
  const response = await signUp({
    username: user.email,
    password: user.password,
    options: {
      userAttributes: {
        email: user.email,
        given_name: user.given_name,
        family_name: user.family_name,
        picture: user.picture,
        "custom:user_role": user.user_role,
        "custom:auth_code": user.auth_code
      },
    }
  });

  return response;
};

const requestConfirmation = async () => {
  const prompt = promptFunction({ sigint: true });

  let response = prompt("Provide the filename to import (without the extension): ");
  let filename = response.trim();
  let filepath = path.join(__dirname, `data/${filename}.json`);

  while (fs.existsSync(filepath) == false) {
    response = prompt("File not found, please try again: ");
    filename = response;
    filepath = path.join(__dirname, `data/${filename}.json`);
  }

  response = prompt(`Import ${filepath} into cognito? (y/n): `);

  while (response != "y" && response != "n") {
    response = prompt("Invalid input, try again: ");
  }


  if (response == "n") {
    console.log("Okay, byee!!!");
    return;
  }


  const jsonData = fs.readFileSync(filepath, "utf-8");
  const users: User[] = JSON.parse(jsonData);

  const { results, errorList } = await importUsers(users);

  if (errorList.length > 0) {
    const dest = path.join(__dirname, `logs/${filename}.json`);
    fs.writeFileSync(dest, JSON.stringify(errorList), "utf-8");
  }

  if (results.length > 0) {
    const dest = path.join(__dirname, `results/${filename}.json`);
    fs.writeFileSync(dest, JSON.stringify(results), "utf-8");
  }

};


const configureAmplify = () => {
  Amplify.configure({
    Auth: {
      Cognito: {
        //  Amazon Cognito User Pool ID
        userPoolId: String(process.env.NEXT_PUBLIC_USER_POOL_ID),
        // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
        userPoolClientId: String(process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID),
        // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
        // identityPoolId: 'XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab',
      }
    }
  },
    {
      ssr: true
    });
};





requestConfirmation();