import React, {useState} from "react";
import {PostState} from "./PostState";
import {UUID} from "../../util/UUID";
import {PostModel} from "../../models/post/PostModel";
import {User} from "../../models/users/User";
import {Editor} from "../editor/Editor";
import {EditorState} from "../editor/EditorState";
import {Button, Modal, Spinner} from "react-bootstrap";
import {server} from "../../server";
import {vibrateOnce} from "../../util/vibration";
import {useComments} from "../../util/Hooks";

const resources = {
    comment: {
        submit: "投稿",
        placeholder: "コメントを追加"
    },
    star: "投稿をスターする",
    share: "共有",
    edit: "編集",
    delete: "削除",
    report: "投稿を報告する"
}

type UpdateHook = {
    onUpdate: (post: PostModel) => void
}

type DeleteHook = {
    onDelete: () => void
}

export function PostFooter(props: PostState & UpdateHook & DeleteHook) {
    const post = props.post
    const readingUser = props.readingUser

    const modalId = UUID.generateShort()

    return (<div className={"d-flex justify-content-between"} role={"menubar"}>
        <CommentButton post={post} readingUser={readingUser} target={`#${modalId}`} />
        <LikeButton post={post} readingUser={readingUser} onUpdate={props.onUpdate} />
        <ShareButton post={post} readingUser={readingUser} onUpdate={props.onUpdate} />
        <div></div>
        <div></div>
        <Menu post={post} readingUser={readingUser} onUpdate={props.onUpdate} onDelete={props.onDelete} />
        <CommentModal post={post} readingUser={readingUser} id={modalId} />
    </div>)
}

export function CommentButton(props: {
    post: PostModel,
    readingUser: User,
    target: string
}) {
    const { post, readingUser } = props
    const [{ comments, isLoading, isSuccess }] = useComments({
        post: post.id
    })

    const disabled = readingUser === User.getGuest()

    const Content = () => {
        return (<>
            <span className={"me-2 count count-comments"}>{
                isLoading ? <Spinner variant={"secondary"} style={{
                        width: '1em',
                        height: '1em'
                    }} />
                : isSuccess ? comments.length
                : <i className="fa-solid fa-xmark"></i>
            }</span>
            <i className="fas fa-comment"></i>
        </>)
    }

    if (disabled) {
        return <button className={"btn text-muted border-0"} disabled={true}>
            <Content />
        </button>
    }

    return (<button type={"button"}
                    className={"btn link-secondary"}
                    data-bs-toggle={"modal"}
                    data-bs-target={props.target}
                    role={"menu"}>
        <Content />
    </button>)
}

export function CommentModal(props: {
    post: PostModel,
    readingUser: User,
    id: string
}) {
    const { post, readingUser } = props
    const [editorState, setEditorState] = useState(new EditorState())

    const submit = () => {
        if (editorState.content) {
            server.addComment({
                author: readingUser.id,
                content: editorState.content,
                date: new Date(),
                parent: post.id,
                post: post.id
            }).then(console.log)
                .catch(console.error)
        } else {
            console.log("empty")
        }
    }

    return (<div className={"modal fade"} id={props.id} tabIndex={-1} data-bs-backdrop={"static"} aria-hidden={"true"}>
        <div className={"modal-dialog modal-fullscreen-md-down modal-dialog-scrollable"}>
            <div className={"modal-content"}>
                <div className={"modal-header"}>
                    <button type={"button"} className={"btn btn-primary"} data-bs-dismiss={'modal'} onClick={submit}>
                        {resources.comment.submit}
                    </button>
                    <button type={"button"}
                            className={"btn-close"}
                            data-bs-dismiss={"modal"}
                            aria-label={"Close"}></button>
                </div>
                <div className={"modal-body"}>
                    <Editor placeholder={resources.comment.placeholder}
                            type={'comment'}
                            editorState={editorState}
                            onChange={setEditorState} />
                </div>
            </div>
        </div>
    </div>)
}

function LikeButton(props: PostState & UpdateHook) {
    const { post, readingUser } = props

    const disabled = readingUser === User.getGuest()
    const Content = () => <>
        <span className={"me-2 count count-likes"}>{post.likedBy.length}</span>
        <i className="fas fa-heart"></i>
    </>

    if (disabled) {
        return <button className={"btn text-muted border-0"} disabled={true}>
            <Content />
        </button>
    }

    const isLike = post.likedBy.includes(readingUser.id)
    const likeButtonClass = "btn " + (isLike ? "link-danger" : "link-secondary")

    const onClick = () => {
        vibrateOnce()
        let postLikes: number[]
        let userLikes: number[]
        if (isLike) {
            postLikes = post.likedBy.filter(id => id !== readingUser.id)
            userLikes = readingUser.likes.posts.filter(id => id !== post.id)
        } else {
            postLikes = [...post.likedBy, readingUser.id]
            userLikes = [...readingUser.likes.posts, post.id]
        }
        props.onUpdate(Object.assign({}, post, {
            likes: postLikes
        }))
        server.updateUser(User.of({ ...readingUser, likes: {
                ...readingUser.likes,
                posts: userLikes
            }}))
            .then(console.log)
            .catch(console.log)
        server.updatePost({ ...post, likedBy: postLikes })
            .then(res => res.json())
            .then(console.log)
            .catch(console.log)
    }

    return (<div>
        <button type={"button"}
                    className={likeButtonClass}
                    onClick={onClick}
                    role={"menu"}>
            <Content />
        </button>
    </div>)
}

function ShareButton(props: PostState & UpdateHook) {
    const {post, readingUser} = props

    const Content = () => <>
        <span className={"me-2 count count-share"}>{post.sharedBy.length}</span>
        <i className="fas fa-retweet"></i>
    </>

    if (readingUser === User.getGuest()) {
        return <button className={"btn text-muted border-0"} disabled={true}>
            <Content />
        </button>
    }

    const isShared = post.sharedBy.includes(readingUser.id)
    const shareButtonClass = "btn " + (isShared ? "link-success" : "link-secondary")

    const onClick = () => {
        vibrateOnce()
        let postShares: number[]
        let userShares: number[]
        if (isShared) {
            postShares = post.sharedBy.filter(id => id !== readingUser.id)
            userShares = readingUser.shares.posts.filter(id => id !== post.id)
        } else {
            postShares = [...post.sharedBy, readingUser.id]
            userShares = [...readingUser.shares.posts, post.id]
        }
        props.onUpdate(Object.assign({}, post, {
            shares: postShares
        }))
        server.updateUser(User.of({ ...readingUser, shares: {
                ...readingUser.shares,
                posts: userShares
            }}))
            .then(console.log)
            .catch(console.error)
        server.updatePost({ ...post, sharedBy: postShares })
            .then(res => res.json())
            .then(console.log)
            .catch(console.error)
    }

    return (<button type={"button"}
                    className={shareButtonClass}
                    onClick={onClick}
                    role={"menu"}>
        <Content />
    </button>)
}

function Menu(props: PostState & UpdateHook & DeleteHook) {
    const { readingUser, post } = props
    const [visibleEditModal, setVisibleEditModal] = useState(false)
    const disabled = props.readingUser === User.getGuest()

    if (disabled) {
        return <div></div>
    }

    const onShare = () => {
        console.log("onShare")
        navigator.share({
            url: window.location.origin + '/community/?asmo_pagename=post/' + post.slug
        })
            .then(console.log)
            .catch(console.error)
    }

    const onEdit = () => {
        setVisibleEditModal(true)
    }

    const deletePost = () => {
        server.deletePost(props.post.id)
            .then(res => {
                console.log(res)
                props.onDelete()
            })
            .catch(console.log)
    }

    const sendReport = () => {

    }

    const IfPermitted = (props: {
        user: User,
        author: User,
        children: JSX.Element
    }) => {
        const { user, author, children } = props
        if (user.id === author.id) {
            return children
        } else {
            return <></>
        }
    }

    return (<>
        <div className={"dropdown"}>
            <button type={"button"}
                    className={"btn link-secondary dropdown-toggle"}
                    data-bs-toggle={"dropdown"}
                    aria-expanded={"false"}>
                <i className="far fa-ellipsis-v"></i>
            </button>
            <ul className={"dropdown-menu"}>
                {/*<li className={"dropdown-item"}>
                    <button type={"button"} className={"btn link-dark"}>{resources.star}</button>
                </li>*/}
                {/*<li className={"dropdown-item"}>
                    <button type={"button"} className={"btn link-dark"} onClick={onShare}>
                        {resources.share}
                    </button>
                </li>*/}
                {/*<li><hr className={"dropdown-divider"} /></li>*/}

                <IfPermitted user={readingUser} author={post.author}>
                    <li className={"dropdown-item"}>
                        <button type={"button"} className={"btn link-dark"} onClick={onEdit}>
                            <i className="fas fa-edit"></i> {resources.edit}
                        </button>
                    </li>
                </IfPermitted>

                <IfPermitted user={readingUser} author={post.author}>
                    <li　className={"dropdown-item"}>
                        <button type={"button"} className={"btn link-danger"} onClick={deletePost}>
                            <i className="fas fa-flag"></i> {resources.delete}
                        </button>
                    </li>
                </IfPermitted>

                {/*<li className={"dropdown-item"}>
                    <Button variant={"warning"} onClick={sendReport}>
                        <i className="fas fa-user-secret"></i> {resources.report}
                    </Button>
                </li>*/}
            </ul>
        </div>
        <EditorModal visible={visibleEditModal} setVisible={setVisibleEditModal} post={props.post} onUpdate={props.onUpdate} key={UUID.generateShort()} />
    </>)
}

function EditorModal(props: {
    visible: boolean,
    setVisible: (boolean) => void,
    post: PostModel
} & UpdateHook) {
    const { visible, setVisible, post } = props
    const [state, setState] = useState(new EditorState(post.content, [], post.photos, post.eventData))

    const close = () => setVisible(false)
    const publish = () => {
        server.updatePost({ ...post, content: state.content })
            .then(res => {
                console.log(res)
                props.onUpdate(Object.assign({}, props.post, { content: state.content }))
                server.getPost(post.id)
                    .then(props.onUpdate)
                    .catch(console.log)
            })
            .catch(console.log)
    }

    return <>
        <Modal show={visible} scrollable centered fullscreen={"sm-down"}>
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
                        onChange={setState} />
            </Modal.Body>
        </Modal>
    </>
}