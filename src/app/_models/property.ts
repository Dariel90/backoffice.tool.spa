export interface Property{
    id: number;
    name: string;
    type: number;
    isYours: boolean;
    myPropertyId: number;
    myPropertyName: string;
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