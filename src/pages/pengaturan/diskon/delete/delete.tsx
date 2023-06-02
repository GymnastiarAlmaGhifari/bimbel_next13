import Button from "@/pages/components/buttons/Button";
import axios, { AxiosError } from "axios";
import React, { FC, useState } from "react";
import { mutate } from "swr";

interface DeleteDiskonProps {
  diskonId: string;
  data: any;
  onClose: () => void;
  onSucsess: () => void;
}

const DeleteDiskon: FC<DeleteDiskonProps> = ({
  diskonId,
  data,
  onClose,
  onSucsess,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const [errorr, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    const { nama_diskon } = data;

    setIsLoading(true); // Set loading state to true

    try {
      const res = await axios.delete(`/api/diskon/${diskonId}`, {});

      console.log("res", res);

      mutate("/api/diskon");
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
      onClose(); // Set loading state to false
      onSucsess();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {errorr && (
        <div className="bg-Error-50 border border-Error-60 rounded-md p-4">
          <div className="flex gap-2 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-Error-60"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 7a1 1 0 112 0v4a1 1 0 11-2 0V7zm1 9a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-Error-60 text-sm">{errorr}</p>
          </div>
        </div>
      )}
      <p className="text-center">
        Apakah Anda yakin untuk menghapus diskon{" "}
        <span
          className="font-semibold
        "
        >
          {data?.nama_diskon}
        </span>{" "}
        secara permanen?
      </p>
      <div className="flex gap-4">
        <Button
          center
          bgColor="bg-Neutral-70"
          brColor=""
          label="Batal"
          textColor="text-Neutral-30"
          type="button"
          onClick={onClose}
          widthAuto
        />
        <button onClick={onSubmit} disabled={isLoading} className="w-full">
          <Button
            bgColor="bg-Error-50"
            center
            withBgColor
            brColor=""
            label={
              isLoading ? (
                <div className="flex gap-2 items-center">
                  <div className="inline-block h-4 w-4 animate-spin rounded-full border-[3px] border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_3s_linear_infinite]"></div>
                  <span>Loading</span>
                </div>
              ) : (
                "Hapus"
              )
            }
            textColor="text-Neutral-100"
            type="button"
            widthAuto
          />
        </button>
      </div>
    </div>
  );
};

export default DeleteDiskon;
