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

export interface CalendarMarking {
  selected?: boolean;
  marked?: boolean;
  selectedColor?: string;
  dotColor?: string;
  customStyles?: {
    container?: object;
    text?: object;
  };
}

export interface MarkedDates {
  [date: string]: CalendarMarking;
}
