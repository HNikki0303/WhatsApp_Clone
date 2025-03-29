import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, onSnapshot, addDoc, orderBy, doc } from "firebase/firestore";
import { auth, db } from "../../firebaseconfig";

const Chat = () => {
  const { uniquechat } = useParams(); // Get chat ID from URL
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!uniquechat) return;

    // Reference to messages subcollection inside the chat document
    const messagesRef = collection(db, "Chats", uniquechat, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [uniquechat]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await addDoc(collection(db, "Chats", uniquechat, "messages"), {
        sender: auth.currentUser.email,
        text: newMessage,
        createdAt: new Date(),
      });

      setNewMessage(""); // Clear input
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`p-2 my-2 rounded-lg ${msg.sender === auth.currentUser.email ? "bg-green-500 text-white self-end" : "bg-gray-300 text-black self-start"}`}>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>

      <div className="p-4 flex">
        <input
          className="flex-1 p-2 border rounded-lg"
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
