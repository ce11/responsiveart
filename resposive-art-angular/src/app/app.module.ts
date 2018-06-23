import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {SpeechRecognitionService} from './services/speech-recognition-service.service'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ArtViewerComponent } from './components/art-viewer/art-viewer.component';


@NgModule({
  declarations: [
    AppComponent,
    ArtViewerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [SpeechRecognitionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
