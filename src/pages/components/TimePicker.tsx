import { useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import Button from "./buttons/Button";
import { string } from "yup";

interface TimePickerProps {
  label: string;
  onTimeChange?: (hour: string, minute: string) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ onTimeChange, label }) => {
  const [hour, setHour] = useState("00");
  const [minute, setMinute] = useState("00");
  const [menitbreak, setmenitbreak] = useState(0);
  const [jambreak, setjambreak] = useState(0);
  const [open, setopen] = useState(false);

  const handleHourChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedHour = event.target.value;
    setHour(selectedHour);
    // onTimeChange(selectedHour, minute);
  };

  const handleMinuteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMinute = event.target.value;
    setMinute(selectedMinute);
    // onTimeChange(hour, selectedMinute);
  };

  const formatNumber = (num: string) => {
    return num.toString().padStart(2, "0");
  };

  // const renderOptions = (start: string, end: string) => {
  //   const options = [];
  //   for (let i = start; i <= end; i++) {
  //     options.push(
  //       <option key={i} value={i}>
  //         {formatNumber(i)}
  //       </option>
  //     );
  //   }
  //   return options;
  // };

  // const formatTime = (hour: string, minute: string) => {
  //   const date = new Date();
  //   date.setHours(hour);
  //   date.setMinutes(minute);
  //   return date.toLocaleString("en-US", {
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   });
  // };

  const handleTimeChange = (hour: string, minute: string) => {
    // const formattedTime = formatTime(hour, minute);
    // console.log(`Selected time: ${formattedTime}`);
    // onTimeChange(hour, minute);
  };

  function click() {
    setopen(!open);
  }

  function kurangJam() {
    if (jambreak > 0) {
      setjambreak(jambreak - 1);
    }
  }
  function tambahJam() {
    if (jambreak < 24) {
      setjambreak(jambreak + 1);
    }
  }
  function kurangMenit() {
    if (menitbreak > 0) {
      setmenitbreak(menitbreak - 1);
    }
  }
  function tambahMenit() {
    if (menitbreak < 60) {
      setmenitbreak(menitbreak + 1);
    }
  }
  function setJamMenit() {
    const minuteValue = menitbreak < 10 ? `0${menitbreak}` : `${menitbreak}`;
    const hourValue = jambreak < 10 ? `0${jambreak}` : `${jambreak}`;
    setHour(hourValue);
    setMinute(minuteValue);
    // console.log(hourValue);
    setopen(!open);
  }

  // const handleChangeHour = () => {
  //   // const valueInt = parseInt(event?.target.value);
  //   setjambreak(event?.target.value);
  //   console.log(setjambreak);
  // };
  // const handleChangeMinute = () => {
  //   setmenitbreak(event?.target.value);
  // };

  return (
    // <div className="flex py-2 space-x-1 px-4  rounded-full w-max font-semibold ">
    //   <select
    //     value={hour}
    //     onChange={handleHourChange}
    //     className="px-2 py-1 rounded-full focus:outline-none appearance-none scrollbar-none ring-1 ring-Primary-30 text-Primary-30 focus:bg-Primary-30 focus:text-Neutral-100"
    //   >
    //     {renderOptions(0, 23)}
    //   </select>
    //   <span className="text-lg text-Primary-30">:</span>
    //   <select
    //     value={minute}
    //     onChange={handleMinuteChange}
    //     className="px-2 py-1 rounded-full focus:outline-none appearance-none scrollbar-none ring-1 ring-Primary-30 text-Primary-30 focus:bg-Primary-30 focus:text-Neutral-100"
    //   >
    //     {renderOptions(0, 59)}
    //   </select>
    // </div>
    <div className="flex flex-col gap-2 relative w-full">
      <label className="text-sm text-Primary-10">{label}</label>
      <div className=" flex flex-col gap-2">
        <div
          className={`px-4 py-2 w-full h-10 text-Primary-30  rounded-full ${open
            ? "border border-[2px] border-Primary-50 bg-Primary-95"
            : " bg-Neutral-95"
            } flex items-center space-x-1 cursor-pointer`}
          onClick={click}
        >
          <p className="inline-block">{hour}</p>
          <span className="text-Primary-30">:</span>
          <p className="inline-block">{minute}</p>
        </div>
        {open ? (
          <>
            <div className="flex w-max flex-col gap-2 bg-Neutral-100 py-2 px-4 ring-1 ring-Primary-50 rounded-lg translate-y-[48px] absolute">
              <div className="flex gap-2 items-center">
                <div className="h-max w-max py-2 p2 px-4">
                  <div className="flex flex-col gap-2 items-center">
                    <button
                      className="text-Neutral-100 text-Primary-30"
                      onClick={kurangJam}
                    >
                      <IoIosArrowUp size={24} />
                    </button>
                    <input
                      className="w-8 text-center text-Primary-20 font-bold text-lg outline-none"
                      type="number"
                      name=""
                      id=""
                      value={jambreak}
                      // onChange={handleChangeHour}
                      defaultValue={hour}
                    />
                    <button
                      className="text-Neutral-100 text-Primary-30"
                      onClick={tambahJam}
                    >
                      <IoIosArrowDown size={24} />
                    </button>
                  </div>
                </div>
                <span className="text-3xl font-bold text-Primary-20">:</span>
                <div className="h-max w-max py-2 p2 px-4">
                  <div className="flex flex-col gap-2 items-center">
                    <button
                      className="text-Neutral-100 text-Primary-30"
                      onClick={kurangMenit}
                    >
                      <IoIosArrowUp size={24} />
                    </button>
                    <input
                      className="w-8 text-center bg-transparent text-Primary-20 font-bold text-lg outline-none"
                      type="number"
                      name=""
                      id=""
                      value={menitbreak}
                      defaultValue={minute}
                    // onChange={handleChangeMinute}
                    />
                    <button
                      className="text-Neutral-100 text-Primary-30"
                      onClick={tambahMenit}
                    >
                      <IoIosArrowDown size={24} />
                    </button>
                  </div>
                </div>
              </div>
              <Button
                widthAuto
                center
                bgColor="bg-Primary-20"
                withBgColor
                brColor=""
                label="Set"
                textColor="text-Primary-90"
                type="button"
                onClick={setJamMenit}
              />
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default TimePicker;
