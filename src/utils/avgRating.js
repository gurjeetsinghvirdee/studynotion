/**
 * Calculates the average rating from an array of ratings.
 * @param {Array} ratingArr - Array of rating objects, each containing a 'rating' property.
 * @returns {number} - Average rating rounded to one decimal place.
 */
export default function GetAvgRating(ratingArr) {
    // Return 0 if the rating array is empty
    if (ratingArr?.length === 0) return 0

    // Calculate the total sum of ratings
    const totalReviewCount = ratingArr?.reduce((acc, curr) => {
        acc += curr.rating
        return acc
    }, 0)

    // Calculate the average rating and round to one decimal place
    const multiplier = Math.pow(10, 1)
    const avgReviewCount = Math.round((totalReviewCount / ratingArr?.length) * multiplier) / multiplier

    return avgReviewCount
}