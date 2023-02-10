import {EditorState} from "./EditorState";

export interface EditorProps {
    type: 'comment' | 'post'
    editorState?: EditorState
    placeholder?: string
    onChange?: (state: EditorState) => void
}