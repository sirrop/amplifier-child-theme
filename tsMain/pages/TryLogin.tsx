import React, {useEffect, useState} from "react";
import {LoginState} from "../components/LoginForm";
import {User} from "../models/users/User";
import {server} from "../server";
import {RoutePaths} from "../models/RoutePaths";
import {Navigate} from "react-router-dom";
import {Login} from "./Login";

export function TryLogin(props: {
    state: LoginState,
    setUser: (user: User) => void
}) {
    let [result, setResult] = useState(null)
    const {email, password} = props.state

    useEffect(() => {
        server.auth(email, password)
            .then(res => {
                if (res !== null) {
                    setResult(res)
                } else {
                    setResult('failure')
                }
            })
            .catch(e => setResult(e))
    })

    if (!result) {
        return <TryingLoginAnimation />
    } else if (result.id) {
        return <Complete user={result} setUser={props.setUser} />
    } else {
        return <Login login={props.setUser} />
    }
}

function TryingLoginAnimation() {
    return <div>ログイン中</div>
}

function Complete(props: {
    user: User,
    setUser: (User) => void
}) {
    const {user, setUser} = props

    useEffect(() => {
        setUser(user)
    })

    return <Navigate to={RoutePaths.TOP} />
}