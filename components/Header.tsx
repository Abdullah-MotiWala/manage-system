"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import Avatar from "react-avatar";
import { colors } from "@/constants";
import { useBoardStore } from "@/store/boardStore";
import fetchSuggestion from "@/lib/fetchSuggestion";
const Header = () => {
  const [board, searchString, setSearchString] = useBoardStore((state) => [
    state.board,
    state.searchString,
    state.setSearchString
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [suggestion, setSuggestion] = useState<string>("");

  const fetchSuggestionFromApi = async () => {
    try {
      const suggestion = await fetchSuggestion(board);
      setSuggestion(suggestion);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (board.columns) {
      setLoading(true);
      fetchSuggestionFromApi();
    }
  }, [board]);

  return (
    <header>
      <div
        className={`absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-pink-400 rounded-md filter blur-3xl -z-50 opacity-50 to-[${colors.primary}]`}
      />
      <div className="flex flex-col md:flex-row items-center p-2 bg-gray-500/10 rounded-b-2xl">
        <Image
          src={
            "https://upload.wikimedia.org/wikipedia/en/thumb/8/8c/Trello_logo.svg/1280px-Trello_logo.svg.png"
          }
          alt="tello Logo"
          width={300}
          height={100}
          className="w-44 md:w-56 pb-10 md:pb-0 object-contain"
        />
        <div className="flex flex-1 space-x-2 w-full justify-end  items-center">
          <form className="flex items-center space-x-2 bg-white rounded-md p-1 shadow-md flex-1 md:flex-initial">
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />

            <input
              type="text"
              placeholder="Search"
              className="flex-1 outline-none p-2"
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
            />
            <button hidden>Search</button>
          </form>

          <Avatar
            name="Abdullah MotiWala"
            round
            size="40"
            color={colors.primary}
          />
        </div>
      </div>

      <div className="flex items-center py-2 justify-center px-5">
        <p
          className={`flex items-center text-sm font-light p-2 shadow-xl rounded-xl w-fit bg-white italic max-w-3xl text-[${colors.primary}]`}
        >
          <UserCircleIcon
            className={`h-8 w-8 mr-1 text-[${colors.primary}] ${
              loading && "animate-spin"
            }`}
          />
          Chatgpt is summarising your tasks for day...
        </p>
      </div>
    </header>
  );
};

export default Header;
