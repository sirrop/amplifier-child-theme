import React, {useEffect, useState} from "react";
import {User} from "../../models/users/User";
import {useParams} from "react-router";
import {RoutePaths, userPathOf} from "../../models/RoutePaths";
import {Link, Navigate} from "react-router-dom";
import {Button, Container} from "react-bootstrap";
import {Sidebar} from "../../components/Sidebar";

export function UserSettings(props: {
    user: User
}) {
    const { slug } = useParams()

    const allowed = slug === props.user.slug

    if (allowed) {
        return <Container fluid={"sm"}>
            <div className={"d-flex"}>
                <Sidebar user={props.user} />
                <div>
                    <UserSettingPage user={props.user} />
                </div>
            </div>
        </Container>
    } else {
        return <Navigate to={RoutePaths.ACCESS_INHIBITED} />
    }
}

function UserSettingPage(props: { user: User }) {
    const [proxy, setProxy] = useState(Object.assign({}, props.user))

    const Header = (props: {user: User}) => <div className={"d-flex justify-content-between"}>
        <div>
            <Link to={userPathOf({ slug: props.user.slug, to: RoutePaths.PROFILE })}>
                <i className="fa-solid fa-chevron-left"></i>
            </Link>
            プロフィールを編集
        </div>
        <Button variant={"primary"}>保存</Button>
    </div>

    const Body = (props: {user: User, proxy: User, onChange: (User) => void}) => <div>

    </div>

    return <div>
        <Header user={props.user} />
        <Body user={props.user} proxy={proxy} onChange={setProxy} />
    </div>
}