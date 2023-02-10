import React, {useState} from "react";
import {Button} from "react-bootstrap";
import {UUID} from "../util/UUID";
import {Form as BSForm} from "react-bootstrap"
import {Form, FormMethod, useSearchParams, useSubmit} from "react-router-dom";

export interface LoginState {
    readonly email: string
    readonly password: string
    readonly enableCache: boolean
}

export function LoginForm(props: {
    state: LoginState,
    setState: (LoginState) => void,
    onLogin: () => void
}) {
    const { state, setState, onLogin } = props

    return (<BSForm className={"d-flex flex-column"}>
        <MailAddrInput state={state} onChange={setState} />
        <PasswordInput state={state} onChange={setState} />
        <CacheCheckBox state={state} onChange={setState} />
        <Button type={"button"} variant={"primary"} onClick={onLogin}>OK</Button>
    </BSForm>)
}

function MailAddrInput(props: {
    state: LoginState,
    onChange: (LoginState) => void
}) {
    const email = props.state.email
    const id = UUID.generateShort()
    return (<>
        <label className={"form-label"} htmlFor={id}>メールアドレス</label>
        <input type={"email"}
               id={id}
               className={"mb-3 form-control"}
               value={email}
               required
               onChange={(e) => {
                   props.onChange({
                       email: e.currentTarget.value,
                       password: props.state.password,
                       enableCache: props.state.enableCache
                   })
               }} />
    </>)
}

function PasswordInput(props: {
    state: LoginState,
    onChange: (LoginState) => void
}) {
    const [visible, setVisible] = useState(false)
    const id = UUID.generateShort()

    if (visible) {
        return (<>
            <label htmlFor={id} className={"form-label"}>パスワード</label>
            <div className={"input-group mb-3"}>
                <input type={"text"}
                       id={id}
                       value={props.state.password}
                       required
                       onChange={(e) => {
                           props.onChange({
                               email: props.state.email,
                               password: e.target.value,
                               enableCache: props.state.enableCache
                           })
                       }}
                       className={"form-control"} />
                <Button type={"button"}
                        variant={"outline-secondary"}
                        onClick={() => setVisible(false)}>
                    <i className="fa-solid fa-eye"></i>
                </Button>
            </div>
        </>)
    } else {
        return (<>
            <label htmlFor={id} className={"form-label"}>パスワード</label>
            <div className={"input-group mb-3"}>
                <input type={"password"}
                       id={id}
                       value={props.state.password}
                       required
                       onChange={(e) => {
                           props.onChange({
                               email: props.state.email,
                               password: e.target.value,
                               enableCache: props.state.enableCache
                           })
                       }}
                       className={"form-control"} />
                <Button type={"button"}
                        variant={"outline-secondary"}
                        onClick={() => setVisible(true)}>
                    <i className="fa-solid fa-eye-slash"></i>
                </Button>
            </div>
        </>)
    }
}

function CacheCheckBox(props: {
    state: LoginState,
    onChange: (LoginState) => void
}) {
    const id = UUID.generateShort()
    const CheckBox = (props: { state: LoginState, onChange: (LoginState) => void }) => {
        const checked = props.state.enableCache
        const onChange = e => props.onChange({
            email: props.state.email,
            password: props.state.password,
            enableCache: e.target.checked
        })
        if (checked) {
            return <BSForm.Check type={"checkbox"}
                                 className={"mb-3"}
                                 label={"ログインを保持"}
                                 required
                                 id={id}
                                 checked
                                 onChange={onChange} />
        } else {
            return <BSForm.Check type={"checkbox"}
                                 className={"mb-3"}
                                 label={"ログインを保持"}
                                 required
                                 id={id}
                                 onChange={onChange} />
        }
    }

    return <CheckBox state={props.state} onChange={props.onChange} />
}