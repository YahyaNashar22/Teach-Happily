import { useEffect } from "react";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { checkUserFromCookie, useUserStore } from "./store";

function App() {
  const { token, clearUser } = useUserStore();

  useEffect(() => {
    const checkUserValidity = async () => {
      // If there's no token in local storage, clear the user
      if (!token) {
        clearUser();
      } else {
        try {
          // Validate the user using the token
          await checkUserFromCookie();
        } catch (error) {
          console.log(error);
          clearUser();
        }
      }
    };
    console.log(token);

    checkUserValidity();
  }, [token, clearUser]);

  return (
    <>
      <AppRoutes />
    </>
  );
}

export default App;
