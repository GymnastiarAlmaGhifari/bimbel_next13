"use client";

import Image from "next/image";

interface ButtonProps {
  link: string;
  fileLogo: string;
  text: string;
}

const ButtonInAbout: React.FC<ButtonProps> = ({ link, fileLogo, text }) => {
  function ToSocialMedia() {
    window.open(link);
  }
  return (
    <button
      onClick={ToSocialMedia}
      className="hover:bg-Primary-95 p-2 rounded-lg"
    >
      <Image src={fileLogo} alt={text} width={40} height={40} />
    </button>
  );
};

export default ButtonInAbout;
