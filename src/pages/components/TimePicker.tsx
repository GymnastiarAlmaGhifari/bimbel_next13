import { useState } from 'react';

interface TimePickerProps {
    onTimeChange: (hour: number, minute: number) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ onTimeChange }) => {
    const [hour, setHour] = useState(0);
    const [minute, setMinute] = useState(0);

    const handleHourChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedHour = parseInt(event.target.value);
        setHour(selectedHour);
        onTimeChange(selectedHour, minute);
    };

    const handleMinuteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedMinute = parseInt(event.target.value);
        setMinute(selectedMinute);
        onTimeChange(hour, selectedMinute);
    };

    const formatNumber = (num: number) => {
        return num.toString().padStart(2, '0');
    };

    const renderOptions = (start: number, end: number) => {
        const options = [];
        for (let i = start; i <= end; i++) {
            options.push(
                <option key={i} value={i}>
                    {formatNumber(i)}
                </option>
            );
        }
        return options;
    };

    const formatTime = (hour: number, minute: number) => {
        const date = new Date();
        date.setHours(hour);
        date.setMinutes(minute);
        return date.toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleTimeChange = (hour: number, minute: number) => {
        const formattedTime = formatTime(hour, minute);
        console.log(`Selected time: ${formattedTime}`);
        onTimeChange(hour, minute);
    };

    return (
        <div className="flex space-x-2">
            <select
                value={hour}
                onChange={handleHourChange}
                className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                {renderOptions(0, 23)}
            </select>
            <span className="text-lg">:</span>
            <select
                value={minute}
                onChange={handleMinuteChange}
                className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                {renderOptions(0, 59)}
            </select>
        </div>
    );
};

export default TimePicker;
