import React from "react";
import {Button, Form, InputGroup, Tabs} from "react-bootstrap";
import {User} from "../models/users/User";
import {Layout} from "../components/Layout";
import {useSearchParams} from "react-router-dom";
import {useCurrentUser, usePosts, useUsers} from "../util/Hooks";
import {LoadingAnimation} from "../components/LoadingAnimation";
import {Post} from "../components/post/Post";
import {UUID} from "../util/UUID";
import {ImageIcon} from "../components/ImageIcon";

export function Explore(props: {user: User}) {
    const [params] = useSearchParams()
    const s = params.get('acs')

    const currentUser = props.user

    return <Layout user={currentUser}>
        <div className={'w-100 h-100 overflow-scroll'}>
            <Form className={'mt-1'}>
                <InputGroup>
                    <input type={"text"}
                           className={"form-control text-bg-light"}
                           name={"acs"}
                           value={s || undefined}
                           placeholder={"興味のあることを検索"}
                           aria-label={"search"} />
                    <Button variant={"primary"}>
                        <i className="fa-solid fa-magnifying-glass"/>
                    </Button>
                </InputGroup>
            </Form>
            <ExploreContent s={s} />
        </div>
    </Layout>
}

function ExploreContent(props: {
    s: string|null
}) {
    const {s} = props

    if (s === null) return <ExploreTabs />

    const [postArray] = usePosts()
    const { posts, isLoading, isSuccess } = postArray
    const [user] = useCurrentUser()

    if (isLoading) {
        return (<div className={"d-flex align-items-center justify-content-center w-100 h-100 overflow-scroll"}>
            <LoadingAnimation />
        </div>)
    } else if (isSuccess) {
        return (<>
            <div className={"w-100 h-100 overflow-scroll"}>
                {posts.map(it => <Post post={it} readingUser={user} key={it.slug} />)}
            </div>
        </>)
    } else {
        return (<div className={"w-100 h-100 overflow-scroll"}>
            <span>ロード中にエラーが発生しました</span>
        </div>)
    }
}

function ExploreTabs() {
    return <>
        <div className={'mt-1'}>
            <ul className={'nav nav-tabs'} role={'tablist'}>
                <li className={'nav-item active'} role={'presentation'}>
                    <button type={'button'}
                            data-bs-toggle={'tab'}
                            data-bs-target={'#trends'}
                            role={'tab'}
                            className={'nav-link'}>
                        トレンド
                    </button>
                </li>
                <li className={'nav-item'} role={'presentation'}>
                    <button type={'button'}
                            data-bs-toggle={'tab'}
                            data-bs-target={'#clubs'}
                            role={'tab'}
                            className={'nav-link'}>
                        部活動
                    </button>
                </li>
            </ul>
            <div className={'tab-content'}>
                <div id={'trends'}
                     role={'tabpanel'}
                     className={'tab-pane fade show active'}>

                </div>
                <div id={'clubs'}
                     role={'tabpanel'}
                     className={'tab-pane fade'}>
                    <Clubs />
                </div>
            </div>
        </div>
    </>
}

function Clubs() {
    const [{users, isLoading, isSuccess}] = useUsers({
        roles: ['asmo_club']
    })

    if (isLoading) {
        return <div className={'d-flex justify-content-center w-100 h-100'}>
            <LoadingAnimation />
        </div>
    }

    if (isSuccess) {
        return <UserList users={users} />
    }
}

type UserListProps = {
    users: User[]
}
function UserList(props: UserListProps) {
    return <div className={'w-100 h-100'}>
        {props.users.map(user => <UserListItem user={user} key={UUID.generateShort()} />)}
    </div>
}

type UserListItemProps = {
    user: User
}

function UserListItem(props: UserListItemProps) {
    return <>
        <a className={'w-100 d-flex link-dark align-items-center text-decoration-none mx-1 my-2'} href={'/community/user/' + props.user.slug}>
            <ImageIcon src={props.user.icon} circle={true} size={24} className={'me-2'} />
            <span>{props.user.name}</span>
            <small className={'link-secondary'}>@{props.user.slug}</small>
        </a>
    </>
}