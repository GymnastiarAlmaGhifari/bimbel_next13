"use client";

import Image from 'next/image'

interface ButtonProps{
    link:string;
    fileLogo: string;
    text:string;
}

const ButtonInAbout: React.FC<ButtonProps> = ({
    link,
    fileLogo,
    text
}) => {
    function ToSocialMedia() {
        window.open(link);
      }
    return (
        <button onClick={ToSocialMedia}>
        <Image src={fileLogo} alt={text} width={24} height={24} />
      </button>
    )
}

export default ButtonInAbout;