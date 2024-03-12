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
            
        </div>
    );
}