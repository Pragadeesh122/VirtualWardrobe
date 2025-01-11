export interface ClothItem {
  id?: string;
  clothType: string;
  clothName: string;
  imageUrl: string;
  userID?: string;
  createdAt: string;
  updatedAt: string;
  // Additional attributes for suggestion system
  color?: string;
  pattern?: string;
  material?: string;
  category?: string;
  attributes?: {
    season?: string[];
    occasion?: string[];
    style?: string[];
  };
}

export interface UploadClothItemRequest {
  clothName: string;
  clothType: string;
  uid?: string;
  email?: string;
  image: {
    buffer: Buffer;
    mimetype: string;
    originalname: string;
    size: number;
  };
}

export interface UploadClothItemResponse {
  success: boolean;
}

export interface GetItemRequest {
  userId: string;
}
