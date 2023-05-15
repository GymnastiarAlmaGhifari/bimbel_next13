import axios from 'axios';
import { useForm, SubmitHandler } from 'react-hook-form';

type FormData = {
    image: FileList;
};

export default function ImageUploadForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();

    const onSubmit: SubmitHandler<FormData> = (data) => {
        const formData = new FormData();
        formData.append('image', data.image[0]);

        // kirim ke folder public/img
        try {
            axios.post('/api/userimg', data)
        } catch (error) {
            console.error(error);
        }



    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor="image">Pilih Gambar:</label>
                <input
                    type="file"
                    id="image"
                    {...register('image', {
                        required: 'Gambar wajib diunggah',
                        validate: {
                            fileSize: (value) => {
                                const fileSize = value[0]?.size || 0;
                                if (fileSize > 2 * 1024 * 1024) {
                                    return 'Ukuran file maksimum adalah 2MB';
                                }
                                return true;
                            },
                            fileType: (value) => {
                                const fileType = value[0]?.type || '';
                                if (!['image/jpeg', 'image/png'].includes(fileType)) {
                                    return 'Hanya mendukung format JPEG atau PNG';
                                }
                                return true;
                            },
                        },
                    })}
                />
                {errors.image && (
                    <p className="text-red-500">{errors.image.message}</p>
                )}
            </div>
            <div>
                <button type="submit">Unggah</button>
            </div>
        </form>
    );
}
