import React from "react";
import {Container, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import {RoutePaths} from "../models/RoutePaths";
import {SignupForm} from "../components/SignupForm";

export function Signup() {
    return (<Container fluid={"sm"} className={"p-2 mt-2"}>
        <Row>
            <h1 className={"text-secondary text-center"}>会員登録</h1>
        </Row>
        <Row>
            <SignupForm />
        </Row>
        <Row className={"mt-4"}>
            <Link to={RoutePaths.TOP}>Amplifier Community</Link>
        </Row>
    </Container>)
}