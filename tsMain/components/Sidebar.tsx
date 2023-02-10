import React, {useState} from "react";
import {Link, To, useLocation} from "react-router-dom";
import {RoutePaths, userPathOf} from "../models/RoutePaths";
import {Guest} from "../models/users/Guest";
import {Button, Dropdown, Nav} from "react-bootstrap";
import {useWindowSize} from "../util/Hooks";
import {server} from "../server";
import {settings} from "../settings";
import {User} from "../models/users/User";

interface SideNavResource {
    readonly home: JSX.Element
    readonly profile: JSX.Element
    readonly notification: JSX.Element
    readonly explore: JSX.Element
    readonly logout: JSX.Element
    readonly login: JSX.Element
    readonly register: JSX.Element
    readonly amplifier: JSX.Element
}

const strings: SideNavResource = {
    home: <>ホーム</>,
    profile: <>プロフィール</>,
    notification: <>通知</>,
    explore: <>検索</>,
    logout: <>ログアウト</>,
    login: <>ログイン</>,
    register: <>会員登録</>,
    amplifier: <>Amplifierトップ</>
}

const icons: SideNavResource = {
    home: <i className="fa-solid fa-house"></i>,
    profile: <i className="fa-solid fa-user"></i>,
    notification: <i className="fa-solid fa-bell"></i>,
    explore: <i className="fa-solid fa-magnifying-glass"></i>,
    logout: <>ログアウト</>,
    login: <>ログイン</>,
    register: <>会員登録</>,
    amplifier: <i className="fa-solid fa-a"></i>
}

const WIDTH_EXPAND = 768

interface SidebarProps {
    user: User
}

export function Sidebar(props: SidebarProps) {
    const [width] = useWindowSize()
    const defaultExpanded = width > WIDTH_EXPAND
    const [forceExpanded, setForceExpanded] = useState<boolean>(undefined)
    const expanded: boolean = forceExpanded ?? defaultExpanded

    const onClick = () => setForceExpanded(!expanded)
    const isLoggedIn = props.user !== Guest.getInstance()

    const classes = {
        container: "py-3 text-bg-light h-100 sidebar auto-expanded",
    }

    if (forceExpanded === true) {
        classes.container += " expanded"
    } else if (forceExpanded === false) {
        classes.container += " closed"
    }

    if (expanded) {
        return (<div className={classes.container}>
            <ToggleButton user={props.user} expanded={expanded} onClick={onClick} />
            <hr />
            <div className={"d-flex flex-column flex-shrink-0 p-3 overflow-scroll"}>
                <SideNav user={props.user} expanded={expanded} isLoggedIn={isLoggedIn} />
            </div>
            <hr />
            <a href={server.url}>{strings.amplifier}</a>
        </div>)
    } else {
        return (<div className={classes.container}>
            <ToggleButton user={props.user} expanded={expanded} onClick={onClick} />
            <hr />
            <div className={"d-flex flex-column flex-shrink-0 p-3 overflow-scroll"}>
                <SideNav user={props.user} expanded={expanded} isLoggedIn={isLoggedIn} />
            </div>
            <hr />
            <Dropdown className={"d-grid"}>
                <Dropdown.Toggle variant={"light"}>
                    <i className="fa-solid fa-user"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <DropdownMenuItem to={RoutePaths.LOGIN}>{strings.login}</DropdownMenuItem>
                    <DropdownMenuItem to={RoutePaths.SIGNUP}>{strings.register}</DropdownMenuItem>
                </Dropdown.Menu>
            </Dropdown>
            <div className={"d-grid"}>
                <a href={server.url} className={"btn btn-light"}>{icons.amplifier}</a>
            </div>
        </div>)
    }
}

function ToggleButton(props: {
    user: User
    expanded: boolean,
    onClick: () => void
}) {
    if (props.expanded) {
        return (<div className={"d-flex justify-content-between"}>
            <UserDisplay user={props.user}/>
            <Button variant={"light"} onClick={props.onClick}>
                <i className="fa-solid fa-angles-left"></i>
            </Button>
        </div>)
    } else {
        return (<div className={"d-grid"}>
            <Button variant={"light"} onClick={props.onClick}>
                <i className={"fa-solid fa-bars"}></i>
            </Button>
        </div>)
    }
}

function UserDisplay(props: {
    user: User
}) {
    const currentUser = props.user
    const isGuest = currentUser === Guest.getInstance()

    if (isGuest) {
        return (<Dropdown>
            <Dropdown.Toggle variant={"light"}>
                <img className={"rounded-circle me-2"}
                     src={currentUser.icon}
                     alt={"Icon"}
                     width={"24"}
                     height={"24"} />
                <span className={"overflow-hidden"}>{currentUser.name}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <DropdownMenuItem to={RoutePaths.LOGIN}>{strings.login}</DropdownMenuItem>
                <DropdownMenuItem to={RoutePaths.SIGNUP}>{strings.register}</DropdownMenuItem>
            </Dropdown.Menu>
         </Dropdown>)
    } else {
        return (<div>
            <Link to={userPathOf({ slug: currentUser.slug, to: RoutePaths.PROFILE })}>
                <img className={"rounded-circle me-2"}
                     src={currentUser.icon}
                     alt={"Icon"}
                     width={"24"}
                     height={"24"} />
                <span className={"overflow-hidden"}>{currentUser.name}</span>
            </Link>
            <Dropdown>
                <Dropdown.Toggle variant={"light"} />
                <Dropdown.Menu>
                    <DropdownMenuItem to={RoutePaths.LOGOUT}>{strings.logout}</DropdownMenuItem>
                </Dropdown.Menu>
            </Dropdown>
        </div>)
    }
}

function DropdownMenuItem(props: {
    to: To,
    children: JSX.Element
}) {
    return <Link to={props.to} className={"dropdown-item"}>{props.children}</Link>
}

function SideNav(props: {
    user: User,
    expanded: boolean,
    isLoggedIn: boolean
}) {
    const resource = getSideNavStrings(props.expanded)
    const listClass = "nav nav-pills flex-column overflow-scroll mb-auto"

    if (props.isLoggedIn) {
        return (<ul className={listClass}>
            <NavItem to={RoutePaths.TOP}>{resource.home}</NavItem>
            <NavItem to={userPathOf({ slug: props.user.slug, to: RoutePaths.PROFILE })}>{resource.profile}</NavItem>
            <NavItem to={RoutePaths.EXPLORE}>{resource.explore}</NavItem>
            <DebugNav />
        </ul>)
    } else {
        return (<ul className={listClass}>
            <NavItem to={RoutePaths.TOP}>{resource.home}</NavItem>
            <NavItem to={RoutePaths.EXPLORE}>{resource.explore}</NavItem>
            <DebugNav />
        </ul>)
    }
}

function DebugNav() {
    if (settings.debug) {
        return <NavItem to={RoutePaths.DEBUG}><i className="fa-solid fa-bug"></i></NavItem>
    } else {
        return <></>
    }
}

function getSideNavStrings(expanded: boolean): SideNavResource {
    if (expanded) {
        return strings
    } else {
        return icons
    }
}
function NavItem(props: {
    to: To,
    children: JSX.Element
}) {
    const location = useLocation()

    if (location.pathname === props.to) {
        return (<li className={"nav-item"}>
            <Link to={props.to}
                  className={"nav-link active"}
                  aria-current={"page"}>
                {props.children}
            </Link>
        </li>)
    } else {
        return (<li className={"nav-item"}>
            <Link to={props.to}
                  className={"nav-link"}>
                {props.children}
            </Link>
        </li>)
    }
}