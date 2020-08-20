import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TagDatabase, Video } from '../models';
import { Observable, BehaviorSubject } from 'rxjs';

import { pluck, share, mergeMap, map } from 'rxjs/operators';
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

  public videos$!: Observable<Video[]>;

  public filteredVideos$ = new BehaviorSubject<Video[]>([]);

  public tags$!: Observable<string[]>;

  public selectedTags$ = new BehaviorSubject<number[]>([]);

  constructor(http: HttpClient) {
    const db$ = http.get<TagDatabase>('assets/db.json').pipe(share());

    this.videos$ = db$.pipe(pluck<TagDatabase, Video[]>('videos'));

    this.tags$ = db$.pipe(pluck<TagDatabase, string[]>('tags'));
  }

  public ngOnInit(): void {
    this.selectedTags$
      .pipe(
        map((selectedTags: number[]) => new Set(selectedTags)),
        mergeMap((selectedTagSet: Set<number>) =>
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
    const tagIdx = Number(event.value);
    this._add(tagIdx);
  }

  public remove(tagIdx: number): void {
    const actualTags = this.selectedTags$.value;
    const remainingTags = actualTags.filter((t: number) => t !== tagIdx);
    this.selectedTags$.next(remainingTags);
  }

  public selected(event: MatAutocompleteSelectedEvent): void {
    console.log(event);
    const selectedIndex = Number(event.option.value);
    this._add(selectedIndex);
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

  private _add(tagIdx: number): void {
    const actualTags = this.selectedTags$.value;
    this.selectedTags$.next(Array.from(new Set([...actualTags, tagIdx])));
  }
}
