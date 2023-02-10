import {EventData} from "../../models/post/EventData";

export class EditorState {
    public constructor(
        public content: string = "",
        public hashtags: string[] = [],
        public photos: string[] = [],
        public eventData?: EventData
    ) {}
}