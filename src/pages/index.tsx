"use client";
import { signIn } from "next-auth/react";
import Header from "./landingPage/Header";
import AboutUs from "./landingPage/About";
import Program from "./landingPage/Program";
import Benefit from "./landingPage/Benefit";
import DetailProgram from "./landingPage/DetailProgram";
import Diskon from "./landingPage/Diskon";
import Login from "./landingPage/Login";
import NavbarLanding from "./landingPage/NavbarLanding";

export default function Home() {
  const consolLogAgim = () => {
    console.log("Agim");
  };

  return (
    <div className="font-mulish ">
      <NavbarLanding />
      <Header />
      <AboutUs />
      <Program />
      <Benefit />
      <Diskon />
      <Login />
    </div>
  );
}
