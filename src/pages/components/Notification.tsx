import React, { FC, useState } from "react";
import { IoIosClose, IoIosNotifications } from "react-icons/io";
import CardNotification from "./card/CardNotification";
import Button from "./buttons/Button";
import { MdDelete } from "react-icons/md";

interface NotificationProps {}

const Notification: FC<NotificationProps> = ({}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
    console.log(open);
  };
  return (
    <div className="relative">
      <button
        className="h-12 w-12 relative flex items-center justify-center"
        onClick={handleClick}
      >
        <div className="text-Neutral-20">
          <IoIosNotifications size={40} />
        </div>
        <div className="h-6 w-6 bg-Error-50 rounded-full absolute flex items-center justify-center top-0 right-0 border-[2px] border-Neutral-100">
          <span className="text-xs font-semibold text-Neutral-100">10</span>
        </div>
      </button>
      {isOpen ? (
        <div className="absolute right-0 mt-1 flex flex-col bg-Neutral-100 w-[550px] py-2 rounded-lg border-[1px] border-Neutral-90 gap-2">
          <div className="flex justify-between items-center">
            <h1 className="ml-4 font-bold text-Primary-10">
              Notifiaction (10)
            </h1>
            <Button
              type="button"
              bgColor="bg-Neutral-90"
              brColor=""
              label=""
              icon={IoIosClose}
              noLabel
              textColor="text-Neutral-30"
              // onClick={onClose}
            />
          </div>
          <div className="flex flex-col h-96 overflow-y-auto scrollbar">
            <CardNotification />
            <CardNotification isRead />
            <CardNotification />
            <CardNotification isRead />
            <CardNotification />
            <CardNotification isRead />
            <CardNotification isRead />
            <CardNotification isRead />
            <CardNotification isRead />
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Notification;
