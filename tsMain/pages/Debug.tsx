import React, {useState} from "react";
import {Accordion, Button, Form, Table} from "react-bootstrap";
import {server} from "../server";
import {settings} from "../settings";
import {Navigate} from "react-router-dom";
import {RoutePaths} from "../models/RoutePaths";
import {UUID} from "../util/UUID";
import {Layout} from "../components/Layout";
import {useCurrentUser} from "../util/Hooks";
import {format} from "date-fns"

export function Debug() {
    const [dirty, setDirty] = useState(0)
    function markDirty() {
        setDirty(dirty + 1)
    }

    const [user] = useCurrentUser()

    if (settings.debug) {
        return (<Layout user={user}>
            <div className={"h-100 w-100 overflow-scroll"}>
                <div className={"d-grid"}>
                    <Button variant={"light"} onClick={markDirty}>更新</Button>
                </div>
                <Accordion>
                    <Accordion.Item eventKey={UUID.generateShort()}>
                        <Accordion.Header>サーバー情報</Accordion.Header>
                        <Accordion.Body>
                            <Table striped bordered>
                                <tbody>
                                <tr>
                                    <th>URL</th>
                                    <td>{server.url}</td>
                                </tr>
                                </tbody>
                            </Table>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey={UUID.generateShort()}>
                        <Accordion.Header>Cookie</Accordion.Header>
                        <Accordion.Body>
                            <CookieTable cookie={document.cookie} />
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
                <DateTimeTest />
            </div>
        </Layout>)
    } else {
        return (<Navigate to={RoutePaths.TOP} /> )
    }
}

function CookieTable(props: {
    cookie: string
}) {
    return <Table striped bordered>
        <thead>
            <tr>
                <th>Key</th>
                <th>Value</th>
            </tr>
        </thead>
        <tbody>
            {props.cookie
                .split(";")
                .map(it => {
                    const array = it.split("=")
                    const key = array[0]
                    const value = decodeURI(array[1])
                    return (<tr key={key}>
                        <th>{key}</th>
                        <td>{value}</td>
                    </tr>)
                })}
        </tbody>
    </Table>
}

type DateTimeState = {
    date: string
    time: string
}

function DateTimeTest() {
    const now = new Date()
    const [state, setState] = useState<DateTimeState>({
        date: format(now, 'yyyy-MM-dd'),
        time: format(now, 'HH:mm')
    })

    return <Form>
        <Form.Control type={"date"} value={state.date} onInput={e => setState({
            ...state,
            date: e.currentTarget.value
        })} />
        <Form.Control type={"time"} value={state.time} onInput={e => setState({
            ...state,
            time: e.currentTarget.value
        })} />
    </Form>
}