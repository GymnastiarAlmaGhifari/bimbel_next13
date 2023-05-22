import { Inter } from "next/font/google";
import Login from "./Login";
import Link from "next/link";
import Button from "../components/buttons/Button";
import ListButtonSosialMediaFooter from "../components/landingPage/ListButtonSosialMediaFooter";

export default function Footer() {
  return (
    <div className="relative flex flex-col h-max py-4 bg-Neutral-20 px-16">
      <div className="flex justify-end gap-4 items-center">
        <ListButtonSosialMediaFooter />
        <Link
          href={"/login"}
          className="p-2 w-52 bg-Neutral-40 rounded-full font-semibold text-Neutral-100 text-center hover:text-Neutral-20 hover:bg-Neutral-100 hover:border-none h-10 box-border"
        >
          Login Untuk Admin
        </Link>
      </div>
      <p className="block text-center text-Neutral-100 text-sm">
        © Copyright 2023, Bimbel Linear
      </p>
    </div>
  );
}
