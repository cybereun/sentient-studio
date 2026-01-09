
export enum AppView {
  HOME = 'HOME',
  COMPOSE = 'COMPOSE',
  RESTORE = 'RESTORE',
  ARCHIVE = 'ARCHIVE',
}

export enum OperationType {
  COMPOSE = '이미지 합성',
  RESTORE = '사진 복원',
}

export interface HistoryItem {
  id: string;
  imageUrl: string;
  prompt: string;
  type: OperationType;
  timestamp: string;
}

export interface ImageData {
    file: File;
    previewUrl: string;
}
