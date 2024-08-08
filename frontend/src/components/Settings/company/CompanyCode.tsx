"use client";

import React, { useState, useEffect } from "react";
import { Clipboard, ClipboardCheck } from "lucide-react";

const generateRandomCode = (length: any) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const CompanyCode: React.FC = () => {
  const [companyCode, setCompanyCode] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCompanyCode(generateRandomCode(16));
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(companyCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full rounded-lg p-4">
      <p className="mb-4 text-center">
        This section allows you to manage the Company Code for your company.
        This code is used for authorizing new employees to create their accounts.
      </p>
      <div className="mb-4 text-center">
        <p className="text-gray-700 mb-2">Company Code</p>
        <div className="text-xl font-semibold flex justify-center items-center">
          <span className="mr-2">{companyCode}</span>
          <button
            className="text-blue-500 hover:text-blue-700"
            onClick={handleCopy}
          >
            {copied ? (
              <ClipboardCheck className="h-6 w-6" />
            ) : (
              <Clipboard className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyCode;
