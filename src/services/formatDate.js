// Function to format date and time
export const formatDate = (dateString) => {
    // Options for date formatting
    const options = { year: "numeric", month: "long", day: "numeric" };
    
    // Creating a date object from the provided dateString
    const date = new Date(dateString);
    
    // Formatting date
    const formattedDate = date.toLocaleDateString("en-US", options);
    
    // Extracting hour and minutes
    const hour = date.getHours();
    const minutes = date.getMinutes();
    
    // Determining AM or PM
    const period = hour >= 12 ? "PM" : "AM";
    
    // Formatting time
    const formattedTime = `${hour % 12}:${minutes
        .toString()
        .padStart(2, "0")} ${period}`;
    
    // Returning formatted date and time
    return `${formattedDate} | ${formattedTime}`;
}