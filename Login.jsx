import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../firebaseconfig';

function Login({ setIsLoggedIn, isLoggedIn }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      console.log('The user is logged in');
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const handleLogin = async () => {
    try {
      provider.setCustomParameters({ prompt: "select_account" }); // Forces Google account selection
      const result = await signInWithPopup(auth, provider);
      console.log("User signed in:", result.user);
      setIsLoggedIn(true);
      navigate('/');
    } catch (error) {
      console.error('Error during login:', error);
    }
  };
  

  return (
    <div id="loginpage" className="relative bg-white w-[100vw] h-[100vh]">
      <div id="Whatsapp_logo" className="absolute bg-[#12de5d] w-[100%] h-[30%] flex">
        <div
          id="img"
          className="h-[55px] w-[55px] bg-[url('/images/whatsapp_icon.png')] bg-cover ml-[25vw] mt-[4vh] rounded-tl-[3px] rounded-bl-[3px]"
        ></div>
        <div
          id="name"
          className="h-[55px] w-[89px] mt-[4vh] flex justify-center items-center rounded-tr-[3px] rounded-br-[3px] font-sans"
        >
          Whats'App
        </div>
      </div>
      <div
        id="login"
        className="absolute w-[60%] h-[78%] ml-[20vw] mr-[20vw] mt-[16vh] mb-[20vh] bg-[rgb(246,254,255)] border-[2px] border-[#5ebd81] rounded-[7px] text-[22px] text-[#14a549]"
      >
        <div
          id="fingerprint"
          className="h-[42vh] w-[40vh] bg-[url('/images/fingerprint.jpg')] bg-cover ml-[16vw]"
        ></div>
        <div id="neeche" className="flex flex-col items-center mt-[10vh]">
          Sign-in with your Google account to get started
          <button
            onClick={handleLogin}
            id="btn"
            className="text-[white] bg-[#14a549] h-[50px] w-[300px] rounded-sm"
          >
            Sign-in with Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
