// src/Components/MessageComponent.jsx
import { useEffect, useState } from "react";

const MessageComponent = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/message")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => console.error(err));
  }, []);

  return <p>{message || "Loading..."}</p>;
};

export default MessageComponent;
