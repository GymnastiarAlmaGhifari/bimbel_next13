import axios, { AxiosError } from "axios";
import { mutate } from "swr";
import { SubmitHandler, useForm } from "react-hook-form";
import Input from "@/pages/components/inputs/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@/pages/components/buttons/Button";
import { FC, useState } from "react";
import { BiHide, BiShow } from "react-icons/bi";

interface ResetPassword {
    onClose: () => void;
    onSuccess: () => void;
    EmailAddress?: string
}

const schema = yup.object().shape({

    password: yup.string().required("tidak boleh kosong").min(8, "password minimal 8 karakter"),
    password_confirmation: yup.string()
        .required("tidak boleh kosong")
        .min(8, "password minimal 8 karakter")
        .oneOf([yup.ref('password')], 'password tidak sama'),
    // password lama
    password_lama: yup.string().required("tidak boleh kosong").min(8, "password minimal 8 karakter"),
});

type FormData = yup.InferType<typeof schema>;

const ResetPassword: FC<ResetPassword> = ({ onClose, onSuccess, EmailAddress }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

        // console.log(data);

        // console.log(EmailAddress);

        const { password, password_lama } = data;

        setError(null);

        try {
            await axios.post(`/api/user/ubahpassword`, {
                email: EmailAddress,
                password: password_lama,
                password_baru: password,
            });

            mutate(`/api/user`);
            onClose();
            onSuccess();
        } catch (error: any) {
            console.error(error);

            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                if (axiosError.response) {
                    console.log("Response data:", axiosError.response.data);
                    console.log("Response status:", axiosError.response.status);

                    const responseData = axiosError.response.data as { message: string };

                    // Extract the main error message from the response data
                    const errorMessage = responseData.message;

                    setError(`${errorMessage}`);
                } else if (axiosError.request) {
                    console.log("No response received:", axiosError.request);

                    const request = axiosError.request.toString();
                    setError(`No response received: ${request}`);
                } else {
                    console.log("Error setting up the request:", axiosError.message);

                    const request = axiosError.message.toString();
                    setError(`Error setting up the request: ${request}`);
                }
            } else {
                console.log("Error:", error.message);
                setError("An unknown error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const [showPasswordLama, setShowPasswordLama] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const togglePasswordConfirmationVisibility = () => {
        setShowPasswordConfirmation(!showPasswordConfirmation);
    };

    const togglePasswordLamaVisibility = () => {
        setShowPasswordLama(!showPasswordLama);
    };

    const passwordIcon = showPassword ? <BiHide /> : <BiShow />;
    const passwordConfirmationIcon = showPasswordConfirmation ? <BiHide /> : <BiShow />;
    const passwordLamaIcon = showPasswordLama ? <BiHide /> : <BiShow />;
    return (
        <div className="flex flex-col gap-6">
            {
                error && <p className="text-red-500 text-sm">{error}</p>
            }
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                {/* password lama */}
                <Input
                    id="password_lama"
                    label="Password Lama"
                    type={showPasswordLama ? "text" : "password"}
                    register={{ ...register("password_lama") }}
                    iconRight={passwordLamaIcon}
                    onIconRightClick={togglePasswordLamaVisibility}
                    errors={errors}
                />
                {
                    errors.password_lama && <p className="text-red-500 text-sm">{errors.password_lama.message}</p>
                }
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
                <div className="flex gap-4">
                    <Button
                        center
                        bgColor="bg-Neutral-70"
                        brColor=""
                        label="Batal"
                        textColor="text-Neutral-30"
                        type="button"
                        onClick={onClose}
                    />
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
            </form>
        </div>
    );
};

export default ResetPassword;
