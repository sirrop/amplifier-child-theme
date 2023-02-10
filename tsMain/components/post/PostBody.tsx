import React, {useEffect, useState} from "react";
import {PostState} from "./PostState";
import {Link} from "react-router-dom";
import {encodeId} from "../../util/IDs"
import { UUID } from "../../util/UUID";
import {Modal} from "react-bootstrap";
import {parse} from "../editor/ast/Parser";
import {removeHTMLTags} from "../../util/HTML";
import { format, addDays, addHours, addMinutes, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import {settings} from "../../settings";
import {EventBookBlockButton, EventBookButton, EventDataBadges, EventDataViewer} from "../Event";
import {useCurrentUser} from "../../util/Hooks";
import {PostModel} from "../../models/post/PostModel";

const strings = {
    secondsAgo: '秒前',
    minutesAgo: '分前',
    hoursAgo: '時間前'
} as const

export function PostBody(props: PostState & { onUpdate: (post: PostModel) => void }) {
    const { post, onUpdate } = props
    const { content, eventData } = post
    const excerpt = getExcerpt(content)
    const [user] = useCurrentUser()

    let dateText: string
    const now = new Date()
    if (now < addMinutes(post.date, 1)) {
        dateText = differenceInSeconds(now, post.date) + strings.secondsAgo
    } else if (now < addHours(post.date, 1)) {
        dateText = differenceInMinutes(now, post.date) + strings.minutesAgo
    } else if (now < addDays(post.date, 1)) {
        dateText = differenceInHours(now, post.date) + strings.hoursAgo
    } else {
        dateText = format(post.date, settings.format.datetime)
    }

    return (<>
        <Link to={'/community/post/' + encodeId(props.post.id)} className={"text-dark text-decoration-none d-block"}>
            <EventDataBadges data={eventData} />
            <EventDataViewer data={eventData} />
            <div>
                {parse(removeHTMLTags(excerpt))}
            </div>
        </Link>
        { props.post.photos.length > 0 ? <Photos photos={props.post.photos} /> : <></> }
        <EventBookBlockButton event={post} user={user} onUpdate={onUpdate} />
        <small className={"text-secondary"}>
            {dateText}
        </small>
    </>)
}

function getExcerpt(content: string): string {
    let isTag: boolean = false
    let isExcerpted: boolean = false
    let contentLength: number = 0
    let last = 0
    for (let index = 0, len = content.length; index < len; ++index) {
        const char = content.charAt(index)
        if (isTag) {
            isTag = (char !== '>')
            continue
        }

        if (char === '<') {
            isTag = true
            continue
        }

        contentLength += 1

        if (contentLength === 140) {
            isExcerpted = true
            last = index
            break
        }
    }

    if (isExcerpted) {
        return content.substring(0, last + 1) + '[...]'
    } else {
        return content
    }
}

function Photos(props: {
    photos: string[]
}) {
    const [image, setImage] = useState(-1)

    return <>
        <div>
            {props.photos.map((url, index) => <img src={url} alt={""} className={"d-inline-block border-light border-1 rounded"} style={{ maxWidth: "100%", cursor: "pointer" }} onClick={() => setImage(index)} key={UUID.generateShort()} />)}
        </div>
        <PhotoModal photos={props.photos} index={image} visible={image >= 0} hide={() => setImage(-1)} />
    </>
}

function PhotoModal(props: {
    photos: string[],
    index: number,
    visible: boolean,
    hide: () => void
}) {
    const { photos, index, visible, hide } = props

    const active = photos[index]

    return <Modal animation={true} show={visible} onHide={hide} centered>
        <Modal.Body>
            <div className={'carousel slide'} data-bs-ride={'carousel'}>
                <div className={'carousel-inner'}>
                    {photos.map(url => <div className={'carousel-item' + (url === active ? ' active' : '')} key={UUID.generateShort()}>
                        <img src={url} alt={""} className={"d-block w-100 rounded"} />
                    </div>)}
                </div>
            </div>
        </Modal.Body>
    </Modal>
}