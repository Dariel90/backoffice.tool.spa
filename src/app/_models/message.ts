import { Property } from "./property";

export interface Message{
    id: number;
    name:string;
    description: string;
    kafkaTopicId: number | null;
    kafkaTopic: string;
    sourceId: number | null;
    sourceName: string;
    properties: Property[];
}