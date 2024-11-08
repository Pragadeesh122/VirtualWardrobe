export type ClothItem = {
  id?: string;
  imageUrl: string;
  clothName: string;
  clothType: string;
  createdAt: string;
  updatedAt: string;
  userID: string;
};

export type Wardrobe = {
  [clothType: string]: ClothItem[];
};
