export interface CollectionItem {
  id: string;
  name: string;
  items: {
    clothId: string;
    imageUrl: string;
    clothName: string;
    clothType: string;
  }[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCollectionRequest {
  name: string;
  items: string[]; // Array of cloth IDs
}

export interface AddItemToCollectionRequest {
  collectionId: string;
  clothId: string;
}
