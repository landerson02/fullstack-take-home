"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { MediaItem } from "@/types";

type State = {
  items: MediaItem[];
};

const initialState: State = {
  items: [],
};

type Action =
  | { type: "ADD_ITEM"; payload: MediaItem }
  | { type: "REMOVE_ITEM"; payload: { id: string } }
  | { type: "LOAD_ITEMS"; payload: MediaItem[] }
  | { type: "CLEAR" };

function portfolioReducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_ITEM":
      return { ...state, items: [...state.items, action.payload] };

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      };

    case "LOAD_ITEMS":
      return { ...state, items: action.payload };

    case "CLEAR":
      return { ...state, items: [] };

    default:
      return state;
  }
}

const PortfolioContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => {},
});

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(portfolioReducer, initialState);
  return (
    <PortfolioContext.Provider value={{ state, dispatch }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => useContext(PortfolioContext);
