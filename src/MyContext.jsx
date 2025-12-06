// MyContext.jsx
import React, { createContext, useState } from 'react';

export const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [globalData, setGlobalData] = useState('Initial Global Data');
  //const glob = {val: 23, str: 'str'};

  return (
    <MyContext.Provider value={{ globalData, setGlobalData }}>
      {children}
    </MyContext.Provider>
  );
};