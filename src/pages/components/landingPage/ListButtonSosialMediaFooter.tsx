import React from "react";
import {
  IoLogoWhatsapp,
  IoLogoInstagram,
  IoLogoTwitter,
  IoLogoFacebook,
} from "react-icons/io";
import Button from "../buttons/Button";

type Props = {};

const ListButtonSosialMediaFooter = (props: Props) => {
  return (
    <div className="flex gap-1">
      <Button
        bgColor="bg-Neutral-100"
        brColor=""
        label=""
        textColor="text-Neutral-100"
        type={"button"}
        noLabel
        icon={IoLogoInstagram}
      />
      <Button
        bgColor="bg-Neutral-100"
        brColor=""
        label=""
        textColor="text-Neutral-100"
        type={"button"}
        noLabel
        icon={IoLogoFacebook}
      />
      <Button
        bgColor="bg-Neutral-100"
        brColor=""
        label=""
        textColor="text-Neutral-100"
        type={"button"}
        noLabel
        icon={IoLogoTwitter}
      />
      <Button
        bgColor="bg-Neutral-100"
        brColor=""
        label=""
        textColor="text-Neutral-100"
        type={"button"}
        noLabel
        icon={IoLogoWhatsapp}
      />
    </div>
  );
};

export default ListButtonSosialMediaFooter;
