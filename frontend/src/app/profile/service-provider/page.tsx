'use client'

import React, { useEffect } from "react";
import EditCitizenProfile from '@/components/EditProfile/UserProfile';

export default function ServiceProviderProfile() {
  //     const [initialData, setInitialData] = useState({
  //       username: '',
  //       email: '',
  //       name: '',
  //       surname: '',
  //       age: 0,
  //       password: '',
  //       cellphone: '',
  //       municipality: ''
  //     });

  useEffect(() => {
    // Fetch initial data for the citizen user
    const fetchProfileData = async () => {
      try {
        const response = await fetch('/api/profile/citizen');
        const data = await response.json();
        // setInitialData(data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, []);

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
      
      <main className="h-screen flex justify-center p-20">
        <div className="flex flex-col items-center justify-center rounded-lg border-t-0 border shadow-lg shadow-blue-800/15 w-[32em] h-fit py-12 px-7">
          <span className="text-[2.5em] font-bold">{"Update Service Provider Profile."}</span>
          {/* <EditCitizenProfile /> */}
        </div>
      </main>
    </div>
  );
};