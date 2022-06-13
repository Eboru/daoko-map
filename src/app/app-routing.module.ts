import { ReviewComponent } from './Admin/review/review.component';
import { AboutComponent } from './About/about/about.component';
import { AdminComponent } from './Admin/admin/admin.component';
import { PostComponent } from './Post/post/post.component';
import { MapComponent } from './Map/map/map.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { ReviewGuard } from './Admin/review.guard';

const routes: Routes = [
  {
    path: 'map', component: MapComponent
  },
  {
    path: 'post', component: PostComponent
  },
  {
    path: 'admin', component: AdminComponent
  },
  {
    path: 'about', component: AboutComponent
  },
  {
    path: 'review', component: ReviewComponent,
    canActivate : [ReviewGuard]
  },
  {
    path: '**',
    redirectTo: 'map'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
