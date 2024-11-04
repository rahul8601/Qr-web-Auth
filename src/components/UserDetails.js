import React from "react";

const UserDetails = ({ authenticatedUser, data }) => {
  return (
    <div className="h-screen bg-[#F4F5FA] flex flex-col justify-center items-center">
      <h2 className="text-2xl font-semibold bg-[#9155FD] p-4 rounded-lg mb-4 flex justify-center alight-center ">
        Hello, Welcome {data?.name}
      </h2>
      <p className="text-lg text-gray-600 mb-6">
        You are logged in from{" "}
        <span className="font-bold text-gray-700 italic">{data?.email}</span>
      </p>
      <h2 className="text-xl font-medium text-gray-700">
        Authenticated as User: {data?.uid}
      </h2>
      {/* <button
            onClick={() => console.log("click Logout")}s
            className="mt-4 py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
          >
            Logout
          </button> */}
    </div>
  );
};

export default UserDetails;
