export interface Video {
  videoId: string;
  tags: number[];
}

export interface TagDatabase {
  videos: Video[];
  tags: string[];
}
