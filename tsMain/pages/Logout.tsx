import React, {useEffect} from "react";
import {Navigate, To} from "react-router-dom";

export function Logout(props: {
    to: To,
    logout: () => void
}) {
    useEffect(() => props.logout())
    return <Navigate to={props.to} />
}