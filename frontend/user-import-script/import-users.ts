import { signUp } from "aws-amplify/auth";
import promptFunction from 'prompt-sync';
import { Amplify } from 'aws-amplify';

import dotenv from "dotenv";

dotenv.config({ path: "../.env.local" });


const importUsers = async () => {

  const { isSignUpComplete, userId } = await signUp({
    username: "janedoe@example.com",
    password: "Password@123",
    options: {
      userAttributes: {
        email: "janedoe@example.com",
        given_name: "Jane",
        family_name: "Doe",
        "custom:municipality": "test muni",
        "custom:user_role": "CITIZEN"
      },
    }
  });

  if (isSignUpComplete) {
    console.log("returned id is", userId);
  }
  else {
    console.log("signup failed for some reason");
  }

};


const requestConfirmation = () => {
  const prompt = promptFunction({ sigint: true });

  let response = prompt("Want to import users into cognito pool? (y/n): ");

  while (response != "y" && response != "n") {
    response = prompt("Want to import users into cognito pool? (y/n): ");
  }

  if (response == "y") {
    configureAmplify();
    importUsers();
  }
  else {
    console.log("Okay, byee!!!");
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