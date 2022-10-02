import { SourceMessages } from "./sourceMessages";
import { SourceTopic } from "./sourceTopics";

export interface Source {
    id: number;
    name: string;
    apiKey: string;
    creationDate: Date;
    messages: SourceMessages[];
    topics: SourceTopic[]
  }