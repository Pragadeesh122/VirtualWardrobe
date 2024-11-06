export interface OutfitLog {
  id: string;
  date: string;
  collectionId: string;
  collectionName: string;
  thumbnailUrl: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOutfitLogRequest {
  date: string;
  collectionId: string;
}

export interface GetOutfitLogsRequest {
  userId: string;
}
