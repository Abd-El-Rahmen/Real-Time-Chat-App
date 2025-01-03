import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import SigninPage from "./pages/SigninPage";
import ProfilePage from "./pages/ProfilePage";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore";
import CreateGroupPage from "./pages/CreateGroupPage";
import SearchPage from "./pages/SearchPage";
import GroupPage from "./pages/GroupPage";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  const {theme} = useThemeStore()


  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme}>
      <Toaster />
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SigninPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/create-group"
          element={authUser ? <CreateGroupPage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/group"
          element={authUser ? <GroupPage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/search"
          element={authUser ? <SearchPage /> : <Navigate to={"/login"} />}
        />
        
      </Routes>
    </div>
  );
}

export default App;
