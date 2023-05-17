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
});

type FormData = yup.InferType<typeof schema> & {
  image: FileList;
};

const UserEdit: FC<UserEditProps> = ({ userId, onClose, onSucsess, data }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const { name, email, role, nomor_telepon, alamat } = data;

    setIsLoading(true); // Set loading state to true
    const formData = new FormData();
    formData.append("image", data.image[0]);
    try {
      await axios.post("/api/userimg", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          // from : formData . image
          from: userId,
        },
      });
      await axios.put(`/api/user/${userId}`, {
        name,
        email,
        role,
        nomor_telepon,
        alamat,
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
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <>
        {isLoading && <div className="loader">Loading...</div>}

        {!isLoading && (
          <>
            <div className="flex gap-10">
              <div className="flex flex-col gap-4">
                {data?.image && (
                  <div className="bg-green-500">
                    <Image
                      src={data.image}
                      alt="Gambar"
                      width={200}
                      height={300}
                      loader={({ src }) => `${src}?cache-control=no-store`}
                    />
                  </div>
                )}
                <div>
                  <label
                    className="inline-block bg-Tertiary-50 text-Neutral-100 flex gap-2 justify-center py-2 rounded-full"
                    htmlFor="image"
                  >
                    <IoMdCloudUpload size={24} />{" "}
                    <p className="font-semibold">Pilih Gambar</p>
                  </label>
                  <input
                    className="hidden"
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
                    accept="image/jpeg, image/png , image/jpg"
                  />
                  {errors.image && (
                    <p className="text-red-500">{errors.image.message}</p>
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
                  <div className="flex flex-col">
                    <label htmlFor="role">Role</label>
                    <select
                      id="role"
                      {...register("role")}
                      defaultValue={data?.role}
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

                <div className="flex flex-row justify-end gap-4 ">
                  <Button
                    type="button"
                    bgColor="bg-Neutral-70"
                    brColor=""
                    onClick={onClose}
                    label="Batal"
                    textColor="text-Neutral-30"
                  />
                  <Button
                    type="submit"
                    bgColor="bg-Tertiary-50"
                    brColor=""
                    label="Konfirmasi"
                    textColor="text-Neutral-100"
                    withBgColor
                  />
                </div>
              </div>
            </div>
            {/* <button type="submit">Konfirmasi</button> */}
          </>
        )}
      </>
    </form>
  );
};

export default UserEdit;
