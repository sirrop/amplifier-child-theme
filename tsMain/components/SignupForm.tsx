import React, {useEffect, useState} from "react";
import {Button, Form, InputGroup} from "react-bootstrap";
import {UUID} from "../util/UUID";
import {server} from "../server";

// 将来的に、アドレスをsuggestするのに使います
const AddressSet = new Set([
    '@docomo.ne.jp',
    '@au.com',
    '@ezweb.ne.jp',
    '@softbank.ne.jp',
    '@x.vodafone.ne.jp',
    '@gmail.com',
    '@yahoo.co.jp',
    '@aol.jp',
    '@tutanota.com',
    '@outlook.com',
    '@live.com',
    '@hotmail.com',
    '@icloud.com'
])

interface SignupState {
    readonly email: string
    readonly userName: string
    readonly password: string
    readonly passwordConfirm: string
    readonly studentId: string
}

function copyState(state: SignupState, replace: {
    email?: string,
    userName?: string,
    password?: string,
    passwordConfirm?: string,
    studentId?: string
}): SignupState {
    return {
        email: replace.email ?? state.email,
        userName: replace.userName ?? state.userName,
        password: replace.password ?? state.password,
        passwordConfirm: replace.passwordConfirm ?? state.passwordConfirm,
        studentId: replace.studentId ?? state.studentId
    }
}

interface SignupProps {
    state: SignupState
    onChange: (SignupState) => void
}

// FIXME: 入力のヒントを書いていないので、どのようなヒントがあれば分かりやすいか考えてください
export function SignupForm() {
    const [state, setState] = useState<SignupState>({
        email: "",
        userName: "",
        password: "",
        passwordConfirm: "",
        studentId: ""
    })

    const [redirect, setRedirect] = useState(false)

    useEffect(() => {
        if (redirect) {
            window.location.href = window.location.origin + '/community/'
        }
    }, [redirect])

    const ok = testEmail(state.email) &&
        testUserName(state.userName) &&
        testPassword(state.password) &&
        testPasswordConfirm(state.password, state.passwordConfirm)

    function signup() {
        if (!ok) return
        server.createUser({
            email: state.email,
            username: 'z' + state.studentId,
            name: state.userName,
            password: state.password,
            roles: 'asmo_undergraduate_student',
            slug: 'z' + state.studentId,
        })
            .then(() => server.auth(state.email, state.password))
            .then(() => setRedirect(true))
            .catch(console.error)
    }

    return (<Form>
        <MailInput state={state} onChange={setState} />
        <UserNameInput state={state} onChange={setState} />
        <StudentIdInput state={state} onChange={setState} />
        <PasswordInput state={state} onChange={setState} />
        <PasswordConfirmInput state={state} onChange={setState} />
        <div className={"d-grid"}>
            <Button variant={ok ? "primary" : "light"} type={'button'} disabled={!ok} onClick={signup}>OK</Button>
        </div>
    </Form>)
}

function Sign(props: {
    ok: boolean
}) {
    return props.ok ? <i className="fa-solid fa-check"></i> : <i className="fa-solid fa-xmark"></i>
}

function MailInput(props: SignupProps) {
    const { email } = props.state
    const id = UUID.generateShort()

    const ok = testEmail(email)

    return (<Form.Group className={"mb-3"} controlId={id}>
        <Form.Label className={ok ? "text-success" : "text-danger"}>
            <Sign ok={ok} />
            <span className={"ms-2"}>メールアドレス</span>
        </Form.Label>
        <Form.Control type={"email"}
               value={email}
               name={"email"}
               onChange={(e) => {
                   props.onChange(copyState(props.state, {
                       email: e.target.value
                   }))
               }} />
    </Form.Group>)
}

function testEmail(email: string): boolean {
    const regex = /^[a-zA-Z0-9_+-]+(.[a-zA-Z0-9_+-]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/
    return regex.test(email)
}

function UserNameInput(props: SignupProps) {
    const { userName } = props.state
    const id = UUID.generateShort()
    const ok = testUserName(userName)

    return (<Form.Group controlId={id} className={"mb-3"}>
        <Form.Label className={ok ? "text-success" : "text-danger"}>
            <Sign ok={ok} />
            <span className={"ms-2"}>ユーザー名</span>
        </Form.Label>
        <Form.Control type={"text"}
                      name={"username"}
                      onChange={e => props.onChange(copyState(props.state, {
                          userName: e.target.value
                      }))}
                      value={userName} />
    </Form.Group>)
}

function testUserName(userName: string): boolean {
    return !!userName
}

function StudentIdInput(props: SignupProps) {
    const { studentId } = props.state
    const id = UUID.generateShort()
    const ok = testStudentId(studentId)

    return (<Form.Group controlId={id} className={"mb-3"}>
        <Form.Label className={ok ? "text-success" : "text-danger"}>
            <Sign ok={ok} />
            <span className={"ms-2"}>
                学籍番号
            </span>
        </Form.Label>
        <Form.Control type={"text"}
                      name={"studentId"}
                      onChange={e => props.onChange(copyState(props.state, { studentId: e.target.value })) }
                      value={studentId} />
    </Form.Group>)
}

function testStudentId(studentId: string): boolean {
    const regex = /[0-9]{6}/
    return regex.test(studentId)
}

function PasswordInput(props: SignupProps) {
    const { password } = props.state
    const id = UUID.generateShort()

    const ok = testPassword(password)
    const [visible, setVisible] = useState(false)

    return (<Form.Group controlId={id} className={"mb-3"}>
        <Form.Label className={ok ? "text-success" : "text-danger"}>
            <Sign ok={ok} />
            <span className={"ms-2"}>パスワード</span>
        </Form.Label>
        <InputGroup>
            <Form.Control type={visible ? "text" : "password"}
                          name={"password"}
                          onChange={e => {
                              props.onChange(copyState(props.state,{
                                  password: e.target.value
                              }))
                          }}
                          value={password} />
            <Button variant={"outline-secondary"} onClick={() => setVisible(!visible)}>
                {visible ? <i className="fa-solid fa-eye"></i> : <i className="fa-solid fa-eye-slash"></i>}
            </Button>
        </InputGroup>
    </Form.Group>)
}

function testPassword(password: string): boolean {
    return !!password
}

function PasswordConfirmInput(props: SignupProps) {
    const { password, passwordConfirm } = props.state
    const id = UUID.generateShort()
    const [visible, setVisible] = useState(false)
    const ok = testPasswordConfirm(password, passwordConfirm)

    return (<Form.Group controlId={id} className={"mb-3"}>
        <Form.Label className={ok ? "text-success" : "text-danger"}>
            <Sign ok={ok} />
            <span className={"ms-2"}>パスワード(確認)</span>
        </Form.Label>
        <InputGroup>
            <Form.Control type={visible ? "text" : "password"}
                          name={"password-confirm"}
                          onChange={e => {
                              props.onChange(copyState(props.state, {
                                  passwordConfirm: e.target.value
                              }))
                          }}
                          value={passwordConfirm}/>
            <Button type={"button"} variant={"outline-secondary"} onClick={() => setVisible(!visible)}>
                {visible ? <i className="fa-solid fa-eye"></i> : <i className="fa-solid fa-eye-slash"></i>}
            </Button>
        </InputGroup>
    </Form.Group>)
}

function testPasswordConfirm(predict: string, actual: string): boolean {
    return predict && predict === actual
}