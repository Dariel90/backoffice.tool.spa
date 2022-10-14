export interface SourceRelationshipDetails {
    relationshipId: number;
    relationshipName: string;
    creationDate: Date;
    dataRelationship: DataSource;
}

export interface DataSource {
    sourceXId: number;
    sourceXName: string;
    sourceYId: number;
    sourceYName: string;
    propertyRelationship: PropertyRelationshptDto;
}

export interface PropertyRelationshptDto {
    propertySourceX: PropertyDto;
    propertySourceY: PropertyDto;
    systemProperty: PropertyDto;
    sourceStrongestProp: SourceStrongestProp | null;
}

export interface PropertyDto {
    propertyId: number;
    propertyName: string;
    propertyDataType: string;
    isAForeinProp: boolean;
}

export interface SourceStrongestProp {
    sourceId: number;
    dataSourceName: string;
    propertyId: number;
    propertyName: string;
}