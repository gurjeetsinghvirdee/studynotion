/**
 * Converts total seconds to a formatted duration string.
 * @param {number} totalSeconds - Total seconds to be converted.
 * @returns {string} - Formatted duration string (e.g., "2h 30m" or "45s").
 */
function convertSecondsToDuration(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor((totalSeconds % 3600) % 60);

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    } else {
        return `${seconds}s`;
    }
}

module.exports = {
    convertSecondsToDuration,
};