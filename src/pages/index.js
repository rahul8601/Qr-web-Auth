// pages/index.js
import React, { useEffect, useState } from "react";
import QrSection from "@/components/QrSection";
import UserDetails from "@/components/UserDetails";

const Home = () => {
  const [sessionId, setSessionId] = useState(null);
  const [authenticatedUser, setAuthenticatedUser] = useState();
  const [data, setData] = useState({});
  const [ws, setWs] = useState(null);

  useEffect(() => {
    // Initialize WebSocket connection
    // const socket = new WebSocket("ws://localhost:3000/ws");

    const socket = new WebSocket(process.env.NEXT_PUBLIC_WEB_SOCKET);

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (message) => {
      const data = JSON.parse(message.data);
      console.log({ data });

      if (data.sessionId) {
        setSessionId(data.sessionId);
      }
      if (data.success) {
        setData(data?.payload);
        setAuthenticatedUser(data?.token);
        socket.close();
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    setWs(socket);

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);

  return (
    <>
      <div>
        {!authenticatedUser ? (
          <>
            {/* Qr page  */}
            <QrSection sessionId={sessionId} />
          </>
        ) : (
          <>
            {/* User details */}
            <UserDetails data={data} authenticatedUser={authenticatedUser} />
          </>
        )}
      </div>
    </>
  );
};

export default Home;
