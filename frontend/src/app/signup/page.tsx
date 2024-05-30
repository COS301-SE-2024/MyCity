'use client'

import React, { useState } from "react";
import { RadioGroup, Radio } from "@nextui-org/react";
import CitizenSignup from "@/components/SignUp/CitizenSignUp";
import MunicipalitySignup from "@/components/SignUp/MunicipalitySignUp";
import OrganizationSignup from "@/components/SignUp/OrganizationSignUp";

type UserType='citizen'| 'municipality' |'organization'

export default function Signup() {
    const [userType, setUserType] = useState<UserType>("citizen");

    return (
        <main className="flex min-h-screen flex-col items-center p-24 dark">
            <RadioGroup color="secondary" value={userType} onChange={(event)=>setUserType(event.target.value as UserType)} className="flex flex-row justify-between">
                <Radio value="citizen">Citizen</Radio>
                <Radio value="municipality">Municipality</Radio>
                <Radio value="organization">Organization</Radio>
            </RadioGroup>

            <div className="mt-20">
                {userType == "citizen" && (
                    <CitizenSignup />
                )}

                {userType == "municipality" && (
                    <MunicipalitySignup />
                )}

                {userType == "organization" && (
                    <OrganizationSignup />
                )}
            </div>

        </main>
    );
}
