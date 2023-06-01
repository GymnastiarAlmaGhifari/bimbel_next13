import { FC, useEffect, useRef, useState } from "react";
import axios, { AxiosError } from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import Input from "@/pages/components/inputs/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import fetcher from "@/libs/fetcher";
import Button from "@/pages/components/buttons/Button";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useSession } from "next-auth/react";
import useSWR, { mutate } from "swr";
import { BiHide, BiShow } from "react-icons/bi";

interface UserCreateProps {
  onClose: () => void;
  onSucsess: () => void;
}

interface Mapel {
  id: string;
  nama_mapel: string;
  kelas: {
    id: string;
  };
}

const schema = yup.object().shape({
  name: yup
    .string()
    .required("tidak boleh kosong")
    .min(3, "nama minimal 3 karakter"),
  password: yup.string().required("tidak boleh kosong").min(8, "minimal 8 karakter").max(20, "maksimal 20 karakter"),
  email: yup.string().required(),
  role: yup.string().required(),
  mapel: yup.string().required(),
  nomor_telepon: yup.string().required().max(13, "maksimal 13 karakter").min(12, "minimal 10 karakter"),
  lulusan: yup.string(),
  alamat: yup.string().required(),
});

type FormData = yup.InferType<typeof schema>;

const Create: FC<UserCreateProps> = ({ onClose, onSucsess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isListOpenRole, setIsListOpenRole] = useState(false);
  const [isListOpenMapel, setIsListOpenMapel] = useState(false);

  const componentRef = useRef<HTMLUListElement>(null);

  const { data: session } = useSession();
  const { data: mapel, error: errorMapel } = useSWR<Mapel[]>(
    "api/mapel",
    fetcher,
    {}
  );

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const passwordIcon = showPassword ? <BiHide /> : <BiShow />;


  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const selectrole = (role: string) => {
    setValue("role", role);
    setIsListOpenRole(false);
  };

  const selectMapel = (mapel: string) => {
    setValue("mapel", mapel);
    setIsListOpenMapel(false);
  };

  const roleOptions = [
    { value: "SUPER", label: "Super Admin" },
    { value: "ADMIN", label: "Admin" },
    { value: "TENTOR", label: "Tentor" },
  ];

  useEffect(() => {
    // Menangani klik di luar komponen
    const handleOutsideClick = (event: any) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target)
      ) {
        setIsListOpenRole(false);
        setIsListOpenMapel(false);
      }
    };

    // Menambahkan event listener ketika komponen di-mount
    document.addEventListener("mousedown", handleOutsideClick);

    // Membersihkan event listener ketika komponen di-unmount
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [setIsListOpenRole, setIsListOpenMapel, componentRef]);

  const [checkValue, setCheckValue] = useState<string>("");
  const [checkValueUser, setCheckValueUser] = useState<string>("");

  const toggleListRole = () => {
    setIsListOpenRole(!isListOpenRole);
  };

  const toggleListMapel = () => {
    setIsListOpenMapel(!isListOpenMapel);
  };

  let filteredMapel = mapel;

  if (checkValue) {
    filteredMapel = mapel?.filter((mapelItem) => {
      return mapelItem.kelas.id === checkValue; // Add 'return' statement
    });
  }

  const handleCheckChangeUser = (value: string) => {
    setCheckValueUser(value);
  };

  const getRoleLabel = (value: string) => {
    const option = roleOptions.find((option) => option.value === value);
    return option ? option.label : "";
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const { name, email, password, mapel, role, nomor_telepon, alamat } = data;

    setIsLoading(true); // Set loading state to true
    setError(null);

    try {
      await axios.post(`/api/user`, {
        name,
        email,
        password,
        role,
        nomor_telepon,
        mapel_id: mapel,
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
      onSucsess();
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
        type={showPassword ? "text" : "password"}
        register={{ ...register("password") }}
        iconRight={passwordIcon}
        onIconRightClick={togglePasswordVisibility}
        errors={errors}
      />
      {errors.password && (
        <p className="text-red-500">{errors.password.message}</p>
      )}
      <div className="flex flex-col gap-2">
        <label htmlFor="" className="text-sm text-Primary-10">
          Level
        </label>

        <div className="relative flex flex-col gap-2">
          <button
            type="button"
            className={` w-full h-10 px-4 text-left outline-none rounded-full flex justify-between items-center ${isListOpenRole
              ? "border-[2px] border-Primary-50 bg-Primary-95"
              : "bg-Neutral-95"
              }`}
            onClick={toggleListRole}
          >
            {getRoleLabel(watch("role")) || "Pilih Role"}
            {isListOpenRole ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </button>
          {isListOpenRole && (
            <ul
              className="absolute w-full top-[44px] z-10 bg-Neutral-100 border-[2px] border-Primary-50 rounded-xl py-2 px-2 outline-none appearance-none flex flex-col gap-1"
              ref={componentRef}
            >
              {session?.user?.role === "SUPER" &&
                roleOptions.map((option) => (
                  <li key={option.value}>
                    <button
                      type="button"
                      className={`w-full text-left px-2 py-1 rounded-full ${watch("role") === option.value
                        ? "text-Primary-90 bg-Primary-20"
                        : "text-Primary-20 hover:bg-Primary-95"
                        }`}
                      onClick={() => selectrole(option.value)}
                    >
                      {option.label}
                    </button>
                  </li>
                ))}
              {session?.user?.role === "ADMIN" &&
                roleOptions
                  .filter((option) => option.value !== "SUPER")
                  .map((option) => (
                    <li key={option.value}>
                      <button
                        type="button"
                        className={`w-full text-left px-2 py-1 rounded-full ${watch("role") === option.value
                          ? "text-Primary-90 bg-Primary-20"
                          : "text-Primary-20 hover:bg-Primary-95"
                          }`}
                        onClick={() => selectrole(option.value)}
                      >
                        {option.label}
                      </button>
                    </li>
                  ))}
            </ul>
          )}
        </div>
        {errors.role && (
          <span className="text-red-500">{errors.role.message}</span>
        )}
      </div>
      <div className="flex flex-col gap-1 w-full">
        <label htmlFor="" className="text-sm text-Primary-10">
          Mapel
        </label>

        <div className="relative flex flex-col gap-2">
          <button
            type="button"
            className={` w-full h-10 px-4 text-left outline-none rounded-full flex justify-between items-center ${isListOpenMapel
              ? "border-[2px] border-Primary-50 bg-Primary-95"
              : "bg-Neutral-95"
              }`}
            onClick={toggleListMapel}
          >
            {/* buat label */}
            {watch("mapel") ? (
              mapel?.find((mapelItem) => mapelItem.id === watch("mapel"))
                ?.nama_mapel
            ) : (
              <span className="text-Neutral-300">Pilih Mapel</span>
            )}
            {isListOpenMapel ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </button>
          {isListOpenMapel && (
            <ul
              className="absolute w-full top-[44px] z-10 bg-Neutral-100 border-[2px] border-Primary-50 rounded-xl py-2 px-2 outline-none appearance-none flex flex-col gap-1"
              ref={componentRef}
            >
              {filteredMapel?.map((mapelItem) => (
                <li key={mapelItem.id}>
                  <button
                    type="button"
                    className={`w-full text-left px-2 py-1 rounded-full ${watch("mapel") === mapelItem.id
                      ? "text-Primary-90 bg-Primary-20"
                      : "text-Primary-20 hover:bg-Primary-95"
                      }`}
                    onClick={() => {
                      selectMapel(mapelItem.id);
                      handleCheckChangeUser(mapelItem.id);
                    }}
                  >
                    {mapelItem.nama_mapel}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {errors.mapel && (
          <span className="text-red-500">{errors.mapel.message}</span>
        )}
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
          // label ketika loading true maka labelnya jadi loading
          label={
            isLoading ? (
              <div className="flex gap-2 items-center">
                <div className="inline-block h-4 w-4 animate-spin rounded-full border-[3px] border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_3s_linear_infinite]"></div>
                <span>Loading</span>
              </div>
            ) : (
              "Simpan"
            )
          }
          textColor="text-Neutral-100"
          disabled={isLoading}
          withBgColor
        />
      </div>
    </form>
  );
};

export default Create;
