import { Injectable } from '@angular/core';
import { ElementRef } from '@angular/core';

@Injectable()
export class AnimatorService {

  constructor() { }
  public createAnim(style: string, canvas: ElementRef, color: string, delay: number = 20): Object {
    if (style == "drip") {
      return this.createDripAnim(canvas, color, delay);
    }else if (style == "circle"){
      return this.createGrowingCirleAnim(canvas, color, delay)
    }
  }
  private getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  private createGrowingCirleAnim(canvas: ElementRef, color: string, delay: number) {
    let anim: any = new Object();
    anim.width = canvas.nativeElement.width;
    anim.height = canvas.nativeElement.height;
    anim.ctx = (<HTMLCanvasElement>canvas.nativeElement).getContext('2d');

    // anim.ctx.shadowColor = "black";
    // anim.ctx.shadowBlur = 5;
    // anim.ctx.shadowOffsetX = 2;
    // anim.ctx.shadowOffsetY = 2;
    anim.delay = delay;
    anim.ctx.fillStyle = color;
    anim.pts = [];
    let npts = 20
    // x: this.getRandomInt(anim.width * i / this.segs, anim.width * (i + 1) / this.segs),

    for (let i = 0; i < npts; i++) {
      let pt = {
        x: this.getRandomInt(10, anim.width - 10),
        y: this.getRandomInt(10, anim.height - 10),
        dr: this.getRandomInt(1,3),
        r: 0
      };
      anim.pts.push(pt);
    }
    anim.start = this.startGrowingCircleAnim
    return anim;
  }

  private startGrowingCircleAnim(anim: any, cb: any) {
    let alldone = false;

    for (let i = 0; i < anim.pts.length; i++) {
      anim.pts[i].r = anim.pts[i].r + anim.pts[i].dr
      if (anim.pts[i].r > anim.width*1.3  || anim.pts[i].r > anim.height*1.3) {
        alldone = true;
        continue;
      }
      anim.ctx.beginPath();
      anim.ctx.arc(anim.pts[i].x, anim.pts[i].y, anim.pts[i].r, 0, 2 * Math.PI, true);
      anim.ctx.fill();
      anim.ctx.closePath()

    }
    if (alldone) {
      console.log('done!')
      cb();
    } else {
      setTimeout(() => anim.start(anim, cb), anim.delay);
    }
  }

  private createDripAnim(canvas: ElementRef, color: string, delay: number) {
    let anim: any = new Object();
    anim.width = canvas.nativeElement.width;
    anim.height = canvas.nativeElement.height;
    anim.ctx = (<HTMLCanvasElement>canvas.nativeElement).getContext('2d');
    anim.ctx.shadowColor = "black";
    anim.ctx.shadowBlur = 5;
    anim.ctx.shadowOffsetX = 2;
    anim.ctx.shadowOffsetY = 2;
    anim.delay = delay;
    // set goo color
    anim.ctx.fillStyle = color;
    // init goo control points
    anim.pts = [];
    for (let i = 0; i < 20; i++) {
      let pt = {};
      if (i == 0)
        pt = { x: 0, y: 0, c: 20, dy: Math.random() * 8 + 2 };
      else
        pt = { x: anim.width * (i + 1) / 20, y: 0, c: 20, dy: Math.random() * 8 + 2 };
      anim.pts.push(pt);
    }
    anim.start = this.dripStart;
    return anim;
  }

  private dripStart(anim: any, cb: any) {
    // draw current frame
    anim.ctx.beginPath();
    anim.ctx.moveTo(anim.width, 0); // start at top right corner
    anim.ctx.lineTo(0, 0); // draw to top left corner
    for (let i = 0; i < anim.pts.length; i++) {
      if (i == 0)
        anim.ctx.lineTo(anim.pts[i].x, anim.pts[i].y); // draw from top left corner down to start point
      else
        anim.ctx.bezierCurveTo(anim.pts[i - 1].x + anim.pts[i - 1].c,
          anim.pts[i - 1].y, anim.pts[i].x - anim.pts[i].c,
          anim.pts[i].y, anim.pts[i].x, anim.pts[i].y);  // draw from last paint drip to next
    }
    anim.ctx.closePath(); // draw from last point to top right corner to complete shape
    anim.ctx.fill();

    // move drips down
    for (let i = 0; i < anim.pts.length; i++) {
      anim.pts[i].y += anim.pts[i].dy;
      if (anim.pts[i].y > anim.height)
        anim.pts[i].y = anim.height;
    }

    // determine if all drips have reached the bottom of the canvas
    let all_finished = true;
    for (let i = 0; i < anim.pts.length; i++)
      all_finished = all_finished && anim.pts[i].y == anim.height;

    // if animation complete, pause and move to next image else draw next frame
    if (all_finished) {
      cb()
    }
    else {
      setTimeout(() => anim.start(anim, cb), anim.delay);
    }
  }
}
