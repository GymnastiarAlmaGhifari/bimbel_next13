import { useState } from 'react';
import useSWR from 'swr';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

// Fungsi utilitas untuk mengambil data dari API menggunakan SWR
const fetchData = async (url: string) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
};

const CheckboxList = () => {
    const [selectedCheckbox, setSelectedCheckbox] = useState<string | null>(null);

    // Menggunakan SWR untuk mengambil data dari API
    const { data } = useSWR('/api/checkboxes', fetchData);

    // Inisialisasi React Hook Form
    const { handleSubmit, register, errors } = useForm({
        validationSchema: Yup.object().shape({
            checkbox: Yup.string().required('Pilih setidaknya satu checkbox.'),
        }),
    });

    // Handle perubahan checkbox
    const handleCheckboxChange = (value: string) => {
        setSelectedCheckbox(value);
    };

    // Handle submit form
    const onSubmit = (data: any) => {
        console.log(data.checkbox);
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                {data ? (
                    data.map((item: string) => (
                        <div key={item}>
                            <input
                                type="checkbox"
                                value={item}
                                checked={selectedCheckbox === item}
                                onChange={() => handleCheckboxChange(item)}
                                name="checkbox"
                                ref={register}
                            />
                            <label>{item}</label>
                        </div>
                    ))
                ) : (
                    <p>Loading...</p>
                )}
                {errors.checkbox && <p>{errors.checkbox.message}</p>}
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default CheckboxList;
