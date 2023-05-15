import fs from 'fs';
import path from 'path';
import { ReactElement } from 'react';
import ImageUploadForm from './components/ImageUploadForm';

interface HomeProps {
    images: string[];
}

export default function Home({ images }: HomeProps): ReactElement {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Unggah Gambar</h1>
            <ImageUploadForm />

            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Daftar Gambar</h2>
                <div className="grid grid-cols-3 gap-4">
                    {images.map((image, index) => (
                        <div key={index}>
                            <img src={`public/img/user/${image}`} alt={`Gambar ${index + 1}`} className="w-full h-auto" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export async function getStaticProps(): Promise<{ props: HomeProps }> {
    const imagesDirectory = path.join(process.cwd(), 'public/img/user');
    const imageFileNames = fs.readdirSync(imagesDirectory);

    return {
        props: {
            images: imageFileNames,
        },
    };
}
