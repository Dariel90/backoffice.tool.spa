import { SourceMessages } from "./sourceMessages";
import { SourceTopic } from "./sourceTopics";

export interface AddUpdateSource{
    sourceId: number;
    name: string;
    sourceTopics: SourceTopic[];
    sourceMessages: SourceMessages[]
}