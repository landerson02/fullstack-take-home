"use client";

import { createContext, useContext, useState } from "react";

const DEFAULT_USER_ID = "default";

const UserContext = createContext<{
  userId: string;
  setUserId: (id: string) => void;
}>({
  userId: DEFAULT_USER_ID,
  setUserId: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState(DEFAULT_USER_ID);
  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
