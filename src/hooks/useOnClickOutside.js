import { useEffect } from "react";

/**
 * Custom hook to handle clicks outside of a specified element.
 * @param {object} ref - Reference to the element to detect clicks outside of.
 * @param {function} handler - Function to be called when a click outside the element is detected.
 */
export default function useOnClickOutside(ref, handler) {
    useEffect(() => {
        const listener = (event) => {
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }
            handler(event);
        };
        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);

        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, [ref, handler]);
}