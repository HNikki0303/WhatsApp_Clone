import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseconfig';
import ChatPanel from './ChatPanel';


function Home(props) {
  console.log("this is homepage");
  const setIsLoggedIn = props.setIsLoggedIn;
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    // logout wala logic 
    setIsLoggedIn(false);
    navigate("/login");
  };

  
  return (
    <div>
      <ChatPanel></ChatPanel>
    </div>
  );
}

export default Home;