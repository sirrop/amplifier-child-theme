import React from "react";
import {EventData} from "../models/post/EventData";
import {ButtonVariant} from "react-bootstrap/types";
import { Button } from "react-bootstrap";
import {PostModel} from "../models/post/PostModel";
import {User} from "../models/users/User";
import {server} from "../server";
import {format} from "date-fns";
import {settings} from "../settings";

export function EventDataBadges(props: {
    data?: EventData
}) {
    const {data} = props
    if (!data) return <></>

    const {
        limit,
        deadline,
        participants
    } = data

    const limitText = limit < 0 ? '定員なし' : `${participants.length}/${limit}`

    const bookingAvailable = canBook(new Date(deadline), limit, participants?.length || 0)

    return <div className={"mb-1 overflow-scroll"}>
        {
            bookingAvailable
            ? <span className={"badge bg-info rounded-pill"}>予約可能</span>
            : <span className={"badge bg-danger rounded-pill"}>予約不可</span>
        }
        <span className={"badge bg-light text-dark rounded-pill"}>
            <i className="fa-solid fa-user me-1"></i>
                {limitText}
        </span>
    </div>
}

export function EventDataViewer(props: {
    data?: EventData
}) {
    const { data } = props
    if (!data) return null

    const {
        date,
        startTime,
        endTime,
        deadline
    } = data


    const deadlineText = format(new Date(deadline), settings.format.datetime)

    return <>
        <table className={"table table-light"}>
            <tbody>
                <tr>
                    <th scope={"row"}>開催日</th>
                    <td>{date}</td>
                </tr>
                <tr>
                    <th scope={"row"}>開始時刻</th>
                    <td>{startTime}</td>
                </tr>
                <tr>
                    <th scope={"row"}>終了時刻</th>
                    <td>{endTime}</td>
                </tr>
                <tr>
                    <th scope={"row"}>締切</th>
                    <td>{deadlineText}</td>
                </tr>
            </tbody>
        </table>
    </>
}

export function EventBookButton(props: {
    variant?: ButtonVariant,
    className?: string
    event: PostModel,
    user: User,
    onUpdate: (event: PostModel) => void
}) {
    const { variant, className, event, user, onUpdate } = props

    if (user === User.getGuest()) {
        return <Button variant={variant} className={className} disabled>ログインしてください</Button>
    }

    function book() {
        onUpdate({
            ...event,
            eventData: {
                ...event.eventData,
                participants: [
                    ...event.eventData.participants || [],
                    user.id.toString()
                ]
            }
        })
    }

    function cancel() {
        onUpdate({
            ...event,
            eventData: {
                ...event.eventData,
                participants: [
                    ...(event.eventData.participants || []).filter(it => it !== user.id.toString())
                ]
            }
        })
    }

    if (!event.eventData.participants || !event.eventData.participants.includes(user.id.toString())) {
        return <>
            <Button variant={variant}
                    className={className}
                    onClick={() =>
                        server.bookEvent(event.id, user.id.toString())
                            .then(() => book())
                    }>
                予約する
            </Button>
        </>
    } else {
        return <>
            <Button variant={variant}
                    className={className}
                    onClick={() =>
                        server.cancelEvent(event.id, user.id.toString())
                            .then(() => cancel())
                    }>
                予約を解除する
            </Button>
        </>
    }
}

export function EventBookBlockButton(props: {
    variant?: ButtonVariant,
    className?: string
    event: PostModel,
    user: User,
    onUpdate: (event: PostModel) => void
}) {
    const { variant, className, event, user, onUpdate } = props

    if (!event.eventData) return <></>

    if (!canBook(
        new Date(event.eventData.deadline),
        event.eventData.limit,
        event.eventData.participants?.length
    )) {
        return <></>
    }

    return <div className={"d-grid"}>
        <EventBookButton event={event} user={user} onUpdate={onUpdate} variant={variant} className={className} />
    </div>
}

function canBook(deadline: Date, limit: number, numParticipants: number): boolean {
    if (new Date() >= deadline) return false
    if (limit < 0) return true
    return limit > numParticipants
}