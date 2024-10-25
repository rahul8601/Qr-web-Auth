// pages/index.js
import React, { useEffect, useState } from "react";
import { useQRCode } from "next-qrcode";

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Web QR Code Authentication
      </h1>

      {!authenticatedUser ? (
        sessionId ? (
          <>
            <Canvas
              text={sessionId}
              logo={{
                src: "/mapzot.jpg",
                options: { width: 40 },
              }}
              options={{
                errorCorrectionLevel: "M",
                margin: 3,
                scale: 4,
                width: 200,
                color: {
                  dark: "#010599FF",
                  light: "#FFFFFF",
                },
              }}
            />

            <p className="text-lg text-gray-600 mt-4">
              Scan the QR code with your mobile app to authenticate.
            </p>
          </>
        ) : (
          <p className="text-lg text-gray-600 mt-4">Generating session...</p>
        )
      ) : (
        <>
          <h2 className="text-2xl font-semibold bg-red-300 p-4 rounded-lg mb-4 flex justify-center alight-center">
            Hello, Welcome {data?.name}
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            You are logged in from{" "}
            <span className="font-bold text-gray-700 italic">
              {data?.email}
            </span>
          </p>
          <h2 className="text-xl font-medium text-gray-700">
            Authenticated as User: {authenticatedUser}
          </h2>
          {/* <button
            onClick={() => console.log("click Logout")}
            className="mt-4 py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
          >
            Logout
          </button> */}
        </>
      )}
    </div>
  );
};

export default Home;
