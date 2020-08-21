import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewComponent } from './view/view.component';

import { VideoDetailsResolver } from './video-details.resolver';
import { GenerateNewComponent } from './generate-new/generate-new.component';

const routes: Routes = [
  {
    path: 'view',
    component: ViewComponent,
    resolve: {
      details: VideoDetailsResolver,
    },
  },
  {
    path: 'generate',
    component: GenerateNewComponent,
    resolve: {
      details: VideoDetailsResolver,
    },
  },
  {
    path: '**',
    redirectTo: 'view',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
