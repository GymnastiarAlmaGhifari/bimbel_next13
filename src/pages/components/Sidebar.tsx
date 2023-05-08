// "use client"
// import { FC, useEffect, useState } from "react";
// import MenuItem, { MenuItemProps } from "./MenuItem";
// import { AiFillHome } from "react-icons/ai";
// import { MdCalendarToday } from "react-icons/md";
// import { useSession } from "next-auth/react";


// const Sidebar = () => {
//     // const [isOpen, setIsOpen] = useState(
//     //     localStorage.getItem("sidebar") === "true" ? true : false
//     // );

//     const [isOpen, setIsOpen] = useState(true);

//     const handleToggle = () => {
//         setIsOpen(!isOpen);
//     };

//     // useEffect(() => {
//     //     localStorage.setItem("sidebar", JSON.stringify(isOpen));
//     // }, [isOpen]);

//     const MenuSuper = [
//         { icon: AiFillHome, title: "Dashboard", href: `/dashboard`, isOpen: isOpen },
//         { icon: MdCalendarToday, title: "Jadwal", href: "/jadwal", isOpen: isOpen },
//         // { icon: MdCalendarToday, title: "Siswa", href: "/siswa", isOpen: isOpen },
//         // { icon: MdCalendarToday, title: "Kelompok", href: "/kelompok", isOpen: isOpen },
//         // { icon: MdCalendarToday, title: "Pengguna", href: "/pengguna", isOpen: isOpen },
//         // { icon: MdCalendarToday, title: "Pembayaran", href: "/pembayaran", isOpen: isOpen },
//         // { icon: MdCalendarToday, title: "Riwayat", href: "/riwayat", isOpen: isOpen },
//         // { icon: MdCalendarToday, title: "Pengaturan", href: "/pengaturan", isOpen: isOpen },
//     ] as MenuItemProps[];

//     const MenuTentor = [
//         { icon: AiFillHome, title: "Dashboard", href: `/dashboard`, isOpen: isOpen },
//         { icon: MdCalendarToday, title: "Jadwal", href: "/jadwal", isOpen: isOpen },
//     ] as MenuItemProps[];


//     const { data: session, status } = useSession();

//     return (
//         <div className="relative h-full">
//             <div
//                 className={`fixed top-0 left-0 w-64 h-full bg-gray-800 overflow-y-auto ease-in-out transition-all duration-300 z-30 ${isOpen ? "translate-x-0" : "translate-x-[-4rem]"}`
//                 }
//             >
//                 <div className="flex items-center justify-center mt-8">
//                     <div className="flex items-center">
//                         <span className="text-white text-2xl mx-2 font-semibold">Sistem Informasi</span>
//                     </div>
//                 </div>

//                 {/* button toggle */}
//                 <div className="flex items-center justify-center mt-8">
//                     <div className="flex items-center">
//                         <button
//                             className="text-white text-2xl mx-2 font-semibold"
//                             onClick={handleToggle}
//                         >
//                             {isOpen ? (
//                                 <svg
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     className="h-6 w-6 text-white"
//                                     fill="none"
//                                     viewBox="0 0 24 24"
//                                     stroke="currentColor"
//                                 >
//                                     <path
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                         strokeWidth="2"
//                                         d="M6 18L18 6M6 6l12 12"
//                                     />
//                                 </svg>
//                             ) : (
//                                 <svg
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     className="h-6 w-6 text-white"
//                                     fill="none"
//                                     viewBox="0 0 24 24"
//                                     stroke="currentColor"
//                                 >
//                                     <path
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                         strokeWidth="2"
//                                         d="M4 6h16M4 12h8m-8 6h16"
//                                     />
//                                 </svg>
//                             )}
//                         </button>
//                     </div>
//                 </div>
//                 <nav className="mt-10">
//                     {session?.user.role === "SUPER" && (
//                         <ul className="ml-4">
//                             {MenuSuper.map((menu, index) => (
//                                 <MenuItem key={index} {...menu} />
//                             ))}
//                         </ul>
//                     )}

//                     {session?.user.role === "TENTOR" && (
//                         <ul className="ml-4">
//                             {MenuTentor.map((menu, index) => (
//                                 <MenuItem key={index} {...menu} />
//                             ))}
//                         </ul>
//                     )}

//                 </nav>
//             </div>
//         </div>
//     );
// };

// export default Sidebar;

// // import Link from "next/link";
// // import React from "react";
// // import { AiFillHome } from "react-icons/ai";
// // import { MdCalendarToday } from "react-icons/md";
// // import MenuItem, { Menu } from "./MenuItem";

// // const menus = [
// //     { icon: AiFillHome, title: "Dashboard", href: "/dashboard" },
// //     { icon: MdCalendarToday, title: "Drivers", href: "/jadwal" },

// // ] as Menu[];


// // function MainMenu() {
// //     return (
// //         <div className="flex w-60 flex-none flex-col justify-between bg-black p-6 text-white">
// //             <div className="flex flex-col space-y-5">
// //                 {/* Logo */}
// //                 <div>

// //                 </div>

// //                 <div className="flex flex-col space-y-4">
// //                     <ul className="flex flex-col space-y-2">
// //                         {menus.map((menu, index) => (
// //                             <MenuItem
// //                                 key={index}
// //                                 title={menu.title}
// //                                 href={menu.href}
// //                                 icon={menu.icon}
// //                             />
// //                         ))}
// //                     </ul>

// //                     <hr className="ml-4 py-2 text-white/20" />

// //                     <div>
// //                         <p className="px-4 py-3 text-white/50">Report</p>

// //                     </div>
// //                 </div>
// //             </div>

// //             <div>

// //             </div>
// //         </div>
// //     );
// // }

// // export default MainMenu;

// import React from 'react'

// const Sidebar = () => {
//     return (
//         <div>

//         </div>
//     )
// }

// export default Sidebar

import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <div className="fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white z-50">
                <div className="px-4 py-3 border-b border-gray-700 flex justify-between items-center">
                    <span className="font-semibold text-xl">Sidebar</span>
                    <button onClick={toggleMenu} className="block ">
                        {isOpen ? (
                            <AiOutlineClose size={24} />
                        ) : (
                            <HiOutlineMenuAlt4 size={24} />
                        )}
                    </button>
                </div>
                <nav className={`${isOpen ? "" : ""} px-4 pt-6`}>
                    <ul>
                        <li>
                            <Link href="/dashboard">
                                <button
                                    className={`${router.pathname === "/dashboard" ? "text-blue-500" : ""
                                        } block py-2 hover:text-blue-500`}
                                >
                                    Home
                                </button>
                            </Link>
                        </li>
                        <li>
                            <Link href="/jadwal">
                                <button
                                    className={`${router.pathname === "/jadwal" ? "text-blue-500" : ""
                                        } block py-2 hover:text-blue-500`}
                                >
                                    About
                                </button>
                            </Link>
                        </li>
                        <li>
                            <Link href="/pengguna">
                                <button
                                    className={`${router.pathname === "/pengguna" ? "text-blue-500" : ""
                                        } block py-2 hover:text-blue-500`}
                                >
                                    User
                                </button>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    );
};

export default Sidebar;

