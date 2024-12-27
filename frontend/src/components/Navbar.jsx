import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { LogOut, Hand,  User } from "lucide-react";
import ThemeButton from "./ThemeButton";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80 py-2">
      <div className="container mx-auto px-4 h16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              to={"/"}
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Hand className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">SayHy</h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <ThemeButton/>
            {authUser && (
              <>
                <Link to={"/profile"} className="btn btn-sm gap-2">
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
                <button onClick={logout} className="flex gap-2 items-center">
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
