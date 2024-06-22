'use client'

import React from "react";
import EditCitizenProfile from '@/components/EditProfile/UserProfile';
import NavbarUser from "@/components/Navbar/NavbarUser";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useProfile } from "@/context/UserProfileContext";
import { User } from "@/types/user.types";


export const getServerSideProps = (async () => {
  const { getUserProfile } = useProfile();

  const profile = (await getUserProfile()).current;
  // Pass data to the page via props
  return {
    props: { profile }
  }
}) satisfies GetServerSideProps<{ profile: User }>;


export default function CitizenProfile({ profile }: InferGetServerSidePropsType<typeof getServerSideProps>) {

  const handleFormSubmit = async (formData: any) => {
    try {
      const response = await fetch('/api/profile/citizen', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Profile updated successfully!');
      } else {
        const errorData = await response.json();
        alert('Error updating profile: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error updating profile');
    }
  };

  return (
    <div>
      <NavbarUser />
      <main className="h-screen flex justify-center p-20">
        <div className="flex flex-col items-center justify-center rounded-lg border-t-0 border shadow-lg shadow-blue-800/15 w-[32em] h-fit py-12">
          <span className="text-[2.5em] font-bold">{"Update User Profile."}</span>
          <EditCitizenProfile data={profile} />
        </div>
      </main>
    </div>
  );
};