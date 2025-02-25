import React from "react";
import BookLogo from "../../icons";
import Register from "./Register";

function Login() {
  return (
    <>
      <div className="bg-pink-200 text-black h-[700px]">
        <div className="flex items-center justify-center pt-20 pb-10">
          <h1 className="text-4xl bg-blue-100 text-center">
            <BookLogo />
            <p>Web Bookstore</p>
          </h1>
        </div>
        <div className="pb-20">
          <h2 className="text-2xl text-center">Welcome to our bookstore</h2>
        </div>
        <div className=" bg-purple-100">
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
              <form className=" card-body flex flex-col items-center justify-center">
                <input
                  type="text"
                  placeholder="Username"
                  className="input input-bordered w-full"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="input input-bordered w-full"
                />
                <button className=" text-white btn btn-primary w-full">
                  Login
                </button>
                <div className="text-center opacity-50 cursor-pointer">
                  Forgot password?
                </div>
                <div className="divider my-0"></div>
                <div className=" flex items-center justify-center">
                  <p>Don't have account?</p>
                  <button
                    className="btn btn-secondary text-white rounded-md p-2 m-2"
                    type="button"
                    onClick={() =>
                      document.getElementById("register-form").showModal()
                    }
                  >
                    Register
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Divider */}
          <div className="divider my-0 bg-gray-500 h-1/2 w-screen flex justify-center"></div>

          {/* Register */}
          {/* <div>
            <h2 className="card-body text-2xl text-center">Register</h2>
            <form className="flex flex-col items-center justify-center">
              <input
                type="text"
                placeholder="username"
                className="border-2 border-black rounded-md p-2 m-2 input input-bordered"
              />
              <input
                type="password"
                placeholder="Password"
                className="border-2 border-black rounded-md p-2 m-2 input input-bordered"
              />
              <button className="btn btn-secondary text-white rounded-md p-2 m-2">
                Register
              </button>
            </form>
          </div> */}
        </div>
      </div>
      <dialog id="register-form" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        onClick={e=> document.getElementById('register-form').close()}>✕</button>
          <Register/>
        </div>
      </dialog>
    </>
  );
}

export default Login;
