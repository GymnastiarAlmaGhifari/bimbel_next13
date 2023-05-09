import { ModalDetail } from "@/pages/components/Modal";
import { useState } from "react";
import { useRouter } from "next/router";
import useSWR, { mutate } from "swr"
import fetcher from "@/libs/fetcher";



interface UserEditProps {
    userId: string;
    onClose: () => void;
    onSucsess: () => void;
    // pass onchange string to parent
    // onChange: (value: string) => void;
}

const UserEdit = (
    {
        userId,
        onClose,
        onSucsess,
        // onChange,

    }: UserEditProps) => {

    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [nomor_telepon, setNomor_telepon] = useState("");
    const [alamat, setAlamat] = useState("");
    // const [showSuccess, setShowSuccess] = useState(false);

    // mengambil data buku dari API menggunakan SWR
    const { data: user, error, isLoading } = useSWR(`/api/user/${userId}`, fetcher);

    if (error) return <div>Error loading user.</div>;
    if (!user) return <div>Loading...</div>;

    if (isLoading) return <div>Loading...</div>;

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            // mengirim data buku yang telah diubah ke API menggunakan method PUT
            await fetch(`/api/user/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name || user.name,
                    email: email || user.email,
                    role: role || user.role,
                    nomor_telepon: nomor_telepon || user.nomor_telepon,
                    alamat: alamat || user.alamat,

                }),
            });

            // memperbarui data buku di halaman dengan SWR
            mutate(`/api/user/${userId}`);



            // router.push("/pengguna");

            onClose();
            onSucsess();
            // onChange(name);

            // setShowSuccess(true);
            // setTimeout(() => {
            // setShowSuccess(false);
            // onClose();
            // }, 500);
            // router.refresh();


        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        name="name"
                        id="name"

                        className="border border-gray-300 rounded-md"
                        placeholder={user.name}
                        value={name}

                        onChange={(event) => setName(event.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        name="email"
                        id="email"

                        className="border border-gray-300 rounded-md"
                        placeholder={user.email}
                        value={email}

                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="role">Role</label>
                    <input
                        type="text"
                        name="role"
                        id="role"

                        className="border border-gray-300 rounded-md"
                        placeholder={user.role}
                        value={role}

                        onChange={(event) => setRole(event.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="nomor_telepon">Nomor Telepon</label>
                    <input
                        type="text"
                        name="nomor_telepon"
                        id="nomor_telepon"

                        className="border border-gray-300 rounded-md"
                        placeholder={user.nomor_telepon}

                        value={nomor_telepon}

                        onChange={(event) => setNomor_telepon(event.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="alamat">Alamat</label>
                    <input
                        type="text"
                        name="alamat"

                        id="alamat"

                        className="border border-gray-300 rounded-md"

                        placeholder={user.alamat}

                        value={alamat}

                        onChange={(event) => setAlamat(event.target.value)}
                    />

                </div>


                <div className="flex justify-end gap-2 mt-4">
                    <button
                        type="button"
                        className="px-4 py-2 bg-gray-200 rounded-md"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                        Save
                    </button>
                </div>
            </form>
        </>
    );
};

export default UserEdit;


// {showSuccess && (
//     <ModalDetail
//         onClose={() => setShowSuccess(false)}
//     >
//         <div className="flex flex-col items-center gap-2">
//             <h1 className="text-2xl font-semibold">Success</h1>
//             <p className="text-gray-500">user has been updated.</p>
//             {/* ambil nama buku dari data yang diambil dari API */}
//             <p className="text-gray-500">{user.title}</p>
//         </div>
//     </ModalDetail>
// )}