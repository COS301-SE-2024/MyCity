// import promptFunction from 'prompt-sync';

// const prompt = promptFunction({sigint:true});

// const userType = prompt("Type of users u want to import (citizen/municipality/service-provider): ");

import { signUp } from "aws-amplify/auth";


async function importUsers() {
  
  const { isSignUpComplete, userId, nextStep } = await signUp({
    username: "hello@mycompany.com",
    password: "hunter2",
    options: {
      userAttributes: {
        email: "hello@mycompany.com",
        phone_number: "+15555555555" // E.164 number convention
      },
    }
  });

}
