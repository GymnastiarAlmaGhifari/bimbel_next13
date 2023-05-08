"use client"
import { signIn } from "next-auth/react";


export default function Home() {

  const consolLogAgim = () => {
    console.log("Agim");
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-Error-40">Hello World</h1>
      <div>
        <button onClick={() => signIn()}>Sign In</button>

      </div>
    </div>
  )
}
