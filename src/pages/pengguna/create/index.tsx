import { FC, useState } from "react";
import axios, { AxiosError } from "axios";
import { mutate } from "swr";
import { SubmitHandler, useForm } from "react-hook-form";
import Input from "@/pages/components/inputs/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@/pages/components/buttons/Button";

interface UserCreateProps {
  onClose: () => void;
  onSucsess: () => void;
}

const schema = yup.object().shape({
  name: yup
    .string()
    .required("tidak boleh kosong")
    .min(3, "judul minimal 3 karakter"),
  password: yup.string().required(),
  email: yup.string().required(),
  role: yup.string().required(),
  nomor_telepon: yup.string().required().max(13, "maksimal 13 karakter"),
  lulusan: yup.string(),
  alamat: yup.string().required(),
});

type FormData = yup.InferType<typeof schema>;

const Create: FC<UserCreateProps> = ({ onClose, onSucsess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const { name, email, password, role, nomor_telepon, alamat } = data;

    setIsLoading(true); // Set loading state to true
    setError(null);

    try {
      await axios.post(`/api/user`, {
        name,
        email,
        password,
        role,
        nomor_telepon,
        alamat,
      });

      mutate("/api/user");
      mutate(`/api/userimg`);
      mutate(`/api/user/getadmin`);
      onClose(); // Set loading state to false
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

          setError(`An error occurred: ${errorMessage}`);
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {/* Error message */}
      {error && <p className="text-red-500">{error}</p>}
      <Input
        id="name"
        label="Name"
        type="text"
        register={{ ...register("name") }}
        errors={errors}
      />
      {errors.name && <p className="text-red-500">{errors.name.message}</p>}

      <Input
        id="email"
        label="Email"
        type="email"
        register={{ ...register("email") }}
        errors={errors}
      />
      {errors.email && <p className="text-red-500">{errors.email.message}</p>}

      <Input
        id="password"
        label="Password"
        type="password"
        register={{ ...register("password") }}
        errors={errors}
      />
      {errors.password && (
        <p className="text-red-500">{errors.password.message}</p>
      )}

      <div className="flex flex-col">
        <label htmlFor="role">Role</label>
        <select
          id="role"
          {...register("role")}
          defaultValue={"SUPER"}
          className="bg-Neutral-95 rounded-full py-2 px-4 outline-none appearance-none"
        >
          <option value="SUPER">SUPER ADMIN</option>
          <option value="ADMIN">ADMIN</option>
          <option value="TENTOR">TENTOR</option>
        </select>
      </div>

      <Input
        id="nomor_telepon"
        label="Nomor Telepon"
        type="number"
        register={{ ...register("nomor_telepon") }}
        errors={errors}
      />
      {errors.nomor_telepon && (
        <p className="text-red-500">{errors.nomor_telepon.message}</p>
      )}

      <Input
        id="lulusan"
        label="Lulusan"
        type="text"
        register={{ ...register("lulusan") }}
        errors={errors}
      />
      {errors.lulusan && (
        <p className="text-red-500">{errors.lulusan.message}</p>
      )}

      <Input
        id="alamat"
        label="Alamat"
        type="text"
        register={{ ...register("alamat") }}
        errors={errors}
      />
      {errors.alamat && <p className="text-red-500">{errors.alamat.message}</p>}

      {/* Buat selected berisi SUPER ADMIN dan TENTOR */}
      <div className="flex flex-row justify-end">
        <Button
          type="submit"
          bgColor="bg-Tertiary-50"
          brColor=""
          label="Konfirmasi"
          textColor="text-Neutral-100"
          withBgColor
        />
      </div>
    </form>
  );
};

export default Create;
