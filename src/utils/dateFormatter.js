/**
 * Formats a given date into a human-readable format.
 * @param {string | Date} date - The date to be formatted.
 * @returns {string} - Formatted date string in the format "Month Day, Year".
 */
export const formattedDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    })
}