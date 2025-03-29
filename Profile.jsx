
import ChatPanel from "./ChatPanel";
import React, { useState } from 'react';


const Profile = () => {
  console.log("you are in the profile.jsx");

  const [noProfile,setnoProfile]=useState(false);

  const openchat=()=>{
    setnoProfile(true);
  }

  if (noProfile) {
      return <ChatPanel />;
  }
  
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="flex w-2/5 h-full bg-white shadow-md">
        {/* Profile Bar */}
        <div className="w-1/4 bg-[#12de5d] text-white flex flex-col items-center py-6">
          <button  onClick={openchat} className="text-2xl cursor-pointer">&#8592;</button>
          <h2 className="mt-4 text-lg">Profile</h2>
        </div>

        {/* Profile Content */}
        <div className="flex-grow p-6 flex flex-col items-center justify-between">
          {/* Profile Image */}
          <div className="w-24 h-24 bg-gray-300 rounded-full mb-6"></div>

          {/* Name Input */}
          <div className="w-full mb-6">
            <label htmlFor="name" className="block text-sm text-gray-700 mb-2">Your Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              className="w-full p-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          {/* Status Input */}
          <div className="w-full mb-6">
            <label htmlFor="status" className="block text-sm text-gray-700 mb-2">Status</label>
            <textarea
              id="status"
              placeholder="Update your status"
              className="w-full p-2 border border-gray-300 rounded-lg text-sm resize-none h-16"
            ></textarea>
          </div>

          {/* Logout Button */}
          <button className="w-full py-2 bg-[#12de5d] text-white text-sm font-medium rounded-lg hover:bg-green-500">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile ;
