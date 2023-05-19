import { FC, useState } from "react";
import axios from "axios";
import { mutate } from "swr";
import { SubmitHandler, useForm } from "react-hook-form";
import Input from "@/pages/components/inputs/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@/pages/components/buttons/Button";
import Image from "next/image";
import { IoMdCloudUpload } from "react-icons/io";

interface UserEditProps {
  userId: string;
  data: any;
  onClose: () => void;
  onSucsess: () => void;
}

const schema = yup.object().shape({
  name: yup
    .string()
    .required("tidak boleh kosong")
    .min(3, "judul minimal 3 karakter"),
  email: yup.string().required(),
  role: yup.string().required(),
  nomor_telepon: yup.string().required().max(13, "maksimal 13 karakter"),
  lulusan: yup.string().max(13, "maksimal 13 karakter"),
  alamat: yup.string().required(),
  image: yup.mixed().required(),
});

type FormData = yup.InferType<typeof schema> & {
  image: FileList;
};

const UserEdit: FC<UserEditProps> = ({ userId, onClose, onSucsess, data }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  const [isListOpen, setIsListOpen] = useState(true);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const toggleList = () => {
    setIsListOpen(!isListOpen);
  };

  const selectRole = (role: string) => {
    setValue("role", role);
    setIsListOpen(false);
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const { name, email, role, lulusan, nomor_telepon, alamat, image } = data;

    if (!image || image.length === 0) {
      // alert("Please select an image");
      // return;
      setIsLoading(true); // Set loading state to true
      // const formData = new FormData();
      // formData.append("image", data.image[0]);
      try {
        await axios.put(`/api/user/noimg/${userId}`, {
          name,
          email,
          role,
          nomor_telepon,
          universitas: lulusan,
          alamat,
        });
        mutate(`/api/user/noimg/${userId}`);
        mutate(`/api/user`);
        mutate(`/api/user/getadmin`);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
        onClose();
        onSucsess();
      }
    } else if (image[0].size > 2000000) {
      setError("File terlalu besar, maksimal 2MB");
      return;
    } else {
      setIsLoading(true); // Set loading state to true
      const formData = new FormData();
      formData.append("image", data.image[0]);
      try {
        await axios.post("/api/user/userimg", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            // from : formDa ta . image
            from: userId,
          },
        });
        await axios.put(`/api/user/${userId}`, {
          name,
          email,
          role,
          nomor_telepon,
          universitas: lulusan,
          alamat,
        });
        await axios.put(`/api/user/userimg/${userId}`, {
          // name,
          // email,
          // role,
          // nomor_telepon,
          // universitas: lulusan,
          // alamat,
        });
        mutate("/api/user");
        mutate(`/api/userimg`);
        mutate(`/api/user/getadmin`);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
        onClose();
        onSucsess();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-10">
      <>
        {isLoading && <div className="loader">Loading...</div>}

        {!isLoading && (
          <>
            <div className="flex flex-col gap-6 w-[400px]">
              {previewImage ? (
                <div className="">
                  <Image
                    src={previewImage}
                    alt="Gambar"
                    width={200}
                    height={200}
                    loader={({ src }) => `${src}?cache-control=no-store`}
                  />
                </div>
              ) : (
                <div>
                  <Image
                    src={data?.image || "/img/user/default.png"}
                    alt="Gambar"
                    width={200}
                    height={200}
                    loader={({ src }) => `${src}?cache-control=no-store`}
                  />
                </div>
              )}
              <div>
                <label htmlFor="image" className="bg-gray-500 text-white px-4 py-2 rounded cursor-pointer flex items-center space-x-2">
                  <IoMdCloudUpload className="w-5 h-5" />
                  <span>Choose File</span>
                </label>
                <input
                  type="file"
                  id="image"
                  {...register("image", {
                    required: "Gambar wajib diunggah",
                    validate: {
                      fileSize: (value) => {
                        const fileSize = value[0]?.size || 0;
                        if (fileSize > 2 * 1024 * 1024) {
                          return "Ukuran file maksimum adalah 2MB";
                        }
                        return true;
                      },
                      fileType: (value) => {
                        const fileType = value[0]?.type || "";
                        if (!["image/jpeg", "image/png"].includes(fileType)) {
                          return "Hanya mendukung format JPEG atau PNG";
                        }
                        return true;
                      },
                    },
                  })}
                  accept="image/jpeg, image/png, image/jpg"
                  className="absolute w-0 h-0"
                  onChange={handleImageChange}
                />
                {/* <Image  src={data?.image} alt="Gambar" width={200} height={200} /> */}
                {errors?.image && (
                  <p className="text-red-500">{errors.image?.message}</p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-10 w-full">
              <div className="flex flex-col gap-4 w-full">
                <Input
                  id="name"
                  label="Nama"
                  type="text"
                  register={{ ...register("name") }}
                  errors={errors}
                  defaultValue={data?.name}
                />
                {errors.name && (
                  <p className="text-red-500">{errors.name.message}</p>
                )}
                <Input
                  id="email"
                  label="Email"
                  type="email"
                  register={{ ...register("email") }}
                  errors={errors}
                  defaultValue={data?.email}
                />
                <div className="relative">
                  <button
                    type="button"
                    className="bg-transparent border-none outline-none"
                    onClick={toggleList}
                  >
                    {watch('role') || 'Pilih peran'}
                  </button>
                  {isListOpen && (
                    <ul className="absolute left-0 right-0 z-10 bg-Neutral-95 rounded-full py-2 px-4 outline-none appearance-none focus:bg-Primary-95 focus:ring-1 focus:ring-Primary-50 hover:bg-none">
                      <li>
                        <button
                          type="button"
                          className={`${watch("role") === "SUPER" ? "text-Primary-10 bg-Primary-10" : "text-Primary-50 hover:bg-Primary-10"
                            }`}
                          onClick={() => selectRole("SUPER")}
                        >
                          SUPER ADMIN
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          className={`${watch("role") === "ADMIN" ? "text-Primary-10 bg-Primary-10" : "text-Primary-50 hover:bg-Primary-10"
                            }`}
                          onClick={() => selectRole("ADMIN")}
                        >
                          ADMIN
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          className={`${watch("role") === "TENTOR" ? "text-Primary-10 bg-Primary-10" : "text-Primary-50 hover:bg-Primary-10"
                            }`}
                          onClick={() => selectRole("TENTOR")}
                        >
                          TENTOR
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
                {errors.role && <span className="text-red-500">{errors.role.message}</span>}
                {/* <select
                    id="role"
                    {...register("role")}
                    defaultValue={data?.role}
                    className="bg-Neutral-95 rounded-full py-2 px-4 outline-none appearance-none focus:bg-Primary-95 focus:ring-1 focus:ring-Primary-50 "
                  >
                    <option value="SUPER">SUPER ADMIN</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="TENTOR">TENTOR</option>
                  </select> */}
              </div>

              <Input
                id="nomor_telepon"
                label="Nomor Telepon"
                type="number"
                register={{ ...register("nomor_telepon") }}
                errors={errors}
                defaultValue={data?.nomor_telepon}
              />
              <Input
                id="lulusan"
                label="Lulusan"
                type="text"
                register={{ ...register("lulusan") }}
                errors={errors}
                defaultValue={data?.universitas}
              />
              <Input
                id="alamat"
                label="Alamat"
                type="text"
                register={{ ...register("alamat") }}
                errors={errors}
                defaultValue={data?.alamat}
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}

            <div className="flex flex-row justify-end gap-4">
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
                center
                type="submit"
                bgColor="bg-Tertiary-50"
                brColor=""
                label="Konfirmasi"
                textColor="text-Neutral-100"
                withBgColor
              />
            </div>
          </>
        )}
      </>
    </form>
  );
}

export default UserEdit;
