import React from "react";
import {EditorProps} from "./EditorProps";
import {EditorState} from "./EditorState";
import {Button, ButtonGroup, Form, InputGroup} from "react-bootstrap";
import { UUID } from "../../util/UUID";
import {Children} from "../../models/Children";
import {format} from "date-fns";
import {EventData} from "../../models/post/EventData";

export function Editor(props: EditorProps) {
    const {
        type,
        editorState = new EditorState(),
        placeholder = "",
        onChange
    } = props

    const canPostEvent = type === 'post'

    const setContent = (content: string) => {
        editorState.content = content
        if (!onChange) onChange(editorState)
    }

    const imageInputId = UUID.generateShort()

    const onImageInput = (e) => {
        const file = e.currentTarget.files[0]
        const reader = new FileReader()
        reader.onload = () => {
            onChange({
                ...editorState,
                photos: [...editorState.photos, reader.result as string]
            })
        }
        reader.readAsDataURL(file)
    }

    const removePhoto = (url: string) => {
        onChange({ ...editorState, photos: editorState.photos.filter(it => it !== url) })
    }

    const addEventData = () => {
        if (editorState.eventData) return

        const now = new Date()

        onChange({
            ...editorState,
            eventData: {
                date: format(now, 'yyyy-MM-dd'),
                startTime: format(now, 'HH:mm'),
                endTime: format(now, 'HH:mm'),
                limit: -1,
                deadline: now,
                participants: []
            }
        })
    }

    const removeEventData = () => {
        onChange({
            ...editorState,
            eventData: undefined
        })
    }

    const toggleEventData = () => {
        if (editorState.eventData) {
            removeEventData()
        } else {
            addEventData()
        }
    }

    return (<div className={"editor h-100 overflow-scroll"}>
        <div className={"editor-content d-flex flex-column h-100"}>
            {/* EventData Viewer */}
            <EventDataViewer state={editorState} onChange={onChange} />
            
            <div contentEditable={"true"}
                 placeholder={placeholder}
                 onInput={(event) => {
                     setContent((event.target as HTMLElement).innerHTML)
                 }}
                 dangerouslySetInnerHTML={{ __html: editorState.content }}
                 className={"flex-grow-1 p-4 editor-body"}>
            </div>
            {props.editorState.photos.length > 0 ? <hr /> : <></>}
            {/* Photo View */}
            <div className={"d-flex"}>
                {editorState.photos.map(url => <div key={UUID.generateShort()}>
                    <div className={"btn-remove-photo"}
                         style={{
                             position: "relative",
                             top: "calc(-36px + 0.2rem)",
                             right: "-1rem"
                         }}
                         onClick={() => removePhoto(url)}>
                        <i className="fa-solid fa-x"></i>
                    </div>
                    <img src={url} alt={""} className={"shadow-sm"} height={72}/>
                </div>)}
            </div>
            <hr />
            <div className={"d-flex overflow-scroll"}>
                <Form.Group className={"me-2"} controlId={imageInputId}>
                    <Form.Control type={"file"} disabled={editorState.photos.length >= 4} hidden={true} accept={"image/jpeg,image/png,image/gif"} onInput={onImageInput} />
                    <Form.Label className={"link-primary"} title={"写真を追加する"}>
                        <i className="fa-solid fa-image"></i>
                    </Form.Label>
                </Form.Group>

                {canPostEvent ? <span className={"link-primary"} onClick={toggleEventData}>
                    <i className="fa-regular fa-calendar"></i>
                </span> : null}
            </div>
        </div>
    </div>)
}

type UpdateEventDataArgs = {
    date?: string
    startTime?: string
    endTime?: string
    limit?: number
    deadline?: Date
}

type UpdateEventDataFunc = (args: UpdateEventDataArgs) => void

function makeUpdateEventDataFunc(state: EditorState, onChange: (EditorState) => void): UpdateEventDataFunc {
    return (args: UpdateEventDataArgs) => {
        const origin = state.eventData
        const evt: EventData = {
            date: args.date ?? origin.date,
            startTime: args.startTime ?? origin.startTime,
            endTime: args.endTime ?? origin.endTime,
            limit: args.limit ?? origin.limit,
            deadline: args.deadline ?? origin.deadline,
            participants: origin.participants
        }
        const val: EditorState = {
            ...state,
            eventData: evt
        }
        console.log(JSON.stringify(val))
        onChange(val)
    }
}

function EventDataViewer(props: {
    state: EditorState,
    onChange: (EditorState) => void
}) {
    const { state, onChange } = props
    const { eventData } = state

    if (eventData === undefined) {
        return <></>
    }

    const limitParticipants = eventData.limit < 0

    const setLimitParticipants = (limit: number) => {
        onChange({
            ...state,
            eventData: {
                ...eventData,
                limit: limit
            }
        })
    }

    const updateEventData: UpdateEventDataFunc = makeUpdateEventDataFunc(state, onChange)
    const ids = {
        date: UUID.generateShort(),
        startTime: UUID.generateShort(),
        endTime: UUID.generateShort(),
        deadline: {
            date: UUID.generateShort(),
            time: UUID.generateShort()
        }
    }

    return <>
        <div>
            <Form>
                <div className={"mb-3"}>
                    <Form.Label htmlFor={ids.date}>開催日</Form.Label>
                    <InputGroup>
                        <Form.Control type={"date"}
                                      id={ids.date}
                                      value={eventData.date}
                                      onInput={e => updateEventData({ date: e.currentTarget.value })} />
                        <InputGroupLabel htmlFor={ids.date}>
                            <i className="fa-solid fa-calendar-days"></i>
                        </InputGroupLabel>
                    </InputGroup>
                </div>



                <div className={"mb-3"}>
                    <Form.Label>時間</Form.Label>
                    <InputGroup>
                        <Form.Control type={"time"}
                                      id={ids.startTime}
                                      value={eventData.startTime}
                                      onInput={e => {
                                          updateEventData({ startTime: e.currentTarget.value })
                                      }} />
                        <InputGroupLabel htmlFor={ids.startTime}>
                            <i className="fa-solid fa-clock"></i>
                        </InputGroupLabel>
                        <InputGroup.Text>-</InputGroup.Text>
                        <Form.Control type={"time"}
                                      id={ids.endTime}
                                      value={eventData.endTime}
                                      onInput={e => updateEventData({ endTime: e.currentTarget.value })} />
                        <InputGroupLabel htmlFor={ids.endTime}>
                            <i className="fa-solid fa-clock"></i>
                        </InputGroupLabel>

                    </InputGroup>
                </div>

                <div className={"d-flex justify-content-between align-items-center mb-1"}>
                    <div>定員</div>
                    <ButtonGroup>
                        <Button variant={"light"} className={limitParticipants ? "active" : ""} onClick={() => setLimitParticipants(-1)}>制限なし</Button>
                        <Button variant={"light"} className={limitParticipants ? "" : "active"} onClick={() => setLimitParticipants(10)}>固定</Button>
                    </ButtonGroup>
                </div>
                {
                    limitParticipants
                        ? <></>
                        : <div className={"mb-3"}>
                            <InputGroup>
                                <Form.Control type={"number"}
                                              value={eventData.limit}
                                              min={0}
                                              onInput={e => updateEventData({ limit: parseInt(e.currentTarget.value, 10) })} />
                                <InputGroup.Text>人</InputGroup.Text>
                            </InputGroup>
                          </div>
                }
                <div>
                    <Form.Label>受付締切</Form.Label>
                    <InputGroup>
                        <Form.Control type={"date"}
                                      id={ids.deadline.date}
                                      value={format(eventData.deadline, 'yyyy-MM-dd')}
                                      onInput={e => {
                                          const date = new Date(eventData.deadline)
                                          const data = e.currentTarget.value
                                              .split('-')
                                              .map(it => parseInt(it, 10))
                                          date.setFullYear(data[0])
                                          date.setMonth(data[1] - 1)
                                          date.setDate(data[2])
                                          updateEventData({ deadline: date })
                                      }} />
                        <InputGroupLabel htmlFor={ids.deadline.date}>
                            <i className="fa-solid fa-calendar-days"></i>
                        </InputGroupLabel>

                        <Form.Control type={"time"}
                                      id={ids.deadline.time}
                                      value={format(eventData.deadline, 'HH:mm')}
                                      onInput={e => {
                                          const date = new Date(eventData.deadline)
                                          const data = e.currentTarget.value
                                              .split(':')
                                              .map(it => parseInt(it, 10))
                                          date.setHours(data[0])
                                          date.setMinutes(data[1])
                                          updateEventData({ deadline: date })
                                      }} />
                        <InputGroupLabel htmlFor={ids.deadline.time}>
                            <i className="fa-solid fa-clock"></i>
                        </InputGroupLabel>


                    </InputGroup>
                </div>
            </Form>
        </div>
        <hr />
    </>
}

function InputGroupLabel(props: {
    htmlFor?: string,
    children: Children
}) {
    return <InputGroup.Text className={"position-relative"}>
        <Form.Label htmlFor={props.htmlFor} className={"my-auto stretched-link"} style={{ cursor: "pointer" }}>
            {props.children}
        </Form.Label>
    </InputGroup.Text>
}