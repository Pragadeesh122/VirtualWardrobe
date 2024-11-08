export interface CollectionItem {
  clothId: string;
  imageUrl: string;
  clothName: string;
}

export interface Collection {
  id: string;
  name: string;
  items: CollectionItem[];
}
