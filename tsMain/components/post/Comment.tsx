import React, {useState} from "react";
import {User} from "../../models/users/User";
import {CommentModel} from "../../models/CommentModel";
import {ImageIcon} from "../ImageIcon";
import {Link} from "react-router-dom";
import {parse} from "../editor/ast/Parser";
import {removeHTMLTags} from "../../util/HTML";
import {useComments} from "../../util/Hooks";
import {Button, Modal, Spinner} from "react-bootstrap";
import {Editor} from "../editor/Editor";
import {EditorState} from "../editor/EditorState";
import {UUID} from "../../util/UUID";
import {server} from "../../server";
import {vibrateOnce} from "../../util/vibration";

export type CommentProps = {
    user: User,
    comment: CommentModel,
    className?: string,
    onUpdate: () => void
}

export function Comment(props: CommentProps) {
    const { comment, className, onUpdate } = props
    const { author, id } = comment

    return <div id={'comment-' + id} className={'comment rounded shadow-sm p-2' + (className ? ' ' + className : '')}>
        <CommentHeader author={author} />
        <div className={'comment-body'}>
            {parse(removeHTMLTags(comment.content))}
        </div>
        <CommentFooter user={props.user} comment={comment} onUpdate={onUpdate} />
    </div>
}

function CommentHeader(props: {
    author: User
}) {
    const {author} = props

    return <Link className={'d-flex comment-header text-decoration-none'} to={'/community/user/' + author.slug}>
        <ImageIcon src={author.icon} circle={true} />
        <span className={'link-dark'}>{author.name}</span>
        <span className={'link-secondary'}>@{author.slug}</span>
    </Link>
}

function CommentFooter(props: CommentProps) {
    const { user, comment, onUpdate } = props

    return <>
        <hr />
        <div className={'d-flex'}>
            <CommentButtonAndModal comment={comment} user={user} onUpdate={onUpdate} />
            <button type={'button'} className={'btn'}>UV</button>
            <button type={'button'} className={'btn'}>Share</button>
            <button type={'button'} className={'btn'}>Menu</button>
        </div>
    </>
}

function CommentButtonAndModal(props: CommentProps) {
    const { comment, user, onUpdate } = props

    const [{ comments, isLoading, isSuccess }] = useComments({
        parent: comment.id
    })

    const [visible, setVisible] = useState(false)

    const show = () => setVisible(true)

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

    return (<>
        <button type={"button"}
                className={"btn link-secondary"}
                onClick={show}
                role={"menu"}>
            <Content />
        </button>
        <CommentModal comment={comment} user={user} onUpdate={onUpdate} visible={visible} setVisible={setVisible} key={UUID.generateShort()} />
    </>)

}

function CommentModal(props: CommentProps & {
    visible: boolean,
    setVisible: (isVisible: boolean) => void
}) {
    const { comment, user, onUpdate, visible, setVisible } = props
    const [state, setState] = useState(new EditorState())

    const close = () => setVisible(false)
    const publish = () => {
        server.addComment({
            author: user.id,
            content: state.content,
            date: new Date(),
            parent: comment.id,
            post: comment.post
        }).then(() => onUpdate())
    }


    return <Modal show={visible} centered scrollable animation fullscreen={'sm-down'}>
        <Modal.Header>
            <Button variant={'light'}
                    onClick={close}>
                <i className="fa-solid fa-chevron-left" />
            </Button>
            <Button variant={'primary'}
                    className={"btn btn-primary"}
                    onClick={() => {
                        publish()
                        close()
                    }}>
                投稿
            </Button>
        </Modal.Header>
        <Modal.Body>
            <Editor placeholder={'コメントを追加'}
                    type={'comment'}
                    editorState={state}
                    onChange={setState}
                    key={UUID.generateShort()} />
        </Modal.Body>
    </Modal>
}