import { createContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

export const authContext = createContext(null);

export default function AuthProvider({ children }) {
  const [isSignedIn, setIsSignedIn] = useState(false);

  const checkLogin = async () => {
    const token = await SecureStore.getItemAsync("access_token");
    // console.log(token, "<--");
    // console.log(isSignedIn, "sign?");
    token ? setIsSignedIn(true) : setIsSignedIn(false);
  };

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <authContext.Provider value={{ isSignedIn, setIsSignedIn }}>
      {children}
    </authContext.Provider>
  );
}
