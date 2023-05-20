import { useState } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';

const UploadPdf = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    return (
        <div className="w-64">
            <label className="block mb-2 text-lg font-semibold">Upload PDF</label>
            <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="mb-4"
            />

            {selectedFile && (
                <div className="border rounded-md shadow-md p-4">
                    <Worker workerUrl="/path/to/pdf.worker.js">
                        <Viewer fileUrl={URL.createObjectURL(selectedFile)} />
                    </Worker>
                </div>
            )}
        </div>
    );
};

export default UploadPdf;