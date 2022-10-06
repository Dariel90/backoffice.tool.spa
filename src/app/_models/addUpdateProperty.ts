export interface AddUpdateProperty {
  propertyId: number;
  name: string;
  type: number;
  messageId: number;
  isYours: boolean;
  myPropertyId: number | null;
}
