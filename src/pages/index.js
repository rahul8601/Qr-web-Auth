// pages/index.js
import React, { useEffect, useState } from "react";
import { useQRCode } from "next-qrcode";
import QrSection from "@/components/QrSection";

import UserDetails from "@/components/UserDetails";
import QrSectionLoading from "@/components/QrSectionLoading";

const Home = () => {
  const { Canvas } = useQRCode();

  const [sessionId, setSessionId] = useState(null);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
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
      if (data.sessionId) {
        setSessionId(data.sessionId);
      }
      if (data.success) {
        setData(data?.payload);
        setAuthenticatedUser(data?.payload?.sub);
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
  // console.log({ data });
  return (
    <div>
      {!authenticatedUser ? (
        sessionId ? (
          <>
            {/* Qr page  */}
            <QrSection sesstionId={sessionId} />
          </>
        ) : (
          // QR page loding...
          <QrSectionLoading />
        )
      ) : (
        <>
          {/* User details */}
          <UserDetails data={data} authenticatedUser={authenticatedUser} />
        </>
      )}
    </div>
  );
};

export default Home;
