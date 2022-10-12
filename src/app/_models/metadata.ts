export interface Metadata{
    propertyMetadata: MetadataDetails;
    property: PropertyDetails;
}

export class MetadataDetails{
    propertyMetadataId: number;
    propertyMetadataDescriptor : string;
    propertyMetaDataValue : string;
    propertyReplaceValue : string; 
    propertyReplaceValueDataType: number
}

export class PropertyDetails{
    propertyId : number;
    propertyName: string;
    propertyMessageId : number;
    messageName : string;
    messsageSourceId : number;
    sourceName : string;
}