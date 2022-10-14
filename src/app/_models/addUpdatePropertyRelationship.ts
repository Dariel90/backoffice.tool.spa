export interface AddUpdatePropertyRelationship {
    sourceRelationId: number;
    sourceXPropId: number;
    sourceYPropId: number;
    myPropertyId: number;
    relationshipName: string;
    strongestPropId: number | null;
}