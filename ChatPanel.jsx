import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebaseconfig";
import { Sun, Moon, User, Activity } from "lucide-react";
import Profile from "./Profile";
import { useNavigate } from "react-router-dom";
import { createChatIfNotExists } from "../utils/chatService";

const ChatPanel = () => {
  const [userList, setUserList] = useState([]); // List of users
  const [loggedInUser, setLoggedInUser] = useState(null); // Logged-in user
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setDarkMode] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("✅ Logged-in Firebase user:", user.email);

        try {
          // Fetch users from Firestore
          const querySnapshot = await getDocs(collection(db, "user"));
          const usersData = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id, // Get Firestore document ID
          }));

          // Find logged-in user's Firestore data
          const loggedInUserData = usersData.find((u) => u.email === user.email);

          if (!loggedInUserData) {
            console.error("❌ Logged-in user not found in Firestore!");
            return;
          }

          console.log("✅ Logged-in user from Firestore:", loggedInUserData);
          setLoggedInUser(loggedInUserData);

          // Filter out the logged-in user from the chat list
          setUserList(usersData.filter((u) => u.email !== user.email));
        } catch (error) {
          console.error("❌ Error fetching users:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        console.error("❌ No logged-in user found.");
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleDarkMode = () => setDarkMode(!isDarkMode);
  const handleShowProfile = () => setShowProfile(true);

  const startChat = async (clickedUser) => {
    if (!loggedInUser?.id || !clickedUser?.id) {
      console.error("❌ User IDs are missing!", loggedInUser, clickedUser);
      return;
    }

    try {
      console.log("📌 Starting chat between:", loggedInUser.id, clickedUser.id);
      const chatID = await createChatIfNotExists(loggedInUser.id, clickedUser.id);

      if (chatID) {
        console.log("✅ Navigating to chat:", `/chat/${chatID}`);
        navigate(`/chat/${chatID}`);
      } else {
        console.error("❌ Chat ID not created!");
      }
    } catch (error) {
      console.error("❌ Error starting chat:", error);
    }
  };

  if (showProfile) return <Profile />;
  if (isLoading) return <div className="flex h-screen items-center justify-center text-gray-500">Loading...</div>;

  return (
    <div className={`flex h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} transition-colors duration-300`}>
      
      {/* Left Section: Profile Bar + Chat List */}
      <div className="w-2/5 flex flex-col border-r border-gray-300">
        
        {/* Profile Bar */}
        <div className="h-[15%] bg-[#12de5d] border-b border-gray-300 flex items-center justify-between px-6 py-2">
          <div className="flex items-center">
            <img
              src={loggedInUser?.profile_pic || "https://via.placeholder.com/40"}
              alt="Profile"
              className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
            />
            <span className="ml-4 text-lg font-semibold">{loggedInUser?.name || "Loading..."}</span>
          </div>
          <div className="flex space-x-12">
            <button onClick={toggleDarkMode} className="text-gray-800 hover:text-gray-900 dark:text-white dark:hover:text-gray-300 transition-all">
              {isDarkMode ? <Sun className="w-7 h-7" /> : <Moon className="w-7 h-7" />}
            </button>
            <button onClick={handleShowProfile} className="text-gray-800 hover:text-gray-900 dark:text-white dark:hover:text-gray-300 transition-all">
              <User className="w-7 h-7" />
            </button>
            <button className="text-gray-800 hover:text-gray-900 dark:text-white dark:hover:text-gray-300 transition-all">
              <Activity className="w-7 h-7" />
            </button>
          </div>
        </div>

        {/* Chat List */}
        <div className={`flex-1 overflow-y-auto py-4 px-6 ${isDarkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"} transition-colors duration-300`}>
          
          {userList.length === 0 ? (
            <p className="text-center text-gray-500">No users available</p>
          ) : (
            userList.map((userObject) => (
              <div key={userObject.id} onClick={() => startChat(userObject)} className={`flex items-center gap-4 p-3 rounded-lg shadow-sm ${isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"} cursor-pointer transition-colors duration-200`}>
                <img
                  src={userObject.profile_pic || "https://via.placeholder.com/40"}
                  alt="User"
                  className="rounded-full h-12 w-12 border-2 border-white shadow-sm"
                />
                <h2 className="font-medium text-lg truncate">{userObject.name}</h2>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Section: Empty Space */}
      <div className={`w-3/5 flex items-center justify-center ${isDarkMode ? "bg-gray-900 text-gray-400" : "bg-gray-50 text-gray-500"} transition-colors duration-300`}>
        <p className="text-xl font-light">Choose a contact to view chat</p>
      </div>
    </div>
  );
};

export default ChatPanel;
