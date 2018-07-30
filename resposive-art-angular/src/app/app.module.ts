import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {SpeechRecognitionService} from './services/speech-recognition-service.service'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ArtViewerComponent } from './components/art-viewer/art-viewer.component';
import { ArtViewer2Component } from './components/art-viewer2/art-viewer2.component';
import {AnimatorService} from './services/animator.service'

@NgModule({
  declarations: [
    AppComponent,
    ArtViewerComponent,
    ArtViewer2Component
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [SpeechRecognitionService, AnimatorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
