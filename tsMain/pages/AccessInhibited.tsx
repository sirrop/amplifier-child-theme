import React, {useEffect, useState} from "react";
import {Navigate} from "react-router-dom";
import {RoutePaths} from "../models/RoutePaths";

export function AccessInhibited() {
    const [time, setTime] = useState(0)

    useEffect(() => {
        setTimeout(() => setTime(time - 1), 1000)
    })

    if (time > 0) {
        return <div>
            <h1 className={"text-secondary"}>Access Inhibited</h1>
            <span>アクセス権がありません。{time}秒後にトップページに移動します</span>
        </div>
    }

    return <Navigate to={RoutePaths.TOP} />
}