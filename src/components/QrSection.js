import React from "react";
// import { QRCode } from "qrcode.react";
import { useQRCode } from "next-qrcode";
import { RiDownloadLine } from "react-icons/ri";
import { LuArrowUpRight } from "react-icons/lu";
import { MdKeyboardArrowRight } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { GrSettingsOption } from "react-icons/gr";
import { MdLockOutline } from "react-icons/md";

import { AiOutlineLoading3Quarters } from "react-icons/ai";

const QrSection = ({ sessionId }) => {
  const { Canvas } = useQRCode();
  return (
    <>
      <div className="min-h-screen bg-[#F4F5FA] flex flex-col items-center  ">
        <div className="w-full p-4 flex justify-between items-center bg-[#F4F5FA] ">
          <div className=" pl-6 flex justify-center items-center">
            <img src="mapzot.svg" alt="MapZot.AI Logo" className="" />
            <p className="font-medium ml-2 text-[#524E59] text-2xl">
              MapZot.AI
            </p>
          </div>

          <button className="bg-[#A16EFD] hover:bg-[#B790FE]  px-6 py-2 rounded-[26px] transition mr-6 flex justify-center items-center border  border-[black]">
            Download
            <RiDownloadLine style={{ marginLeft: 10 }} />
          </button>
        </div>

        <div className="bg-white border  border-[black] shadow-md rounded-[26px] p-20 mt-8  flex items-center space-x-8 ">
          {/* Left Section: Instructions */}
          <div className="space-y-6 ">
            <h1 className="text-3xl font-semibold text-gray-800">
              Log into MapZot.AI Web
            </h1>
            <p className="text-gray-600">
              Message privately with friends and family using MapZot.AI on your
              browser.
            </p>
            <div className="list-decimal list-inside text-gray-700 space-y-1">
              <p>1. Open MapZot.AI on your phone</p>

              <p className="flex items-center">
                2. Tap <b className="ml-1">Menu</b>
                <span className="mx-1 border border-3 p-1 rounded-lg bg-[#F7F8FA]">
                  <BsThreeDotsVertical />
                </span>
                on Android, or <b className="ml-1">Settings</b>
                <span className="mx-1 border border-3 p-1 rounded-lg bg-[#F7F8FA]">
                  <GrSettingsOption color="gray" />
                </span>
                on iPhone
              </p>

              <p>
                3. Tap <b>Linked Devices</b> and then Link a device
              </p>
              <p>4. Point your phone at this screen to scan the QR code</p>
            </div>

            <div className="space-y-2">
              <a
                href="#"
                className=" hover:text-[#804BDF] border-b-[2px] border-[#A16EFD] w-[210px]  flex justify-left items-center"
              >
                Need help getting started?{" "}
                <LuArrowUpRight style={{ marginLeft: 2 }} />
              </a>
              <br />

              <a
                href="#"
                className="hover:text-[#804BDF] border-b-[2px] border-[#A16EFD] w-[210px] flex justify-left items-center"
              >
                Log in with phone number{" "}
                <MdKeyboardArrowRight size={20} style={{ marginLeft: 2 }} />
              </a>
            </div>
          </div>

          {/* Right Section: QR Code */}
          <div className="flex justify-center items-center  h-[250px] w-[250px] ">
            {sessionId ? (
              <Canvas
                text={sessionId}
                logo={{
                  src: "/mapzot.jpg",
                  options: { width: 46 },
                }}
                options={{
                  errorCorrectionLevel: "M",
                  //   margin: 3,
                  //   scale: 4,
                  width: 300,
                  color: {
                    // dark: "#010599FF",
                    // light: "#FFFFFF",
                  },
                }}
              />
            ) : (
              <div className="flex items-center justify-center w-[250px] h-[250px] bg-[#F4F5FA] ">
                <AiOutlineLoading3Quarters className="text-6xl text-[#C6C2D6] animate-spin" />
              </div>
            )}
          </div>
        </div>
        <p className="flex justify-center items-center mt-5 mb-10">
          <MdLockOutline /> Your personal message are end-to-end encrypted
        </p>
      </div>
    </>
  );
};

export default QrSection;
