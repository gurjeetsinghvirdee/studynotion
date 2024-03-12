import { useEffect, useState } from "react";
import { MdClose } from 'react-icons/md';
import { useSelector } from 'react-redux';

export default function ChipInput({
    label,
    name,
    placeholder,
    register,
    errors,
    setValue,
    getValues
}) {
    // Selecting data from Redux store
    const { editCourse, course } = useSelector((state) => state.course);

    // State to manage chips (tags)
    const [chips, setChips] = useState([]);

    // Effect to initialize chips state and register the input
    useEffect(() => {
        // If in edit mode, set chips to the course tags
        if (editCourse) {
            setChips(course?.tag);
        }
        // Registering the input with validation rules
        register(name, { required: true, validate: (value) => value.length > 0 });
    }, []);

    // Effect to update form value when chips change
    useEffect(() => {
        setValue(name, chips);
    }, [chips]);

    // Function to handle adding chips
    const handleKeyDown = (event) => {
        if (event.key === "Enter" || event.key === ",") {
            event.preventDefault();

            const chipValue = event.target.value.trim();
            // Adding chip if it's not empty and not already included
            if (chipValue && !chips.includes(chipValue)) {
                const newChips = [...chips, chipValue];
                setChips(newChips);
                event.target.value = "";
            }
        }
    };

    // Function to handle deleting chips
    const handleDeleteChip = (chipIndex) => {
        const newChips = chips.filter((_, index) => index !== chipIndex);
        setChips(newChips);
    };

    return (
        <div className="flex flex-col space-y-2">
            {/* Label for the chip input */}
            <label htmlFor={name} className="text-sm text-richblack-5">
                {label} <sup className="text-pink-200">*</sup>
            </label>
            {/* Container for chips and input field */}
            <div className="flex w-full flex-wrap gap-y-2">
                {/* Mapping over chips to display them */}
                {chips.map((chip, index) => (
                    <div
                        key={index} 
                        className="m-1 flex items-center rounded-full bg-yellow-400 px-2 py-1 text-sm text-richblack-5"
                    >
                        {chip}
                        {/* Button to delete chip */}
                        <button
                            type="button"
                            className="ml-2 focus:outline-none"
                            onClick={() => handleDeleteChip(index)}
                        >
                            <MdClose className="text-sm" />
                        </button>
                    </div>
                ))}
                {/* Input field for adding new chips */}
                <input 
                    type="text" 
                    className="form-style w-full"
                    id={name}
                    name={name}
                    placeholder={placeholder}
                    onKeyDown={handleKeyDown} 
                />
            </div>
            {/* Error message for required field validation */}
            {errors[name] && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                    {label} is required
                </span>
            )}
        </div>
    );
}    