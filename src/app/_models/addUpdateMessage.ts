import { Property } from "./property";

export interface AddUpdateMessage{
    messageId: number;
    sourceId: number | null;
    name: string | null;
    description: string;
    kafkaTopicId: number | null;
    messageProperties: Property[];
    kafkaTopic: string
}