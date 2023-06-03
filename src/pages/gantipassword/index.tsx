import axios, { AxiosError } from "axios";
import { mutate } from "swr";
import { SubmitHandler, useForm } from "react-hook-form";
import Input from "@/pages/components/inputs/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@/pages/components/buttons/Button";
import { FC, useState } from "react";
import { BiHide, BiShow } from "react-icons/bi";
import { useRouter } from 'next/router';




const schema = yup.object().shape({
    password: yup.string().required("tidak boleh kosong").min(8, "password minimal 8 karakter"),
    password_confirmation: yup.string()
        .required("tidak boleh kosong")
        .min(8, "password minimal 8 karakter")
        .oneOf([yup.ref('password')], 'password tidak sama'),
});

type FormData = yup.InferType<typeof schema>;

const ResetPassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { email } = router.query;

    // Gunakan email di halaman /gantipassword
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        const { password } = data;

        setError(null);

        try {
            await axios.post(`/api/user/resetpassword`, {
                email,
                password,
            });

            mutate(`/api/user`);

            // redirect back to login page
            router.push(`/login`);
        } catch (error: any) {

            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                if (axiosError.response) {


                    const responseData = axiosError.response.data as { message: string };

                    // Extract the main error message from the response data
                    const errorMessage = responseData.message;

                    setError(`${errorMessage}`);
                } else if (axiosError.request) {

                    const request = axiosError.request.toString();
                    setError(`No response received: ${request}`);
                } else {

                    const request = axiosError.message.toString();
                    setError(`Error setting up the request: ${request}`);
                }
            } else {
                setError("An unknown error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const togglePasswordConfirmationVisibility = () => {
        setShowPasswordConfirmation(!showPasswordConfirmation);
    };

    const passwordIcon = showPassword ? <BiHide /> : <BiShow />;
    const passwordConfirmationIcon = showPasswordConfirmation ? <BiHide /> : <BiShow />;

    const shadowStyle = {
        boxShadow:
            "inset 3px 4px 5px rgba(255, 255, 255, 0.1), inset 1px 1px 0 rgba(255, 255, 255, .2), 4px 4px 5px rgba(0, 0, 0, 0.1)",
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-b from-Tertiary-50 to-Primary-60 font-mulish relative ">

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-96 px-6 h-max pt-6 pb-8 flex flex-col gap-2 bg-Neutral-100/10 rounded-lg backdrop-blur absolute z-50"
                style={shadowStyle}
            >
                <div className="mb-2 space-y-5">
                    <h2 className="text-center text-3xl font-bold text-Neutral-100">Ganti Password</h2>
                    <Input
                        id="password"
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        register={{ ...register("password") }}
                        iconRight={passwordIcon}
                        onIconRightClick={togglePasswordVisibility}
                        errors={errors}
                    />
                    {
                        errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>
                    }
                    <Input
                        id="password_confirmation"
                        label="Konfirmasi Password"
                        type={showPasswordConfirmation ? "text" : "password"}
                        errors={errors}
                        register={{ ...register("password_confirmation") }}
                        iconRight={passwordConfirmationIcon}
                        onIconRightClick={togglePasswordConfirmationVisibility}
                    />
                    {
                        errors.password_confirmation && <p className="text-red-500 text-sm">{errors.password_confirmation.message}</p>
                    }
                    <div className="flex gap-4 mt-6 justify-end">
                        <Button
                            type="submit"
                            bgColor="bg-Tertiary-50"
                            brColor=""
                            label={
                                isLoading ? (
                                    <div className="flex gap-2 items-center">
                                        <div className="inline-block h-4 w-4 animate-spin rounded-full border-[3px] border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_3s_linear_infinite]"></div>
                                        <span>Loading</span>
                                    </div>
                                ) : (
                                    "Konfirmasi"
                                )
                            }
                            textColor="text-Neutral-100"
                            withBgColor
                        />
                    </div>
                </div>
                {
                    error && <p className="text-red-500 text-sm">{error}</p>
                }
            </form>
        </div>
    );
};

export default ResetPassword;
