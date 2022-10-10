export interface Property{
    id: number;
    name: string;
    type: number;
    isYours: boolean;
    messageId: string;
    messageName: string;
    myPropertyId: number;
    myPropertyName: string;
    myPropertyType: number;
    myMessageId: number | null;
    myMessageName : string,
    propertyRelations: PropertyRelation[]
}

export interface PropertyRelation{
    propertyId: number;
    propertyName: string;
    sourceId: number;
    sourceName: string;
    isStrongest: boolean;
    myPropertyId: number;
    myPropertyName: string
}