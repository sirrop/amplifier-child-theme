import React from "react";
import {User} from "../models/users/User";
import {Container, Row, Toast} from "react-bootstrap";
import {Sidebar} from "./Sidebar";
import {Children} from "../models/Children";

export function Layout(props: {
    user: User,
    children: Children
}) {
    return <>
        <Container fluid={"md"} className={"vh-100"}>
            <div className={"d-flex h-100"}>
                <Sidebar user={props.user} />
                <Row className={"w-100 h-100 m-1"}>
                    {props.children}
                </Row>
            </div>
        </Container>
    </>
}