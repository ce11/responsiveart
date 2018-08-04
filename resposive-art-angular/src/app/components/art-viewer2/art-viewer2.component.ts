import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {AnimatorService} from '../../services/animator.service'
@Component({
  selector: 'app-art-viewer2',
  templateUrl: './art-viewer2.component.html',
  styleUrls: ['./art-viewer2.component.css']
})
export class ArtViewer2Component implements AfterViewInit {
  @ViewChild('paintcanvas') canvas: ElementRef;
  colors = ["#ff7b00", "#02dd05", "#0090ea"];
  constructor(private animator : AnimatorService) { }

  ngAfterViewInit() {
    let anim :any = this.animator.createAnim("bricks", this.canvas, this.colors[0], 20);
    anim.start(anim, ()=>{
      console.log('------------done')
    })
  }

}
