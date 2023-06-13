/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link';
import React from 'react';
import { AiOutlineArrowLeft } from 'react-icons/ai';


const PrivacyPolicy = () => {
    return (
        <div className="container mx-auto py-5 font-mulish ">
            <Link
                href="/"
                className='absolute mt-2
                hover:text-gray-400
                hover:cursor-pointer
                transition duration-300 ease-in-out
                '
            >
                {/* arraow left dari react-icons  AiOutlineArrowLeft*/}
                <AiOutlineArrowLeft
                    className="text-3xl text-black ml-4"
                />

            </Link>
            <h1 className="text-3xl font-bold text-center mb-4">Privacy Policy untuk Aplikasi Bimbel</h1>
            <p className="text-center mb-4">Efektif sejak: 27 Mei 2023</p>
            <p className="text-justify mb-4">
                Kami, Bimbel Linear, berkomitmen untuk melindungi privasi pengguna aplikasi kami dengan tema bimbel ("Aplikasi"). Privacy Policy ini menjelaskan bagaimana kami mengumpulkan, menggunakan, mengungkapkan, dan melindungi informasi pribadi pengguna kami. Dalam kebijakan ini, kami merujuk kepada Bimbel Linear sebagai pemilik dan pengelola Aplikasi.
            </p>

            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Informasi yang Kami Kumpulkan:</h2>
                <ol className="list-decimal pl-6">
                    <li>Informasi Pribadi: Kami dapat mengumpulkan informasi pribadi yang diberikan oleh pengguna, seperti nama, alamat email, nomor telepon, alamat, atau informasi lainnya yang relevan untuk menyediakan layanan dalam Aplikasi.</li>
                    <li>Informasi Non-Pribadi: Kami juga dapat mengumpulkan informasi non-pribadi, seperti data penggunaan, informasi perangkat, dan data statistik terkait penggunaan Aplikasi.</li>
                </ol>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Penggunaan Informasi:</h2>
                <ol className="list-decimal pl-6">
                    <li>Kami menggunakan informasi pribadi yang dikumpulkan untuk menyediakan layanan dalam Aplikasi, termasuk untuk mengelola akun pengguna, memproses pembayaran, menghubungi pengguna, atau memberikan materi pembelajaran yang relevan.</li>
                    <li>Informasi non-pribadi digunakan untuk analisis statistik, peningkatan Aplikasi, atau tujuan penelitian internal. Informasi ini tidak terkait dengan identitas pribadi pengguna.</li>
                </ol>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Penyimpanan dan Keamanan Informasi:</h2>
                <ol className="list-decimal pl-6">
                    <li>Kami menyimpan informasi pengguna dengan langkah-langkah keamanan yang sesuai untuk melindungi informasi dari akses, penggunaan, atau pengungkapan yang tidak sah.</li>
                    <li>Kami hanya menyimpan informasi pengguna selama periode yang diperlukan untuk menyediakan layanan yang diminta atau sesuai dengan persyaratan hukum yang berlaku.</li>
                </ol>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Pengungkapan kepada Pihak Ketiga:</h2>
                <ol className="list-decimal pl-6">
                    <li>Kami tidak akan menjual, menyewakan, menukar, atau membagikan informasi pribadi pengguna dengan pihak ketiga tanpa izin pengguna, kecuali jika diwajibkan oleh hukum atau untuk tujuan yang dijelaskan dalam Privacy Policy ini.</li>
                    <li>Kami dapat mengungkapkan informasi non-pribadi yang tidak dapat diidentifikasi secara pribadi kepada pihak ketiga untuk tujuan analisis, pemasaran, atau pengembangan bisnis.</li>
                </ol>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Cookie dan Teknologi Pelacakan Serupa:</h2>
                <ol className="list-decimal pl-6">
                    <li>Aplikasi kami dapat menggunakan cookie dan teknologi pelacakan serupa untuk mengumpulkan informasi tentang pengguna dan meningkatkan pengalaman pengguna dalam Aplikasi.</li>
                    <li>Pengguna dapat mengelola preferensi cookie mereka melalui pengaturan peramban mereka. Namun, mematikan cookie dapat mempengaruhi fungsionalitas Aplikasi.</li>
                </ol>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Tautan ke Situs Web Pihak Ketiga:</h2>
                <p>Aplikasi kami dapat berisi tautan ke situs web pihak ketiga. Privacy Policy kami hanya berlaku untuk Aplikasi kami. Kami tidak bertanggung jawab atas praktik privasi atau konten situs web pihak ketiga tersebut.</p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
