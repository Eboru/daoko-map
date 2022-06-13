import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ClarityModule } from '@clr/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './Map/map/map.component';
import { PostComponent } from './Post/post/post.component';
import { AdminComponent } from './Admin/admin/admin.component';
import { AboutComponent } from './About/about/about.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import '@clr/icons';
import '@clr/icons/shapes/all-shapes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReviewComponent } from './Admin/review/review.component';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    PostComponent,
    AdminComponent,
    AboutComponent,
    ReviewComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ClarityModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
