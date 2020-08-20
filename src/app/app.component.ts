import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Video } from '../models';
import { Observable, BehaviorSubject } from 'rxjs';

import { mergeMap, map, tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';

import * as shuffle from 'shuffle-array';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public tagCtrl = new FormControl();

  private videos$!: Observable<Video[]>;

  public tags: string[] = [];

  public filteredVideos$ = new BehaviorSubject<Video[]>([]);

  public selectedTags$ = new BehaviorSubject<string[]>([]);

  constructor(http: HttpClient) {
    this.videos$ = http.get<Video[]>('assets/db.json').pipe(
      tap((videos: Video[]) => {
        const tags = videos.reduce(
          (tags: string[], video: Video) => [...tags, ...video.tags],
          []
        );
        this.tags = Array.from(new Set(tags));
      })
    );
  }

  public ngOnInit(): void {
    this.selectedTags$
      .pipe(
        map((selectedTags: string[]) => new Set(selectedTags)),
        mergeMap((selectedTagSet: Set<string>) =>
          this.videos$.pipe(
            map((videos: Video[]) => {
              return videos.filter((video: Video) => {
                let videoTags = new Set(video.tags);
                let intersection = new Set(
                  [...videoTags].filter((x) => selectedTagSet.has(x))
                );
                return intersection.size === selectedTagSet.size;
              });
            })
          )
        )
      )
      .subscribe((filteredVideos: Video[]) =>
        this.filteredVideos$.next(filteredVideos)
      );
  }

  public addHandler(event: MatChipInputEvent): void {
    const tag = event.value;
    this._add(tag);
  }

  public remove(tag: string): void {
    const actualTags = this.selectedTags$.value;
    const remainingTags = actualTags.filter((t: string) => t !== tag);
    this.selectedTags$.next(remainingTags);
  }

  public selected(event: MatAutocompleteSelectedEvent): void {
    const selectedTag = event.option.value;
    this._add(selectedTag);
  }

  public navigateToPlaylist(): void {
    const videoIds = this.filteredVideos$.value.reduce(
      (ids: string[], video: Video) => [...ids, video.videoId],
      []
    );

    const shuffled = shuffle(videoIds);
    const url = `https://www.youtube.com/watch_videos?video_ids=${shuffled.join(
      ','
    )}`;
    window.open(url);
  }

  private _add(tag: string): void {
    const actualTags = this.selectedTags$.value;
    this.selectedTags$.next(Array.from(new Set([...actualTags, tag])));
  }
}
