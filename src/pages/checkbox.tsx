import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
    checkboxes: yup.array(),
});

type CheckboxData = {
    checkboxes: string[];
};

const checkboxesData: { label: string; value: string }[] = [
    { label: 'Checkbox 1', value: 'checkbox1' },
    { label: 'Checkbox 2', value: 'checkbox2' },
    { label: 'Checkbox 3', value: 'checkbox3' },
];

export default function CheckboxForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CheckboxData>({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data: CheckboxData) => {
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {checkboxesData.map((checkbox) => (
                <div key={checkbox.value} className="flex items-center">
                    <input
                        type="checkbox"
                        id={checkbox.value}
                        {...register('checkboxes')}
                        value={checkbox.value}
                        className="mr-2"
                    />
                    <label htmlFor={checkbox.value}>

                        {checkbox.label}

                    </label>
                </div>
            ))}
            {errors.checkboxes && (
                <p className="text-red-500">{errors.checkboxes.message}</p>
            )}
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                Submit
            </button>
        </form>
    );
}
