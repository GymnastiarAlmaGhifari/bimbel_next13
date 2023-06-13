import { Inter } from "next/font/google";
import Login from "./Login";
import Link from "next/link";
import Button from "../components/buttons/Button";
import ListButtonSosialMediaFooter from "../components/landingPage/ListButtonSosialMediaFooter";

export default function Footer() {
  return (
    <div className="flex justify-between items-center h-max py-4 bg-Neutral-20 px-16 gap-4">
      <ListButtonSosialMediaFooter />
      <p className="block text-center text-Neutral-100 text-sm">
        © Copyright 2023, Bimbel Linear
      </p>
      {/* link to privacy police */}
      <Link href="/privacy-policy">
        <Button
          bgColor="bg-Neutral-100"
          brColor=""
          label="Privacy Policy"
          textColor="text-Neutral-100"
          type={"button"}
        />
      </Link>
    </div>
  );
}
