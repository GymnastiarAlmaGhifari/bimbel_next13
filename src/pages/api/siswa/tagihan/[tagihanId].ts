import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import path from "path";
import fs from "fs/promises";
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "@/libs/prismadb";
import { format } from "date-fns";

export const config = {
    api: {
        bodyParser: false,
    },
};

const readFile = (
    req: NextApiRequest,
    saveLocally?: boolean
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {

    const tagihanId = req.query.tagihanId;

    const options: formidable.Options = {};
    if (saveLocally) {
        options.uploadDir = path.join(process.cwd(), "/public/img/siswa/tagihan");
        options.filename = (name, ext, path, form) => {
            const extention = path.originalFilename?.split(".").pop();
            return tagihanId + "." + "jpg";
        };
    }
    options.maxFileSize = 2 * 1024 * 1024;
    const form = formidable(options);
    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            resolve({ fields, files });
        });
    });
};

const handler: NextApiHandler = async (req, res) => {
    if (req.method === "GET") {
        let tagihanId = req.query.tagihanId;
        const token = req.headers.authorization;

        if (Array.isArray(tagihanId)) {
            tagihanId = tagihanId[0];
        }

        try {
            const siswas = await prisma.siswa.findUnique({
                where: {
                    token: token,
                },
            });

            if (!siswas) {
                return res.status(404).json({
                    status: 404,
                    message: "Pengguna tidak ditemukan",
                    data: {},
                });
            }

            const tagihan = await prisma.tagihan.findUnique({
                where: {
                    id: tagihanId,
                },
            });

            if (!tagihan) {
                return res.status(404).json({
                    status: 404,
                    message: "Tagihan tidak ditemukan",
                    data: {},
                });
            }

            const response = {
                status: 200,
                message: "Berhasil mendapatkan tagihan",
                data: {
                    id: tagihan?.id,
                    bulan: tagihan?.Bulan,
                    tahun: tagihan?.Tahun,
                    jumlah: tagihan?.jumlah_tagihan,
                    status: tagihan.status,
                    nama_rekening: tagihan?.nama_rekening,
                    nomor_rekening: tagihan?.nomor_rekening,
                    tanggal_bayar: tagihan.tanggal_bayar,
                    jatuh_tempo: tagihan.tanggal_jatuh_tempo,
                    tanggal_approve: tagihan.tanggal_approve,
                },
            };

            return res.status(200).json(response);
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 500,
                message: "Terjadi kesalahan pada server",
                data: {},
            });
        }
    }

    else if (req.method === "POST") {
        try {
            await fs.readdir(path.join(process.cwd() + "/public", "/img", "/siswa", "/tagihan"));
        } catch (error) {
            await fs.mkdir(path.join(process.cwd() + "/public", "/img", "/siswa", "/tagihan"));
        }
        try {
            await readFile(req, true);

            const dateNow = new Date();
            const dateISOString = format(dateNow, "yyyy-MM-dd");
          
            const datenew = `${dateISOString}T00:00:00Z`;

            const updatetagihan = await prisma.tagihan.update({
                where: {
                    id: req.query.tagihanId as string,
                },
                data: {
                    status: "MENUNGGU_KONFIRMASI",
                    tanggal_bayar: datenew,
                    nota: req.query.tagihanId + ".jpg",
                },
            });

            res.status(200).json({
                status: 200,
                message: "tagihan berhasil diupload",
                data: {},
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: 500,
                message: "Terjadi kesalahan pada server",
                data: {},
            });
        }
    }

    // res.status(405).json({
    //     status: 405,
    //     message: "Method Not Allowed",
    //     data: {},
    // });
};

export default handler;  