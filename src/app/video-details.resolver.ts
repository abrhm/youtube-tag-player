import { Injectable } from '@angular/core';
import { VideoDetails, VideoService } from './video.service';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VideoDetailsResolver implements Resolve<VideoDetails> {
  constructor(private videoService: VideoService) {}

  public resolve(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<VideoDetails> {
    return this.videoService.getVideoDetails$();
  }
}
