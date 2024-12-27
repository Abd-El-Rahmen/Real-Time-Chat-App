import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, Hand  } from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";

const initialFormData = {
  email: "",
  password: "",
};

const LoginPage = () => {
  const { isLoggingIn,login } = useAuthStore();
  const [showPwd, setShowPwd] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const validDataForm = () => {
    if (formData.email.length === 0) return toast.error("Email is required");
    if (formData.password.length === 0)
      return toast.error("password is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");
    if (formData.password.length < 6)
      return toast.error("password must be at least 6 characters");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataValid = validDataForm();
    console.log(formData);
    if (dataValid === true) {
      login(formData);
    }
  };



  return (
    <div className="min-h-screen grid lg:grid-cols-2 mt-3">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Hand  className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2 ">Login</h1>
              <p className="text-base-content/60">Welcome Again</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium ">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className="input input-bordered w-full pl-10"
                  placeholder="Enter Your Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium ">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPwd ? "text" : "password"}
                  className="input input-bordered w-full pl-10"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <div
                  className="absolute right-2 top-2 p-1 cursor-pointer hover:opacity-70 transition"
                  onClick={() => setShowPwd(!showPwd)}
                >
                  {showPwd ? <EyeOff /> : <Eye />}
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-active btn-primary w-full "
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>
          <div className="text-center">
            <p className="text-base-content/60">
              You don't have an account ?{" "}
              <Link to={"/signup"} className="link link-primary">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>

      <AuthImagePattern
        title={"Welcome back!"}
        subtitle={"Sign in to continue your conversations and catch up with your messages."}
      />
    </div>
  );
};

export default LoginPage;
