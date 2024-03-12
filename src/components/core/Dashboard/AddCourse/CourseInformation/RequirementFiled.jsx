import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function RequirementsField({
    name,
    label,
    register,
    setValue,
    errors,
    getValues,
}) {
    // Accessing state from Redux store
    const { editCourse, course } = useSelector((state) => state.course);
    
    // State for managing individual requirement input
    const [requirement, setRequirement] = useState("");
    
    // State for managing list of requirements
    const [requirementList, setRequirementsList] = useState([]);

    // Effect to initialize requirements and register input
    useEffect(() => {
        if (editCourse) {
            setRequirementsList(course?.instructions);
        }
        register(name, { required: true, validate: (value) => value.length > 0 });
    }, []);

    // Effect to update form value when requirements change
    useEffect(() => {
        setValue(name, requirementList);
    }, [requirementList]);

    // Function to add a requirement to the list
    const handleAddRequirement = () => {
        if (requirement) {
            setRequirementsList([...requirementList, requirement]);
            setRequirement("");
        }
    };

    // Function to remove a requirement from the list
    const handleRemoveRequirement = (index) => {
        const updatedRequirements = [...requirementList];
        updatedRequirements.splice(index, 1);
        setRequirementsList(updatedRequirements);
    };

    return (
        <div className="flex flex-col space-y-2">
            {/* Label for the requirement field */}
            <label htmlFor={name} className="text-sm text-richblack-5">
                {label} <sup className="text-pink-200">*</sup>
            </label>
            {/* Input field for adding new requirements */}
            <div className="flex-col flex items-start space-y-2">
                <input 
                    type="text"
                    id={name}
                    value={requirement}
                    onChange={(e) => setRequirement(e.target.value)} 
                    className="form-style w-full" 
                />
                {/* Button to add a requirement */}
                <button 
                    className="font-semibold text-yellow-50"
                    type="button"
                    onClick={handleAddRequirement}
                >
                    Add
                </button>
            </div>
            {/* Displaying list of requirements */}
            {requirementList.length > 0 && (
                <ul className="mt-2 list-inside list-disc">
                    {requirementList.map((requirement, index) => (
                        <li className="flex items-center text-richblack-5" key={index}>
                            <span>{requirement}</span>
                            {/* Button to remove a requirement */}
                            <button 
                                className="ml-2 text-xs text-pure-greys-300"
                                type="button"
                                onClick={() => handleRemoveRequirement(index)}                    
                            >
                                clear
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            {/* Error message for required field validation */}
            {errors[name] && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                    {label} is required
                </span>
            )}
        </div>
    )
}