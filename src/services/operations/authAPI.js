/**
 * Function to send OTP to the user's email.
 * @param {string} email - User's email address.
 * @param {function} navigate - Function to navigate to a different route.
 * @returns {function} - Asynchronous function dispatching Redux actions.
 */
export function sendOtp(email, navigate) {
  return async (dispatch) => {
    // Show loading toast while processing
    const toastId = toast.loading("Loading...");
    // Set loading state to true
    dispatch(setLoading(true));
    try {
      // Call the send OTP API
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
        checkUserPresent: true
      });
      console.log("SENDOTP API RESPONSE..........", response);

      console.log(response.data.message);

      // If the API call is not successful, throw an error
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      // Display success toast and navigate to verify email page
      toast.success("OTP Sent Successfully");
      navigate("/verify-email");
    } catch (error) {
      // Log error and display error toast
      console.log("SENDOTP API ERROR......", error);
      toast.error("Could Not Send OTP");
    }
    // Set loading state to false and dismiss loading toast
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

/**
 * Function to sign up a user.
 * @param {string} accountType - Type of account (e.g., Student, Instructor).
 * @param {string} firstName - User's first name.
 * @param {string} lastName - User's last name.
 * @param {string} email - User's email address.
 * @param {string} password - User's password.
 * @param {string} confirmPassword - Confirmation of user's password.
 * @param {string} otp - One-time password for verification.
 * @param {function} navigate - Function to navigate to a different route.
 * @returns {function} - Asynchronous function dispatching Redux actions.
 */
export function signUp (
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp,
  navigate
) {
  return async (dispatch) => {
    // Show loading toast while processing
    const toastId = toast.loading("Loading...");
    // Set loading state to true
    dispatch(setLoading);
    try {
      // Call the signup API
      const response = await apiConnector("POST", SIGNUP_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
      });
      console.log("SIGNUP_API RESPONSE........", response);

      // If the API call is not successful, throw an error
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      // Display success toast and navigate to login page
      toast.success("Signup Successful");
      navigate("/login");
    } catch (error) {
      // Log error and display error toast, then navigate to signup page
      console.log("SIGNUP API ERROR.......", error);
      toast.error("Signup Failed");
      navigate("/signup");
    }
    // Set loading state to false and dismiss loading toast
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}
