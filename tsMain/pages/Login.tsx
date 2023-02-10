import React, {useState} from "react";
import {Col, Container, Row} from "react-bootstrap";
import {LoginForm, LoginState} from "../components/LoginForm";
import {Link, Navigate} from "react-router-dom";
import {RoutePaths} from "../models/RoutePaths";
import {User} from "../models/users/User";
import {TryLogin} from "./TryLogin";

// TODO
//  - 処理失敗時の画面を作成
//  - キャッシュを有効化
export function Login(props: {
    login: (User) => void
}) {
    const [tryLogin, setTryLogin] = useState(false)

    const [state, setState] = useState({
        email: "",
        password: "",
        enableCache: false
    })

    if (tryLogin) {
        return <TryLogin state={state} setUser={props.login} />
    }

    return <LoginPriv state={state} setState={setState} onLogin={() => setTryLogin(true)} />
}

function LoginPriv(props: {
    state: LoginState,
    setState: (LoginState) => void,
    onLogin: () => void
})
{
    const {state, setState, onLogin} = props

    return (<Container fluid={"sm"} className={"p-2 mt-2"} style={{
        maxWidth: "540px"
    }}>
        <h1 className={"text-secondary text-center"}>Login</h1>
        <LoginForm state={state} setState={setState} onLogin={onLogin} />
        <Row className={"mt-4"}>
            <Col>
                <Row>
                    <a href={"#"} className={"text-muted pe-none"}>パスワードを忘れた(作成中)</a>
                </Row>
                <Row>
                    <a href={"#"} className={"text-muted pe-none"}>メールアドレスを忘れた(作成中)</a>
                </Row>
            </Col>
            <Col>
                <Link to={RoutePaths.TOP}>Amplifier Community</Link>
            </Col>
        </Row>
    </Container>)
}