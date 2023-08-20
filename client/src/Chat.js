import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const modules = {
 toolbar:[
  ["bold", "italic", "strike"],
  ["link"],
  [{ list:  "bullet" }, { list:  "number" }],
  ["blockquote","code-block"],
  ["image"],
 ],
};

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
 

  const sendMessage = async () => {
    console.log(currentMessage);
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      console.log(messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
   
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Chatting Arena</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
              <div
                className="message"
                id={username === messageContent.author ? "other" : "you"}
              >
                <div>
                  <div className="message-content" >
                    
                    <p dangerouslySetInnerHTML={{ __html : messageContent.message}} /> 
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      
      <div className="chat-footer">
        <ReactQuill  className="quill"
         value={currentMessage}
        modules={modules} 
        theme="snow"  
        onChange={setCurrentMessage} 
           placeholder="Chat goes here..." 
           />{console.log(currentMessage)}
        
      </div>
      <div className="btn">
      <button className="buton" onClick={sendMessage}>SEND</button>
      </div>
    </div>
  );
}

export default Chat;