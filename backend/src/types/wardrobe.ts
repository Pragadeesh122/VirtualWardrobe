export interface ClothItem {
  clothType: string;
  clothName: string;
  imageUrl: string;
  userID?: string;
  createdAt: string;
  updatedAt: string;
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
