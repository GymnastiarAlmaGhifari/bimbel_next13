import axios from 'axios';
import React, { FC, useState } from 'react';
import { mutate } from 'swr';

interface KelasEditProps {
    kelasId: string;
    data: any;
    onClose: () => void;
    onSucsess: () => void;
}

const DeleteKelas: FC<KelasEditProps> = ({ kelasId, data, onClose, onSucsess }) => {
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async () => {
        const { nama_kelas } = data;

        setIsLoading(true); // Set loading state to true

        try {
            await axios.delete(`/api/kelas/${kelasId}`, {
                data: {
                    nama_kelas,
                },
            });

            mutate("/api/kelas");
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
            onClose(); // Set loading state to false
            onSucsess();
        }
    };

    return (
        <div>
            <h1>{data?.nama_kelas}</h1>
            <button onClick={onSubmit} disabled={isLoading}>
                {isLoading ? 'Deleting...' : 'Delete'}
            </button>
        </div>
    );
};

export default DeleteKelas;
