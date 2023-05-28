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
import Footer from "./landingPage/Footer";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    document.title = "Bimbel Linear";
  });
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
      <Footer />
    </div>
  );
}
