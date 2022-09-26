import { SourceMessages } from "./sourceMessages";
import { SourceTopic } from "./sourceTopics";

export interface Source {
    sourceId: number;
    name: string;
    sourceMessages: SourceMessages[];
    sourceTopics: SourceTopic[]
  }