import {Navigate, useLocation} from "react-router-dom";
import {getToken} from "@/utils/token.js";

/**
 * DONE
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function RouterGuard(props) {
    let token = getToken();
    let location = useLocation();
    if (token) {
        if (location.pathname === '/login') {
            return <Navigate to={{'pathname': '/'}}></Navigate>
        }
        return <>{props.children}</>
    } else {
        return <Navigate to={{'pathname': '/login', "search": "?redirect=" + location.pathname}}></Navigate>
    }

}