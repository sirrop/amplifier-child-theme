import React, {useEffect, useState} from "react";
import {Button, Modal} from "react-bootstrap";
import {Post} from "../components/post/Post";
import {usePosts} from "../util/Hooks";
import {Navigate, useSearchParams} from "react-router-dom";
import {UUID} from "../util/UUID";
import {Editor} from "../components/editor/Editor";
import {User} from "../models/users/User";
import {EditorState} from "../components/editor/EditorState";
import {server} from "../server";
import {Layout} from "../components/Layout";
import {LoadingAnimation} from "../components/LoadingAnimation";

export function Top(props: {
    user: User
}) {
    const { user } = props

    const [params] = useSearchParams()
    const pagename = params.get("asmo_pagename");

    if (pagename) {
        if (pagename === 'user') {
            const slug = params.get('user')
            return <Navigate replace to={`/community/user/${slug}`} />
        }
        return <Navigate replace to={`/community/${pagename}`} />
    } else {
        const currentUser = user

        return <>
            <Layout user={currentUser}>
                <Posts user={currentUser} />
            </Layout>
        </>
    }
}

function Posts(props: {
    user: User
}) {
    const [postArray, update] = usePosts()
    const { posts, isLoading, isSuccess } = postArray
    const {user} = props


    if (isLoading) {
        return (<div className={"d-flex align-items-center justify-content-center w-100 h-100 overflow-scroll"}>
            <LoadingAnimation />
        </div>)
    } else if (isSuccess) {
        return (<>
            <div className={"w-100 h-100 overflow-scroll"}>
                {posts.map(it => <Post post={it} readingUser={user} key={it.slug} />)}
            </div>
            <PostButtonAndEditorModal user={user} update={update} />
        </>)
    } else {
        return (<div className={"w-100 h-100 overflow-scroll"}>
            <span>ロード中にエラーが発生しました</span>
        </div>)
    }
}

function PostButtonAndEditorModal(props: {
    user: User,
    update: () => void
}) {
    const {user, update} = props
    const [visible, setVisible] = useState(false)
    const key = UUID.generateShort()

    if (user === User.getGuest()) {
        return <></>
    } else {
        return (<>
            <div>
                <AddPostButton setVisible={setVisible} />
            </div>
            <EditorModal user={user} visible={visible} setVisible={setVisible} update={update} key={key} />
        </>)
    }
}

function AddPostButton(props: {
    setVisible: (boolean) => void
}) {
    const {setVisible} = props
    const [hover, setHover] = useState(false)
    const shadow = hover ? "shadow-sm" : "shadow"
    const show = () => setVisible(true)

    return (<Button variant={"primary"}
                    className={`position-fixed ${shadow} rounded-circle`}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    onClick={show}
                    style={{
                        right: "1rem",
                        bottom: "1rem"
                    }}>
        <i className="fa-solid fa-plus"></i>
    </Button>)
}

function EditorModal(props: {
    user: User,
    visible: boolean,
    setVisible: (boolean) => void,
    update: () => void
}) {
    const { user, visible, setVisible, update } = props
    const [state, setState] = useState(new EditorState())

    const close = () => setVisible(false)

    const publish = () => {
        server.addPost({
            date: new Date(),
            slug: UUID.generateShort(),
            content: state.content,
            author: user,
            photos: state.photos,
            eventData: state.eventData
        }, 'publish')
            .then(res => res.json())
            .then(() => update())
            .catch(console.error)
    }

    return (<Modal show={visible} scrollable centered fullscreen={"sm-down"}>
        <Modal.Header>
            <Button variant={'light'}
                    onClick={close}>
                <i className="fa-solid fa-chevron-left" />
            </Button>
            <Button variant={'primary'}
                    onClick={() => {
                        publish()
                        close()
                    }}>
                投稿
            </Button>
        </Modal.Header>
        <Modal.Body>
            <Editor editorState={state}
                    type={'post'}
                    placeholder={"投稿を入力"}
                    onChange={setState}
                    key={UUID.generateShort()} />
        </Modal.Body>
    </Modal>)
}