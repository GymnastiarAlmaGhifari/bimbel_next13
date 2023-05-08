// "use client"
// import Link from "next/link";
// import { usePathname } from 'next/navigation';
// import { FC } from "react";
// import { IconType } from "react-icons";

// export interface MenuItemProps {
//     icon: IconType;
//     title: string;
//     href: string;
//     isOpen: boolean;
// }

// const MenuItem: FC<MenuItemProps> = ({ icon: Icon, title, href, isOpen
// }) => {
//     const router = usePathname();

//     const isActive = router === href;

//     return (
//         <li>
//             <Link href={href}>
//                 <button
//                     className={`relative flex rounded py-3 px-4 ${isActive ? "button-text bg-red-600" : "opacity-75 bg-green-600"
//                         }`}
//                 >
//                     <span
//                         className={`mr-3 text-2xl ${isActive ? "text-white" : "text-primary"
//                             }`}
//                     >
//                         <Icon
//                             size={24}
//                         />
//                     </span>
//                     <span
//                         className={`font-medium
//                         ${isActive ? "text-white" : "text-primary"}
//                         ${isOpen ? "ml-2" : "hidden"}`
//                         }
//                     >
//                         {title}
//                     </span>
//                 </button>
//             </Link>
//         </li>
//     );
// };

// export default MenuItem;

import React from 'react'

const MenuItem = () => {
    return (
        <div>

        </div>
    )
}

export default MenuItem
