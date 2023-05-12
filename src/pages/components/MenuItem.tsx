// "use client";
// import Link from "next/link";
// // import { usePathname } from 'next/navigation';
// import { useRouter } from "next/router";
// import { FC } from "react";
// import { IconType } from "react-icons";

// export interface MenuItemProps {
//   icon: IconType;
//   title: string;
//   href: string;
//   isOpen: boolean;
// }

// const MenuItem: FC<MenuItemProps> = ({ icon: Icon, title, href, isOpen }) => {
//   // const router = usePathname();
//     console.log({href})

//   const router = useRouter();

//   // const isActive = router === href;

//   return (
//     <li>
//       <Link href={href}>
//         <button className={`relative flex rounded py-3 px-4 `}>
//           <span
//             className={`mr-3 text-2xl 
//                             }`}
//           >
//             <Icon size={24} />
//           </span>
//           <span className={`font-medium`}>{title}</span>
//         </button>
//       </Link>
//     </li>
//   );
// };

// export default MenuItem;

// import React from 'react'

// const MenuItem = () => {
//     return (
//         <div>

//         </div>
//     )
// }

// export default MenuItem
