import { createContext, useEffect, useState } from "react";
import { userGetme } from "../services/user.api.js";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function getMe() {
    setLoading(true);
    try {
      const data = await userGetme();

        console.log("USER:", data.user);
        console.log("PROFILE:", data.profile);

      setUser(data.user);
      setProfile(data.profile);
    } catch (error) {
       console.log("GET ME ERROR:", error.response?.data || error.message);
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getMe();
  }, []);
  return (
    <AuthContext.Provider
      value={{ user, setUser, profile, setProfile, loading, setLoading, getMe }}
    >
      {children}
    </AuthContext.Provider>
  );
};
