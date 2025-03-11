import React, { useState } from "react";
import BookLogo from "../../icons";
import Register from "./Register";
import { toast } from "react-toastify";
import useUserStore from "../stores/userStore";

function Login() {
  const [input, setInput] = useState({
    username: "",
    password: "",
  });

  const login = useUserStore((state) => state.login);

  const hdlChange = (e) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const hdlLogin = async (e) => {
    try {
      e.preventDefault();
      const { username, password } = input;

      // Validation
      if (username.trim() === "" || password.trim() === "") {
        toast.error("Please fill all required fields");
        return;
      }
      // Send API request to login
      let data = await login(input);
      console.log("Token after login:", data.token);
      // console.log("Role after login:", data.role);
      
      // Clear input fields
      setInput({ username: "", password: "" });

    } catch (err) {
      const errMsg = err.response?.data?.message || err.message;
      console.log(err);
      toast.error(errMsg);
    }
  };

  return (
    <div className=" text-gold h-[700px]">
      <div className="flex items-center justify-center pt-20 pb-10">
        <h1 className="text-4xl text-center">
          <BookLogo />
          <p className="text-gold">Welcome to 8 Lines? </p>
        </h1>
      </div>
      <div className="pb-20">
        <h2 className="text-2xl text-center">"Journey knows no limits—except those set by imagination."</h2>
        <h2 className="text-xl text-center">- Visarut, Founder of '8 Lines?' </h2>
      </div>
      <div className="bg-purple-100">
        {/* Description */}
        <div className="flex items-center justify-center">
          <div className="bg-orange-200 basis-3/5 text-center">
            <p>Description head</p>
            <div>
              <p className="text-2xl text-center">Description</p>
            </div>
          </div>
          {/* Login */}
          <div className="bg-green-200 basis-2/5">
            <form
              className="card-body flex flex-col items-center justify-center text-white"
              onSubmit={hdlLogin}
            >
              <input
                type="text"
                placeholder="Username"
                className="input input-bordered w-full"
                name="username"
                value={input.username}
                onChange={hdlChange}
              />
              <input
                type="password"
                placeholder="Password"
                className="input input-bordered w-full"
                name="password"
                value={input.password}
                onChange={hdlChange}
              />
              <button type="submit" className="text-white btn btn-primary w-full">
                Login
              </button>
              <div className="text-center opacity-50 cursor-pointer text-black">
                Forgot password?
              </div>
              <div className="divider my-0"></div>
              <div className="flex items-center justify-center text-black">
                <p>Don't have an account?</p>
                <button
                  className="btn btn-secondary text-white rounded-md p-2 m-2"
                  type="button"
                  onClick={() => document.getElementById("register-form").showModal()}
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="divider my-0 bg-gray-500 h-1/2 w-screen flex justify-center"></div>
      </div>

      {/* Register Modal */}
      <dialog id="register-form" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => document.getElementById("register-form").close()}
          >
            ✕
          </button>
          <Register />
        </div>
      </dialog>
    </div>
  );
}

export default Login;
