"use client";

import { useEffect, useState } from "react";
import Input from "../components/inputs/Input";
import Button from "../components/buttons/Button";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";

const NginputNgimel = () => {
    useEffect(() => {
        document.title = "Bimbel Linear/ Nginput Ngimel";
    });
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();

    // if (session) { existing session, redirect to home page }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // try axios /api/resetemail
        try {
            await axios.get(`/api/user/resetemail?email=${email}`);
            //    redirect to input OTP with next router
            router.push(`/OTP?email=${encodeURIComponent(email)}`);
        } catch (error: any) {
            console.error(error);

            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                if (axiosError.response) {
                    const responseData = axiosError.response.data as { message: string };

                    // Extract the main error message from the response data
                    const errorMessage = responseData.message;

                    setError(`${errorMessage}`);
                } else if (axiosError.request) {

                    const request = axiosError.request.toString();
                    setError(`${request}`);
                } else {

                    const request = axiosError.message.toString();
                    setError(`${request}`);
                }
            } else {
                console.log("Error:", error.message);
                setError("An unknown error occurred.");
            }
        }


    };
    const shadowStyle = {
        boxShadow:
            "inset 3px 4px 5px rgba(255, 255, 255, 0.1), inset 1px 1px 0 rgba(255, 255, 255, .2), 4px 4px 5px rgba(0, 0, 0, 0.1)",
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-b from-Tertiary-50 to-Primary-60 font-mulish relative ">
            <form
                onSubmit={handleSubmit}
                className="w-96 px-6 h-max pt-6 pb-8 flex flex-col gap-2 bg-Neutral-100/10 rounded-lg backdrop-blur
          absolute z-50"
                style={shadowStyle}
            >
                <div className="mb-2">
                    <h2 className="text-center text-3xl font-bold text-Neutral-100">
                        Input Email
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
                <p className="text-red-500 text-xs italic">{error}</p>
                <button
                    className="bg-Primary-50 hover:bg-Primary-50 text-Neutral-100 font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
                    type="submit"
                >
                    Konfirmasi
                </button>
            </form>

        </div>
    );
};

export default NginputNgimel;
