"use client";

import { useRef, FC } from "react";
import { Dialog } from "@headlessui/react";
import Button from "./buttons/Button";
import { IoIosClose } from "react-icons/io";

interface ModalDetailProps {
  children: React.ReactNode;
  onClose: () => void;
  onOpen: boolean;
  titleModal: string;
}
interface ModalProps {
  // children: React.ReactNode
  isVisible: boolean;
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

export const ModalDetail: FC<ModalDetailProps> = ({
  children,
  onClose,
  onOpen,
  titleModal,
}) => {
  return (
    <Dialog open={onOpen} onClose={() => { }} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="h-auto bg-Neutral-100 py-4 px-6 rounded-xl flex flex-col gap-4 w-1/2">
          <div className="flex flex-col">
            <div className="flex justify-between">
              <h1 className="text-xl font-bold text-Primary-10">
                {titleModal}
              </h1>
              <button
                onClick={onClose}
                className="text-Neutral-20 rounded-full inline-block p-1 hover:bg-Neutral-95">
                <IoIosClose size={24} />
              </button>
            </div>
          </div>
          <div>{children}</div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};