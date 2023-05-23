// import { NextApiRequest, NextApiResponse } from "next";
// import prisma from "@/libs/prismadb";
// import EmailServices from "@/pages/api/service/email";

// let OTP_base: string = "";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     const { email } = req.body;

//     if (req.method === "GET") {

//     } else if (req.method === "POST") {
//         try {
//             const siswas = await prisma.siswa.findUnique({
//                 where: {
//                     email: email,
//                 },
//             });
//             if (!siswas) {
//                 return res.status(404).json({
//                     status: 404,
//                     message: "Pengguna tidak ditemukan",
//                     data: {},
//                 });
//             }

//             OTP_base = Math.floor(100000 + Math.random() * 900000).toString();
//             EmailServices.sendEmailResetPassword(siswas.email, OTP_base);

//             EmailServices.setOTPBase(OTP_base);

//             const get = EmailServices.getOTPBase();
//             console.log("get", get);
//             const response = {
//                 status: 200,
//                 message: "Berhasil mengirim OTP",
//                 data: {
//                     OTP: OTP_base,
//                 },
//             }

//             res.status(200).json(response);

//             return OTP_base;
//         } catch (error) {
//             console.error(error);
//             res.status(500).json({
//                 status: 500,
//                 message: "Error reset password.",
//                 data: { error },
//             });

//         }
//     }
// }