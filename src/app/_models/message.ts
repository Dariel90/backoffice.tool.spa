import { Property } from "./property";

export class MessageData{
    id: number;
    name:string;
    description: string;
    kafkaTopicId: number | null;
    kafkaTopic: string;
    sourceId: number | null;
    sourceName: string;
}
export class Message extends MessageData{
    
    properties: Property[];
}