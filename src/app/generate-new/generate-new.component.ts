import { Component, OnInit } from '@angular/core';
import { VideoDetails } from '../video.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
} from '@angular/forms';
import { Video } from 'src/models';

@Component({
  selector: 'app-generate-new',
  templateUrl: './generate-new.component.html',
  styleUrls: ['./generate-new.component.scss'],
})
export class GenerateNewComponent implements OnInit {
  private readonly videoIdRegex = /(?:[?&])v=([^&]+)/;

  public tags: string[] = [];

  public addNewForm!: FormGroup;

  public filterForm!: FormControl;

  public addTagForm!: FormControl;

  public newSongs: Video[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.filterForm = fb.control(['']);
    this.addTagForm = fb.control(['']);
  }

  public ngOnInit(): void {
    const videoDetails = this.route.snapshot.data.details as VideoDetails;
    this.tags = videoDetails.tags;

    this.addNewForm = this.fb.group({
      link: ['', Validators.required],
      tags: this.fb.array(
        Array.from({ length: this.tags.length }, () => this.fb.control(false))
      ),
    });
  }

  public getTagsArray(): FormArray {
    return this.addNewForm.get('tags') as FormArray;
  }

  public addTag(): void {
    this.tags = [...this.tags, this.addTagForm.value];
    this.addTagForm.reset();
    (this.addNewForm.get('tags') as FormArray).push(this.fb.control(false));
  }

  public addSong(): void {
    const formResult = this.addNewForm.value;
    const link = formResult.link as string;
    const result = this.videoIdRegex.exec(link);
    if (!result) {
      return;
    }
    const videoId = result[1];

    const tagFlags = formResult.tags as boolean[];
    const tags: string[] = this.tags.filter((_, idx) => tagFlags[idx]);

    this.newSongs = [
      ...this.newSongs,
      {
        videoId,
        tags,
      },
    ];

    this.addNewForm.reset();
  }

  public checkHidden(tag: string): boolean {
    return !tag.includes(this.filterForm.value);
  }
}
