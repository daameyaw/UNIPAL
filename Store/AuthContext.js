import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useState } from "react";
import { resetUser } from "../src/store/features/userSlice";
import { useDispatch } from "react-redux";

export const AuthContext = createContext({
  token: "",
  isAuthenticated: false,
  authenticate: () => {},
  logout: () => {},
});

function AuthContextProvider({ children }) {
  const dispatch = useDispatch();
  const [authToken, setAuthToken] = useState();

  function authenticate(token) {
    setAuthToken(token);
    AsyncStorage.setItem("token", token);
  }

  function logout() {
    setAuthToken(null);
    dispatch(resetUser()); // Clear Redux memory state

    AsyncStorage.removeItem("token");
    AsyncStorage.removeItem("user");
  }

  const value = {
    token: authToken,
    isAuthenticated: !!authToken,
    authenticate: authenticate,
    logout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
