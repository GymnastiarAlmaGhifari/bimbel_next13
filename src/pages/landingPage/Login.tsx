import Link from "next/link";
import Input from "../components/inputs/Input";
import Button from "../components/buttons/Button";

export default function Login() {
    const shadowStyle = {
        boxShadow: 'inset 3px 4px 5px rgba(255, 255, 255, 0.1), inset 1px 1px 0 rgba(255, 255, 255, .2), 4px 4px 5px rgba(0, 0, 0, 0.1)',
      };
    return(
        <>
            <Link
            href={"/login"}
            >
                <button
                
                className=""
                
                >
                    login
                </button>
            </Link>
        </>
        // <div className="h-screen flex  px-6 bg-gradient-to-b from-blue-400 to-teal-500">
        //     <div className="w-96 px-6 pt-6 pb-8 flex flex-col gap-4 bg-Neutral-100/10 m-auto rounded-lg" style={shadowStyle}>
        //         <h2 className="text-center text-3xl font-bold text-Neutral-100">Login</h2>
        //         <Input label="Email" required id="" register={Login} errors={Login}/>
        //         <Input label="Kata Sandi" required id="" register={Login} errors={Login} />
        //         <a href="" className=" text-right text-xs text-Neutral-100">lupa password?</a>
        //         <Button bgColor="bg-Primary-50" label="Masuk" onClick={Login}/>
        //     </div>
        // </div>
    );
}