import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {AnimatorService} from '../../services/animator.service'
import { SpeechRecognitionService } from '../../services/speech-recognition-service.service';

import {cues} from '../../data/cues'
@Component({
  selector: 'app-art-viewer2',
  templateUrl: './art-viewer2.component.html',
  styleUrls: ['./art-viewer2.component.css']
})
export class ArtViewer2Component implements AfterViewInit {
  @ViewChild('paintcanvas') canvas: ElementRef;
  @ViewChild('audio') audioPlayer: ElementRef;
  audioBaseUrl= "https://s3.us-east-2.amazonaws.com/audio-art/"

  constructor(private animator : AnimatorService, private speechRecognitionService: SpeechRecognitionService) { }

  ngAfterViewInit() {
    this.activateSpeechSearchMovie();
  }
  animate(cue:any){
    let anim :any = this.animator.createAnim(cue.anim, this.canvas, cue.color, 20);
    anim.start(anim, ()=>{
      setTimeout(()=>{window.location.reload();}, 20000)
      console.log('------------done')
    })
  }
  playMusic(cue:any){
    this.audioPlayer.nativeElement.src = this.audioBaseUrl + cue + '.mp3';
    this.audioPlayer.nativeElement.load();
    this.audioPlayer.nativeElement.play();

  }
  activateSpeechSearchMovie(): void {
    console.log('start record')
    this.speechRecognitionService.record()
      .subscribe(
      //listener
      (value) => {
        var parts = value.split(" ");
        console.log(parts)
        for (let part of parts){
          if(cues.hasOwnProperty(part.toLowerCase())){
            let cue = cues[part.toLowerCase()]
            this.animate(cue);
            this.playMusic(part)
            this.speechRecognitionService.DestroySpeechObject();
            break;
          }
        }
      },
      //error
      (err) => {
        console.log(err);
        if (err.error == "no-speech") {
          console.log("--restarting service--");
          this.activateSpeechSearchMovie();
        }
      },
      //completion
      () => {
        console.log("--complete--");
        // this.activateSpeechSearchMovie();
      });
  }

}
