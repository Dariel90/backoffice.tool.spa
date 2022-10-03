import { Property } from "./property";

export interface AddUpdateMessage{
    messageId: number;
    sourceId: number | null;
    name: string;
    description: string;
    kafkaTopicId: number | null;
    messageProperties: Property[];

}