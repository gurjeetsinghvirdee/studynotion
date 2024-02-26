import { useLocation, matchPath } from "react-router-dom";

/**
 * Custom hook to check if the current route matches the specified path.
 * @param {string} path - The path to match against.
 * @returns {object | null} - Returns the matched route object if there's a match, otherwise null.
 */
export default function useRouteMatch(path) {
    const location = useLocation();
    return matchPath(location.pathname, { path });
}