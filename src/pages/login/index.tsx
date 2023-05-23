"use client";

import { signIn, useSession } from "next-auth/react";
import Router from "next/router";
import { useState } from "react";
import Input from "../components/inputs/Input";
import Button from "../components/buttons/Button";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // if (session) { existing session, redirect to home page }

  const { data: session } = useSession();

  if (session) {
    Router.push("/dashboard");
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/dashboard",
      });
      if (result?.error) {
        setError(result.error);
      } else {
        // Redirect to home page
        window.location.href = "/dashboard";
      }
    } catch (error) {
      const errorMessage = error as string;
      if (errorMessage) {
        const { email, password } = JSON.parse(errorMessage);
        if (email) {
          setError(email);
        } else if (password) {
          setError(password);
        } else {
          setError("Something went wrong. Please try again later.");
        }
      }
    }
  };
  const shadowStyle = {
    boxShadow:
      "inset 3px 4px 5px rgba(255, 255, 255, 0.1), inset 1px 1px 0 rgba(255, 255, 255, .2), 4px 4px 5px rgba(0, 0, 0, 0.1)",
  };

  return (
    <div className="h-screen flex  px-6 bg-gradient-to-b from-Tertiary-50 to-Primary-60 font-mulish">
      <div className="w-full max-w-md m-auto">
        <form
          onSubmit={handleSubmit}
          className="w-96 px-6 pt-6 pb-8 flex flex-col gap-2 bg-Neutral-100/10 rounded-lg"
          style={shadowStyle}
        >
          <div className="mb-4">
            <h2 className="text-center text-3xl font-bold text-Neutral-100">
              Login
            </h2>
            <label
              className="block text-sm font-bold mb-2 text-Neutral-100"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="bg-Neutral-95
              peer
              h-10
              w-full
              px-4
              py-2
              rounded-full
              outline-none
              transition
              box-border
              disabled:opacity-70
              disabled:cursor-not-allowed
              focus:border-[2px] focus:border-Primary-50 focus:bg-Primary-99"
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label
              className="block text-Neutral-100 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="bg-Neutral-95
              peer
              h-10
              w-full
              px-4
              py-2
              rounded-full
              outline-none
              transition
              box-border
              disabled:opacity-70
              disabled:cursor-not-allowed
              focus:border-[2px] focus:border-Primary-50 focus:bg-Primary-99"
              id="password"
              type="password"
              placeholder="******************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <p className="text-red-500 text-xs italic">{error}</p>
          <a
            className="inline-block align-baseline text-sm text-right text-Neutral-100 hover:text-blue-800"
            href="#"
          >
            Forgot Password?
          </a>
          <button
            className="bg-Primary-50 hover:bg-Primary-50 text-Neutral-100 font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
