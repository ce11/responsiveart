import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { SpeechRecognitionService } from '../../services/speech-recognition-service.service';
import { ViewChild, ElementRef } from '@angular/core';
import{cues} from '../../data/cues'
@Component({
  selector: 'app-art-viewer',
  templateUrl: './art-viewer.component.html',
  styleUrls: ['./art-viewer.component.css']
})

export class ArtViewerComponent implements OnInit, OnDestroy, AfterViewInit {
  audioBaseUrl= "https://s3.us-east-2.amazonaws.com/audio-art/"

  speechData: string;
  @ViewChild('paintcanvas') myCanvas: ElementRef;
  @ViewChild('audio') audioPlayer: ElementRef;
  public context: CanvasRenderingContext2D;
  width = window.innerWidth;
  height = window.innerHeight;
  paint:any[] = [];
  intervaler:any;
  totalPaints :any;
  size = 20;
  playInterval: 60
  constructor(private speechRecognitionService: SpeechRecognitionService) {
    this.speechData = "";
  }
  ngAfterViewInit() {
    this.context = (<HTMLCanvasElement>this.myCanvas.nativeElement).getContext('2d');
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    console.log(this.height)
    this.totalPaints = this.width / 45;
    this.paint = []
    this.activateSpeechSearchMovie();
  }
  ngOnInit() {
  }

  ngOnDestroy() {
    this.speechRecognitionService.DestroySpeechObject();
  }

  activateSpeechSearchMovie(): void {
    console.log('start record1')
    this.speechRecognitionService.record()
      .subscribe(
      //listener
      (value) => {
        var parts = value.split(" ");
        console.log(parts)
        for (let part of parts){
          if(cues.hasOwnProperty(part.toLowerCase())){
            let cue = cues[part.toLowerCase()]
            this.initPaint(cue.interval, cue.color)
            this.initAudio(part)
            this.speechRecognitionService.DestroySpeechObject();
            break;
            // setTimeout(()=>{
            //   console.log('back on line!')
            //   this.audioPlayer.nativeElement.pause()
            //   // this.stopPaint();
            // }, 10000);
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
  initAudio(cue){
    this.audioPlayer.nativeElement.src = this.audioBaseUrl + cue + '.mp3';
    this.audioPlayer.nativeElement.load();
    this.audioPlayer.nativeElement.play();

  }
  stopPaint(): void{
    clearInterval(this.intervaler);
    this.context.fillStyle = "clear";
    this.context.fillRect(0, 0, this.myCanvas.nativeElement.width, this.myCanvas.nativeElement.height);
  }
  initPaint(interval, colorString) {
    // this.context.clearRect(0, 0, this.myCanvas.nativeElement.width, this.myCanvas.nativeElement.height);
    for (var i = 0; i < this.totalPaints; i++) {
      this.addPaint(interval, colorString);
    }
    clearInterval(this.intervaler);

    this.intervaler = setInterval(()=> {
       this.updatePaint(interval, colorString); },40);
     }

  addPaint(interval, colorString): void {
    //Try 50 times
    var i = 50;
    while (i > 0) {
      this.size = Math.random() * this.size + 5;
      var x = Math.random() * this.width;
      var found = false;
      //Dont Allow drips ontop of each other (Overtaking drops destroy the prettyness)
      for (var j = 0; j < this.paint.length; j++) {
        if ((x + this.size > this.paint[j].x) && (x - this.size < this.paint[j].x + this.paint[j].s)) {
          var found = true;
          break;
        }
        if ((x - this.size < this.paint[j].x) && (x + this.size > this.paint[j].x - this.paint[j].s)) {
          found = true;
          break;
        }
      }

      if (found === false) {
        this.paint.push({
          s: this.size,
          x: x,
          y: -60,
          v: (Math.random() * 2) + interval,
          c: colorString
        });
        i--;
        return;
      }
    }
  }

  drawPaint(x, y, size, colour) :void{
    this.context.beginPath();
    this.context.arc(x, y, size, 0, Math.PI * 2, true);
    this.context.closePath();
    this.context.fillStyle = colour;
    this.context.fill();
  }

  updatePaint(interval, colorString) {
    for (var i = 0; i < this.paint.length; i++) {
      this.paint[i].y = this.paint[i].y + this.paint[i].v;
      if (this.paint[i].y > this.height + 60) {
        this.paint.splice(i, 1);
        this.addPaint(interval, colorString);
      }
      this.drawPaint(this.paint[i].x, this.paint[i].y, this.paint[i].s, this.paint[i].c);
    }
  }
}
