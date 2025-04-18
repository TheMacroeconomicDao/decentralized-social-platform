'use client'

const sendMessage = async (message: string) => {
    try {
      const response = await fetch("http://localhost:8080/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({query: message}), // ← your payload
      });
  
      if (!response.ok) throw new Error("Failed to send message");
      const data = await response.json();
      console.log(data)
      return data;
    } catch (error) {
      console.error("Error sending message:", error);
      return null;
    }
  };

export default {sendMessage}