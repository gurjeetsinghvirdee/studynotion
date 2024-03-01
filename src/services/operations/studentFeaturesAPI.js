import { toast } from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";
import rzpLogo from "../../assets/Logo/rzp_logo.png";
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";

const {
    COURSE_PAYMENT_API,
    COURSE_VERIFY_API,
    SEND_PAYMENT_SUCCESS_EMAIL_API
} = studentEndpoints;

// Function to dynamically load a script
function loadScript(src) {
    return new Promise((resolve => {
        const script = document.createElement("script");
        script.src = src;

        script.onload = () => {
            resolve(true);
        }

        script.onerror = () => {
            resolve(false);
        }

        document.body.appendChild(script);
    }))
}

// Function to initiate the course purchase process
export async function buyCourse(token, courses, userDetails, navigate, dispatch) {
    // Show loading toast
    const toastId = toast.loading("Loading...");
    try {
        // Load RazorPay SDK
        const res = await loadScript("https://checkout.razopray.com/v1/checkout.js");

        // Check if SDK loaded successfully
        if (!res) {
            toast.error("RazorPay SDK failed to load");
            return;
        }

        // Request to create a payment order
        const orderResponse = await apiConnector("POST", COURSE_PAYMENT_API, {courses},
            {
                Authorization: `Bearer ${token}`
            })
        
        // Check if order creation was successful
        if (!orderResponse.data.success) {
            throw new Error(orderResponse.data.message)
        }
        console.log("PRINTING orderResponse", orderResponse);

        // Configure payment options
        const options = {
            key: process.env.RAZORPAY_KEY,
            currency: orderResponse.data.message.currency,
            amount: `${orderResponse.data.message.amount}`,
            order_id: orderResponse.data.message.id,
            name: "StudyNotion",
            description: "Thank You for Purchasing the Course",
            image: rzpLogo,
            prefill: {
                name: `${userDetails.firstName}`,
                email: userDetails.email
            },
            // Payment handler function
            handler: function(response) {
                // Send payment success email
                sendPaymentSuccessEmail(response, orderResponse.data.message.amount, token)
                // Verify payment
                verifyPayment({...response, course}, token, navigate, dispatch);
            }
        }

        // Initialize Razorpay payment object
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        
        // Handle payment failure
        paymentObject.on("payment.failed", function(response) {
            toast.error("Oops, payment failed");
            console.log(response.error);
        })
    } catch (error) {
        // Log error for debugging
        console.log("PAYMENT API ERROR.....", error);
        // Notify user of error
        toast.error("Could not make payment")
    }
    // Dismiss loading toast
    toast.dismiss(toastId);
}

// Function to send payment success email
async function sendPaymentSuccessEmail(response, amount, token) {
    try {
        await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API, {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            amount, 
        },{
            Authorization: `Bearer ${token}`
        })
    } catch (error) {
        // Log error for debugging
        console.log("PAYMENT SUCCESS EMAIL ERROR......", error);
    }
}

// Function to verify payment
async function verifyPayment(bodyData, token, navigate, dispatch) {
    // Show loading toast
    const toastId = toast.loading("Verifying Payment.....");
    // Set payment loading state
    dispatch(setPaymentLoading(true));
    try {
        // Request to verify payment
        const response = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
            Authorization: `Bearer ${token}`,
        })

        // Check if payment verification was successful
        if (!response.data.success) {
            throw new Error(response.data.message)
        }
        // Notify user of successful payment
        toast.success("Payment Successful, Now you can access the course");
        // Navigate to enrolled courses page
        navigate("/dashboard/enrolled-courses");
        // Reset cart
        dispatch(resetCart());
    } catch (error) {
        // Log error for debugging
        console.log("PAYMENT VERIFY ERROR......", error);
        // Dismiss loading toast
        toast.dismiss(toastId)
        // Set payment loading state
        dispatch(setPaymentLoading(false));
    }
}