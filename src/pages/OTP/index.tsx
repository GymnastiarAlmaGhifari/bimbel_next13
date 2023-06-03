import { useEffect, useState, useRef } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";

const OTP = () => {


    useEffect(() => {
        document.title = "Bimbel Linear/ Nginput Ngimel";
    });
    const router = useRouter();
    const { email } = router.query;


    const [otp, setOTP] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState<string | null>(null);

    const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const inputValue = e.target.value;
        const formattedValue = inputValue
            .replace(/[^0-9]/g, "") // Remove non-numeric characters
            .slice(0, 1); // Limit to maximum 1 digit

        const newOTP = [...otp];
        newOTP[index] = formattedValue;
        setOTP(newOTP);

        // Auto focus to next input when the current input is filled
        if (formattedValue.length === 1 && index < 5) {
            otpRefs[index + 1].current?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text/plain");

        const formattedValue = pastedData
            .replace(/[^0-9]/g, "") // Remove non-numeric characters
            .slice(0, 6); // Limit to maximum 6 digits

        const newOTP = formattedValue.split("").map((digit) => digit || "");
        setOTP(newOTP);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const OTPValue = Number(otp.join(""));

        try {
            await axios.post(`/api/user/resetemail`, {
                OTP: OTPValue,
            });

            const encodedEmail = encodeURIComponent(String(email));

            // Redirect to the gantipassword page with the encoded email
            router.push(`/gantipassword?email=${encodedEmail}`);


        } catch (error: any) {

            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                if (axiosError.response) {
                    const responseData = axiosError.response.data as { message: string };
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
                setError("An unknown error occurred.");
            }
        }
    };

    const otpRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ];

    const shadowStyle = {
        boxShadow:
            "inset 3px 4px 5px rgba(255, 255, 255, 0.1), inset 1px 1px 0 rgba(255, 255, 255, .2), 4px 4px 5px rgba(0, 0, 0, 0.1)",
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-b from-Tertiary-50 to-Primary-60 font-mulish relative ">
            <form
                onSubmit={handleSubmit}
                className="w-96 px-6 h-max pt-6 pb-8 flex flex-col gap-2 bg-Neutral-100/10 rounded-lg backdrop-blur absolute z-50"
                style={shadowStyle}
            >
                <div className="mb-2">
                    <h2 className="text-center text-3xl font-bold text-Neutral-100">Input OTP</h2>
                    <label className="block text-sm font-bold mb-2 text-Neutral-100" htmlFor="otp">
                        OTP
                    </label>
                    <div className="flex justify-center">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                className="bg-Neutral-95 peer h-10 w-10 mx-1 px-2 rounded-lg text-center outline-none transition box-border disabled:opacity-70 disabled:cursor-not-allowed focus:border-[2px] focus:border-Primary-50 focus:bg-Primary-99"
                                type="number"
                                maxLength={1}
                                value={digit || ""}
                                onChange={(e) => handleOTPChange(e, index)}
                                onPaste={handlePaste}
                                ref={otpRefs[index]}
                            />
                        ))}
                    </div>
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

export default OTP;
