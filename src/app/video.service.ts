import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Video } from 'src/models';
import { Observable, forkJoin } from 'rxjs';
import { map, share } from 'rxjs/operators';

export interface VideoDetails {
  videos: Video[];
  tags: string[];
}

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  constructor(private http: HttpClient) {}

  public getVideoDetails$(): Observable<VideoDetails> {
    const video$ = this.http
      .get<Video[]>(
        'https://gist.githubusercontent.com/abrhm/ccc924b31201c74037c8033852bfd3be/raw/'
      )
      .pipe(share());
    const tags$ = video$.pipe(
      map((videos: Video[]) => {
        const tags = videos.reduce(
          (tags: string[], video: Video) => [...tags, ...video.tags],
          []
        );

        return Array.from(new Set(tags));
      })
    );

    return forkJoin({
      videos: video$,
      tags: tags$,
    });
  }
}
