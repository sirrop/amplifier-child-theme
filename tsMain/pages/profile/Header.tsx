import React, {useEffect, useState} from "react";
import {User} from "../../models/users/User";
import {UUID} from "../../util/UUID";
import {Button, Form, Modal, Spinner} from "react-bootstrap";
import {server} from "../../server";
import {useUser} from "../../util/Hooks";
import {ImageIcon} from "../../components/ImageIcon";
import {Link} from "react-router-dom";


const header = {
    "default": "https://images.unsplash.com/photo-1488866022504-f2584929ca5f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=862&q=80"
}

const ALLOWED_IMAGE_MIME = "image/jpeg image/png image/gif"

type FollowState = {
    follows: number[]
    followers: number[]
}

export function Header(props: {
    user: User,
    reader: User
}) {
    const { user, reader } = props;
    const [visibleSettingModal, setVisibleSettingModal] = useState(false)

    const [followState, setFollowState] = useState<FollowState>({ follows: user.follows, followers: user.followers })

    const styles = {
        userName: {
            fontSize: "1.5em"
        },
        icon: {
            fontSize: ".8em",
        },
        iconBtn: {

        },
        userSlug: {
            color: "gray",
            fontSize: ".8em"
        }
    }

    useEffect(() => {
        server.getUser(user.id)
            .then(console.log)
            .catch(console.error)
    })

    return (
        <div className="profile-header mb-2">
            <HeaderImage url={header['default']} />
            <SNSBand />
            <div className="d-flex mx-1">
                <UserIcon icon={user.icon} />
                <div className={"flex-grow-1"}>
                    <div className={"d-flex align-content-center justify-content-between ms-2"}>
                        <div style={styles.userName}>{user.name}</div>
                        {user === reader ?<div>
                            <SettingButton user={user} setVisible={setVisibleSettingModal} />
                            <EditSettingModal user={user} visible={visibleSettingModal} setVisible={setVisibleSettingModal} key={UUID.generateShort()} />
                        </div> : <FollowButton user={user} reader={reader} state={followState} onChange={setFollowState} />}
                    </div>
                    <div className={"ms-2"} style={styles.userSlug}>@{user.slug}</div>
                    <div className={"d-flex justify-content-between"}>
                        <div>
                            <Follow state={followState} />
                            <Follower state={followState} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Follow(props: {
    state: FollowState
}) {
    const {state} = props
    const [isVisible, setVisible] = useState(false)

    function show() {
        setVisible(true)
    }

    function close() {
        setVisible(false)
    }

    return <>
        <button type={"button"}
                onClick={show}
                className={"btn py-1 px-2 me-2"}>
            <small>Follow {state.follows.length}人</small>
        </button>
        <Modal show={isVisible} animation={true} centered scrollable fullscreen={"sm-down"}>
            <Modal.Header>
                <Button variant={'light'}
                        onClick={close}>
                    <i className="fa-solid fa-angle-left"></i>
                </Button>
            </Modal.Header>
            <Modal.Body style={{ minHeight: '40vh' }}>
                <UserList users={state.follows} />
            </Modal.Body>
        </Modal>
    </>
}

function Follower(props: {
    state: FollowState
}) {
    const {state} = props
    const [isVisible, setVisible] = useState(false)

    function show() {
        setVisible(true)
    }

    function close() {
        setVisible(false)
    }

    return <>
        <button type={"button"}
                onClick={show}
                className={"btn py-1 px-2"}>
            <small>Follower {state.followers.length}人</small>
        </button>
        <Modal show={isVisible} animation={true} centered scrollable fullscreen={"sm-down"}>
            <Modal.Header>
                <Button variant={'light'}
                        onClick={close}>
                    <i className="fa-solid fa-angle-left"></i>
                </Button>
            </Modal.Header>
            <Modal.Body style={{
                minHeight: '40vh'
            }}>
                <UserList users={state.followers} />
            </Modal.Body>
        </Modal>
    </>
}

type UserListProps = {
    users: number[]
}

function UserList(props: UserListProps) {
    return <div>
        {props.users.map(it => <UserListItem user={it} key={UUID.generateShort()} />)}
    </div>
}

type UserListItemProps = {
    user: number
}

function UserListItem(props: UserListItemProps) {
    const {user, isLoading, isSuccess} = useUser(props.user)

    if (isLoading) {
        return <Spinner animation={'border'}>
            <span className={'visually-hidden'}>Loading...</span>
        </Spinner>
    }

    if (isSuccess) {
        return <>
            <Link className={'link-dark text-decoration-none d-flex align-items-center my-1'} to={'/community/user/' + user.slug}>
                <ImageIcon src={user.icon} size={24} circle={true} />
                <span>{user.name}</span>
                <small className={'link-secondary'}>@{user.slug}</small>
            </Link>
        </>
    }
}

function HeaderImage(props: {
    url: string
}) {
    return <div className={"mb-2"} style={{
        height: "200px",
        background: `url("${props.url}")`
    }} />
}

function SNSBand(props: {
    twitter?: string,
    instagram?: string,
    facebook?: string
}) {
    // ここの三項間直すのめんどくさくて条件を反転しました
    const urls = {
        twitter: !props.twitter ? props.twitter : `https://twitter.com/${props.twitter}`,
        instagram: !props.instagram ? props.instagram : `https://instagram.com/${props.instagram}`,
        facebook: !props.facebook ? props.facebook : `https://facebook.com/${props.facebook}`,
        isAnyValid: () => {
            const self = urls;
            return self.twitter || self.instagram || self.facebook
        }
    }

    const SNSIcon = (props: {
        url: string|undefined,
        children: JSX.Element|string
    }) => {
        if (props.url) {
            return <a href={props.url} className={"btn link-light"}>{props.children}</a>
        }
    }

    if (urls.isAnyValid()) {
        return <div className={"rounded sns-band"} style={{
            background: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(2px)",
            width: "max-content",
            transform: "translateY(-115%)",
            marginBottom: "-2rem"
        }}>
            <SNSIcon url={urls.twitter}>
                <i className={"fab fa-twitter"} />
            </SNSIcon>
            <SNSIcon url={urls.facebook}>
                <i className="fab fa-facebook" />
            </SNSIcon>
            <SNSIcon url={urls.instagram}>
                <i className="fab fa-instagram" />
            </SNSIcon>
        </div>
    } else {
        return <></>
    }
}

function UserIcon(props: {
    icon: string
}) {
    return <img src={props.icon}
                alt={Alt.ICON}
                className="rounded-circle me-2"
                width="96"
                height="96"
    />
}

function SettingButton(props: {
    user: User,
    setVisible: (boolean) => void
}) {
    const {setVisible} = props
    const show = () => setVisible(true)

    return <Button variant={"outline-primary"}
                   onClick={show}
                   className={"border-0"}>
        <i className="fa-solid fa-gear" style={{
            fontSize: ".8em",
        }} />
    </Button>
}

function EditSettingModal(props: {
    user: User,
    visible: boolean,
    setVisible: (boolean) => void
}) {
    const { visible, setVisible } = props
    const [proxy, setProxy] = useState(Object.assign({}, props.user))
    const close = () => setVisible(false)
    const publish = () => {}

    return <Modal show={visible} centered scrollable fullscreen={"sm-down"}>
        <Modal.Header>
            <div>
                <Button variant={"light"} onClick={close}>
                    <i className="fa-solid fa-x"></i>
                </Button>
                <span>プロフィールを編集</span>
            </div>
            <Button variant={"primary"} onClick={() => {
                publish()
                close()
            }}>
                保存
            </Button>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group controlId={UUID.generateShort()} className={"mb-3"}>
                    <div style={{
                        height: "200px",
                        background: `url("${header['default']}")`
                    }} />
                    <Form.Control type={"file"} accept={ALLOWED_IMAGE_MIME} hidden />
                    <div className={"d-flex justify-content-center"}>
                        <Form.Label className={"btn-add-photo position-relative"}
                                    style={{
                                        top: "-100px",
                                        transform: "translateY(-50%)"
                                    }}>
                            <i className="fa-regular fa-image"></i>
                        </Form.Label>
                    </div>
                </Form.Group>

                <Form.Group controlId={UUID.generateShort()} className={"mb-3"}>
                    <img src={proxy.icon} alt={Alt.ICON} className={"rounded-circle"} width={"96"} height={"96"} />
                    <Form.Control type={"file"} accept={ALLOWED_IMAGE_MIME} hidden />
                    <Form.Label className={"btn-add-photo position-relative"} style={{
                        left: "-24px",
                        top: "-24px"
                    }}>
                        <i className="fa-regular fa-image"></i>
                    </Form.Label>
                </Form.Group>
                <Form.Group controlId={UUID.generateShort()} className={"mb-3"}>
                    <Form.Label>名前</Form.Label>
                    <Form.Control type={"text"} value={proxy.name} onChange={e => setProxy({ ...proxy, name: e.target.value })} />
                </Form.Group>
                <Form.Group controlId={UUID.generateShort()} className={"mb-3"}>
                    <Form.Label>バイオ</Form.Label>
                    <Form.Control type={"textarea"} value={proxy.bio} onChange={e => setProxy({...proxy, bio: e.target.value})} />
                </Form.Group>
            </Form>
        </Modal.Body>
    </Modal>
}

type FollowButtonProps = {
    user: User
    reader: User
    state: FollowState
    onChange: (state: FollowState) => void
}

function FollowButton(props: FollowButtonProps) {
    const { user, reader, state, onChange } = props

    const isFollowing = state.followers.includes(reader.id)

    const text = isFollowing ? 'フォロー中' : 'フォロー'
    const variant = isFollowing ? 'outline-primary' : 'primary'

    // FIXME : server側のレスポンスを待機してから、onChangeを発火するともっさりする
    function follow() {
        if (state.followers.includes(reader.id) && reader.follows.includes(user.id)) return

        const newUser: User = {
            ...user,
            followers: [...user.followers, reader.id]
        }
        const newReader: User = {
            ...reader,
            follows: [...reader.follows, user.id]
        }
        console.log('User')
        console.log(newUser)
        console.log('Reader')
        console.log(newReader)
        server.updateUser(newUser)
            .then(() => server.updateUser(newReader))
            .then(() => onChange({ follows: newUser.follows, followers: newUser.followers }))
            .catch(err => {
                console.error(err)
                server.updateUser(user).catch(console.error)
            })
    }

    // FIXME : server側のレスポンスを待機してから、onChangeを発火するともっさりする
    function unfollow() {
        if (!state.followers.includes(reader.id) && !reader.follows.includes(user.id)) return

        const newUser: User = {
            ...user,
            followers: user.followers.filter(it => it !== reader.id)
        }
        const newReader: User = {
            ...reader,
            follows: reader.follows.filter(it => it !== user.id)
        }
        server.updateUser(newUser)
            .then(() => server.updateUser(newReader))
            .then(() => onChange({ follows: newUser.follows, followers: newUser.followers }))
            .catch(err => {
                console.error(err)
                server.updateUser(user).catch(console.error)
            })
    }

    const onClick = isFollowing ? unfollow : follow

    return <Button variant={variant} onClick={onClick}>{text}</Button>
}


const Alt = {
    ICON: "Icon"
}
