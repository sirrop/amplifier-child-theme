import React, {useState} from "react";
import {Layout} from "../components/Layout";
import {User} from "../models/users/User";
import {useParams} from "react-router";
import {useComments, usePost} from "../util/Hooks";
import {decodeId} from "../util/IDs";
import {LoadingAnimation} from "../components/LoadingAnimation";
import {Button, Modal} from "react-bootstrap";
import {PostHeader} from "../components/post/PostHeader";
import {PostFooter} from "../components/post/PostFooter";
import {TODO} from "../util/NotImplemented"
import { UUID } from "../util/UUID";
import {EditorState} from "../components/editor/EditorState";
import { Editor } from "../components/editor/Editor";
import {parse} from "../components/editor/ast/Parser";
import {removeHTMLTags} from "../util/HTML";
import {format} from "date-fns";
import {settings} from "../settings";
import {EventBookBlockButton, EventDataBadges, EventDataViewer} from "../components/Event";
import {server} from "../server";
import {PostModel} from "../models/post/PostModel";
import {Comment} from "../components/post/Comment";

export function PostPage(props: {
    user: User
}) {
    const {user} = props
    const [deleted, setDeleted] = useState(false)
    const { id } = useParams()
    const [result, update] = usePost(decodeId(id))
    const { post, isLoading, isSuccess} = result

    if (deleted) {
        return <>投稿が削除されました</>
    }

    if (isLoading) {
        return <>
            <div className={"d-flex align-items-center justify-content-center w-100 h-100 overflow-scroll"}>
                <LoadingAnimation />
            </div>
        </>
    } else if (isSuccess) {
        const { date, author, content, eventData } = post
        const dateText = format(date, settings.format.datetime)

        return <>
            <Layout user={user}>
                <div className={'pt-2'}>
                    <PostHeader post={post} readingUser={author} />
                    <div>
                        <EventDataBadges data={eventData} />
                        <EventDataViewer data={eventData} />
                        <div>
                            {parse(removeHTMLTags(content))}
                        </div>
                        <EventBookBlockButton event={post} user={user} onUpdate={update} />
                        <small className={"text-muted"}>
                            {dateText}
                        </small>
                    </div>
                    <hr />
                    <PostFooter post={post} readingUser={user} onUpdate={TODO('PostPage.Footer')} onDelete={() => setDeleted(true)} />
                    <CommentInput user={user} post={post} />
                    <CommentList user={user} post={post} />
                </div>
            </Layout>
        </>
    } else {
        return <>ロード中にエラーが発生しました</>
    }
}

function CommentInput(props: {
    user: User,
    post: PostModel
}) {
    const { user, post } = props
    const [visible, setVisible] = useState(false)
    const show = () => setVisible(true)

    return <>
        <div className={"bg-secondary p-1"} style={{ cursor: 'pointer' }} onClick={show}>
            <div className={"text-muted bg-white px-2 py-1 rounded"}>
                コメントを入力
            </div>
        </div>
        <CommentModal post={post} user={user} visible={visible} setVisible={setVisible} key={UUID.generateShort()} />
    </>
}

function CommentModal(props: {
    post: PostModel,
    user: User,
    visible: boolean,
    setVisible: (boolean) => void
}) {
    const [editorState, setEditorState] = useState(new EditorState())
    const { visible, setVisible, user, post } = props

    const close = () => setVisible(false)
    const publish = () => {
        server.addComment({
            author: user.id,
            content: editorState.content,
            date: new Date(),
            parent: post.id,
            post: post.id
        })
    }

    return <>
        <Modal show={visible}>
            <Modal.Header>
                <Button variant={"light"} onClick={close}>
                    <i className="fa-solid fa-chevron-left"></i>
                </Button>
                <Button variant={"primary"} onClick={() => {
                    publish()
                    close()
                }}>
                    投稿
                </Button>
            </Modal.Header>
            <Modal.Body>
                <Editor type={'comment'} editorState={editorState} onChange={setEditorState} placeholder={"コメントを入力"} />
            </Modal.Body>
        </Modal>
    </>
}

function CommentList(props: {
    user: User,
    post: PostModel
}) {
    const { user, post } = props

    const [{comments, isLoading, isSuccess}, update] = useComments({
        parent: post.id,
        post: post.id
    })

    if (isLoading) return <>
        <div>
            <LoadingAnimation />
        </div>
    </>

    // FIXME: この状態だと、ネストされたコメントを表示できません
    if (isSuccess) return <div>
        {comments.map(comment => <Comment className={'my-1 shadow-sm'} user={user} comment={comment} onUpdate={update} key={UUID.generateShort()} />)}
    </div>

    return null
}