"use client";

import { useRef, FC } from "react";
import { Dialog } from "@headlessui/react";
import Button from "../buttons/Button";
import { IoIosClose } from "react-icons/io";
import { HiOutlineCheck } from "react-icons/hi";

interface ModalDetailProps {
  children: React.ReactNode;
  onClose: () => void;
  // titleModal: string atau buatmenjadi agim ${titleModal}
  titleModal: string;
  wAuto?: boolean;
  silang?: boolean;
  center?: boolean;
}
interface ModalProps {
  // children: React.ReactNode
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

interface ModalHapusProps {
  // children: React.ReactNode
  onClose: () => void;
  children: React.ReactNode;
}
interface ModalSuccesProps {
  label: string;
  onClose: () => void;
  children: React.ReactNode;
}
const Modal: FC<ModalProps> = ({ isVisible, onClose, children }) => {
  if (!isVisible) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
        <div className="w-[600px] flex flex-col">
          {/* onClose button */}

          <button className="self-end mr-4 mt-4" onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="bg-white p-2 rounded">{children}</div>
        </div>
      </div>
    </>
  );
};

export default Modal;

export const ModalHapus: FC<ModalHapusProps> = ({ children, onClose }) => {
  return (
    <Dialog open={true} onClose={() => {}} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="h-auto bg-Neutral-100 py-4 px-6 rounded-xl flex flex-col gap-4 w-1/4">
          <div className="flex flex-col"></div>
          <div>{children}</div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
export const ModalDetail: FC<ModalDetailProps> = ({
  children,
  wAuto,
  onClose,
  titleModal,
  silang,
  center,
}) => {
  return (
    <Dialog open={true} onClose={() => {}} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel
          className={`h-auto bg-Neutral-100 py-4 px-6 rounded-xl flex flex-col gap-4 ${
            wAuto ? "w-max" : "w-1/2"
          }`}
        >
          <div className="flex flex-col">
            {center ? (
              <div className="flex justify-center">
                <h1 className="text-xl font-bold text-Primary-10">
                  {titleModal}
                </h1>
              </div>
            ) : (
              <div className="flex justify-between">
                <h1 className="text-xl font-bold text-Primary-10">
                  {titleModal}
                </h1>
                {silang ? (
                  <></>
                ) : (
                  <Button
                    type="button"
                    bgColor="bg-Neutral-90"
                    brColor=""
                    label=""
                    icon={IoIosClose}
                    noLabel
                    textColor="text-Neutral-30"
                    onClick={onClose}
                  />
                )}
              </div>
            )}
          </div>
          <div>{children}</div>

          <div className="flex justify-end"></div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export const ModalSucces: FC<ModalSuccesProps> = ({
  // children,
  label,
}) => {
  return (
    // <div className="h-max w-96 overflow-hidden bg-red-500 right-8 p-4 absolute z-50">
    <div className="flex gap-4 py-2 px-4 absolute bg-Neutral-100 z-50 right-2 w-96 items-center top-2 rounded-lg shadow-[0px_4px_10px_0px_rgba(101,186,177,0.3)] succesmodalanimation animate-[succesmodalanimation_ease-in-out] duration-10000">
      <div className="p-2 bg-Primary-40 rounded-full text-Neutral-100">
        <HiOutlineCheck size={30} />
      </div>
      <div className="">Berhasil!!!</div>
    </div>
    // </div>
  );
};
