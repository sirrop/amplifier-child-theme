import React from "react";

import {User} from "../../models/users/User";
import "bootstrap/dist/js/bootstrap";
import {usePosts} from "../../util/Hooks";
import {LoadingAnimation} from "../../components/LoadingAnimation";
import {Children} from "../../models/Children";
import {Post as PostComponent} from "../../components/post/Post";
import {UUID} from "../../util/UUID";

export function Body(props: {
    user: User,
    reader: User
}) {
    return (<div>
        <ul className="nav nav-tabs" role={"tablist"}>
            <li className="nav-item" role={"presentation"}>
                <button
                    className="nav-link active"
                    id={"tab-home"}
                    data-bs-toggle="tab"
                    data-bs-target="#home"
                    type="button"
                    role="tab"
                    aria-controls="home"
                    aria-selected="true"
                >
                    ホーム
                </button>
            </li>
            <li className="nav-item" role={"presentation"}>
                <button
                    className="nav-link"
                    id={"tab-post"}
                    data-bs-toggle="tab"
                    data-bs-target="#post"
                    type="button"
                    role="tab"
                    aria-controls="post"
                    aria-selected="false"
                >
                    投稿
                </button>
            </li>
            <li className={"nav-item"} role={"presentation"}>
                <button
                    className="nav-link"
                    data-bs-toggle="tab"
                    data-bs-target="#profile"
                    type="button"
                    role="tab"
                    aria-controls="profile"
                    aria-selected="false"
                >
                    概要
                </button>
            </li>
        </ul>
        <div className={"tab-content"}>
            <Home user={props.user} />
            <Post user={props.user} />
            <Profile user={props.user} />
        </div>
    </div>);
}

function Home(props: { user: User }) {
    const { user } = props
    const [result, update] = usePosts({
        author: [user.id]
    })
    const { posts, isLoading, isSuccess } = result

    const Tab = (props: { children: Children }) => (
        <div className={"tab-pane fade show active"}
             id={"home"}
             aria-labelledby={"tab-home"}
             role={"tabpanel"}>
            {props.children}
        </div>)

    if (isLoading) {
        return (<Tab>
            <LoadingAnimation />
        </Tab>)
    } else if (isSuccess) {
        return <Tab>
            {posts.map(post => <PostComponent post={post} readingUser={user} key={UUID.generateShort()} />)}
        </Tab>
    } else {
        return <Tab>
            <div onClick={update}>
                ロード中にエラーが発生しました
                <small>クリックして再ロード</small>
            </div>
        </Tab>
    }
}

function Post(props: {
    user: User
}) {
    const { user } = props
    const [result, update] = usePosts({
        author: [user.id]
    })
    const { posts, isLoading, isSuccess } = result

    const Tab = (props: { children: Children }) => (
        <div className={"tab-pane fade"}
             id={"post"}
             aria-labelledby={"tab-post"}
             role={"tabpanel"}>
            {props.children}
        </div>)

    if (isLoading) {
        return (<Tab>
            <LoadingAnimation />
        </Tab>)
    } else if (isSuccess) {
        return <Tab>
            {posts.map(post => <PostComponent post={post} readingUser={user} key={UUID.generateShort()} />)}
        </Tab>
    } else {
        return <Tab>
            <div onClick={update}>
                ロード中にエラーが発生しました
                <span className={"text-muted"}>click to reload</span>
            </div>
        </Tab>
    }
}

function Event() {
    return (<div className={"tab-pane fade"}
                 id={"event"}
                 aria-labelledby={"tab-event"}
                 role={"tabpanel"}>
        Event
    </div>)
}

function Profile(props: {
    user: User
}) {
    const {user} = props

    return (<div className={"tab-pane fade"}
                 id={"profile"}
                 aria-labelledby={"tab-profile"}
                 role={"tabpanel"}>
        <div>
            {user.bio}
        </div>
    </div>)
}