import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VideoDetails } from '../video.service';
import { map } from 'rxjs/operators';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Video } from 'src/models';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import * as shuffle from 'shuffle-array';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewComponent implements OnInit {
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public tagCtrl = new FormControl();

  private videos: Video[] = [];

  public tags: string[] = [];

  public filteredVideos: Video[] = [];

  public selectedTags: string[] = [];

  public selectedTags$ = new BehaviorSubject<string[]>([]);

  constructor(private route: ActivatedRoute) {}

  public ngOnInit(): void {
    const videoDetails = this.route.snapshot.data.details as VideoDetails;
    this.videos = videoDetails.videos;
    this.tags = videoDetails.tags;

    this.filteredVideos = this.videos;

    this.selectedTags$
      .pipe(map((selectedTags: string[]) => new Set(selectedTags)))
      .subscribe((selectedTagSet: Set<string>) => {
        this.filteredVideos = this.videos.filter((video: Video) => {
          let videoTags = new Set(video.tags);
          let intersection = new Set(
            [...videoTags].filter((x) => selectedTagSet.has(x))
          );

          return intersection.size === selectedTagSet.size;
        });
      });
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
    const videoIds = this.filteredVideos.reduce(
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
