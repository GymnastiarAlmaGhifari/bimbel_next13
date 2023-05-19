"use client";

import ButtonInAbout from "@/pages/components/buttons/ButtonInAbout";

export default function listButtonSosialMedia() {
  return (
    <ul className="flex gap-4">
      <li>
        <ButtonInAbout
          fileLogo="instagram.svg"
          link="https://www.fiverr.com/orders/FO51C09B85685/activities"
          text="Instagram Logo"
        />
      </li>
      <li>
        <ButtonInAbout
          fileLogo="facebook.svg"
          link="https://www.fiverr.com/orders/FO51C09B85685/activities"
          text="Facebook Logo"
        />
      </li>
      <li>
        <ButtonInAbout
          fileLogo="twitter.svg"
          link="https://www.fiverr.com/orders/FO51C09B85685/activities"
          text="Twitter Logo"
        />
      </li>
      <li>
        <ButtonInAbout
          fileLogo="whatsapp.svg"
          link="https://www.fiverr.com/orders/FO51C09B85685/activities"
          text="Whatsapp Logo"
        />
      </li>
    </ul>
  );
}
