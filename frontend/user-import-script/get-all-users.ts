import promptFunction from 'prompt-sync';
import { CognitoIdentityProviderClient, ListUsersCommand, ListUsersCommandInput } from "@aws-sdk/client-cognito-identity-provider";

import fs from 'fs';
import * as path from 'path';

import dotenv from "dotenv";

const envPath = path.join(__dirname, "..", ".env.local");
dotenv.config({ path: envPath });

const getAllUsers = async () => {
    const client = new CognitoIdentityProviderClient();
    const input: ListUsersCommandInput = {
        UserPoolId: String(process.env.NEXT_PUBLIC_USER_POOL_ID),
        AttributesToGet: [
            "sub",
            "email",
        ]
    };

    console.log("processing...\n");
    const command = new ListUsersCommand(input);
    const response = await client.send(command);

    const destDir = path.join(__dirname, `user-pool`);
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    const dest = path.join(__dirname, `user-pool/data.json`);
    fs.writeFileSync(dest, JSON.stringify(response.Users), "utf-8");

    console.log(`Success...\nDestination file: ${dest}`)
};


const requestConfirmation = async () => {
    const prompt = promptFunction({ sigint: true });
    let response = prompt(`Do you wish retrieve all users from cognito user pool? (y/n): `);

    while (response != "y" && response != "n") {
        response = prompt("Invalid input, try again: ");
    }

    if (response == "n") {
        console.log("Okay, byee!!!");
        return;
    }

    await getAllUsers();
};



requestConfirmation();