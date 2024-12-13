"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";

type ChatRoom = {
  _id: string;
  name: string;
  participants: string[];
  createdAt: string;
  updatedAt: string;
};

export default function SideBar() {
  const router = useRouter();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const response = await fetch("/api/chatRooms", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch chat rooms");
        }

        const data = await response.json();
        setChatRooms(data);
      } catch (error) {
        console.log("Error Fetching chatRooms", error);
      }
    };

    fetchChatRooms();
  }, []);

  const navigateChatRoom = (chatRoomId: string) => {
    router.push(`/chat/${chatRoomId}`);
  };

  const navigateToNewChatRoom = () => {
    router.push("/");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString); // Parse the date string
    return date.toLocaleString(); // Format as a readable string
  };

  return (
    <div className="flex flex-col h-screen bg-black">
      <button
        onClick={navigateToNewChatRoom}
        // disabled={isLoading}
        className="flex flex-row items-center justify-center space-x-2 m-2 bg-black text-white px-5 py-3 rounded-lg hover:bg-gray-700 transition-all disabled:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed sticky top-0 z-10"
      >
        <IoMdAdd />
        <p>New Chat</p>
        {/* {isLoading ? "Sending..." : "Send"} */}
      </button>

      <ul className="overflow-y-auto flex-1 m-2 space-y-3 text-white">
        {chatRooms.map(chatRoom => (
          <li
            key={chatRoom._id}
            onClick={e => navigateChatRoom(chatRoom._id)}
            className="bg-gray-800 p-3 rounded-md"
          >
            <h3>{chatRoom.name}</h3>
            <p className="text-xs">{formatDate(chatRoom.createdAt)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
