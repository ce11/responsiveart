import { Injectable } from '@angular/core';
import { ElementRef } from '@angular/core';

@Injectable()
export class AnimatorService {

  constructor() { }
  public createAnim(style: string, canvas: ElementRef, color: string, delay: number = 20): Object {
    if (style == "drip") {
      return this.createDripAnim(canvas, color, delay);
    } else if (style == "circle") {
      return this.createGrowingCirleAnim(canvas, color, delay)
    } else if (style == "swish") {
      return this.createSwishAnim(canvas, color, delay);
    } else if (style == "bricks") {
      return this.createBricksAnim(canvas, color, delay);
    }
  }

  private getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private createAnimTemplate(canvas: ElementRef, color: string, delay: number) {
    let anim: any = new Object();
    anim.width = canvas.nativeElement.width;
    anim.height = canvas.nativeElement.height;
    anim.ctx = (<HTMLCanvasElement>canvas.nativeElement).getContext('2d');
    anim.delay = delay;
    anim.ctx.fillStyle = color;
    return anim;
  }

  private createBricksAnim(canvas: ElementRef, color: string, delay: number) {
    console.log('creating bricks animation')
    let anim = this.createAnimTemplate(canvas, color, delay);
    anim.rows = [];
    anim.nRows = 20;
    anim.dy = 10;
    for (let i = 0; i < anim.nRows; i++) {
      anim.rows.push({
        currHeight: 0,
        cooldown: 0
      })
    }
    anim.brickHeight = 10;
    anim.start = this.startBricksAnim;
    anim.bricks = [];
    return anim;
  }
  private startBricksAnim(anim: any, cb: any) {
    // distribute n new bricks over remaining cells
    for (let j = 0; j < 2; j++) {
      let done = 100;
      while (done > 0) {
        let i = Math.floor(Math.random() * Math.floor(anim.nRows));
        if (anim.rows[i].currHeight < anim.height && anim.rows[i].cooldown == 0) {
          done = 0;
          anim.bricks.push({
            x: anim.width * i / anim.nRows,
            y: 0,
            width: anim.width / anim.nRows,
            height: anim.brickHeight,
            row: i
          })
          anim.rows[i].cooldown += 3
        }
        done--;
      }
    }
    for (let i = 0; i < anim.nRows; i++) {
      if (anim.rows[i].cooldown > 0)
        anim.rows[i].cooldown--;
    }
    /*
    for (let i = 0; i < anim.nRows; i++) {
      // if a row is full continue
      if (anim.rows[i].currHeight > anim.height) {
        continue;
      }
      // cooldown if brick was just launched
      if (anim.rows[i].cooldown > 0) {
        anim.rows[i].cooldown--;
      } else {  // randomly add brick if last brick is below dropping height
        if (Math.random() > 0.95) {
          anim.bricks.push({
            x: anim.width * i / anim.nRows,
            y: 0,
            width: anim.width / anim.nRows,
            height: anim.brickHeight,
            row: i
          })
          anim.rows[i].cooldown += 3
        }
      }
    }*/
    // redraw bricks
    for (let i = 0; i < anim.bricks.length; i++) {
      let currBrick = anim.bricks[i];
      if (anim.height - currBrick.y - anim.brickHeight - anim.dy < anim.rows[currBrick.row].currHeight) {
        // remove brick;
        currBrick.inactive = true;
        anim.rows[currBrick.row].currHeight += anim.brickHeight;
        continue;
      }
      anim.ctx.clearRect(currBrick.x, currBrick.y, currBrick.width, currBrick.height);
      currBrick.y += anim.dy;
      anim.ctx.fillRect(currBrick.x, currBrick.y, currBrick.width, currBrick.height);
    }
    anim.bricks = anim.bricks.filter(x => !x.inactive)
    let notFinishedRows = anim.rows.filter(x => x.currHeight < anim.height);
    if (anim.bricks.length == 0 && notFinishedRows == 0) {
      console.log('done!')
      cb();
    } else {
      setTimeout(() => anim.start(anim, cb), anim.delay);
    }
  }

  private createRippleUpAnim(canvas: ElementRef, color: string, delay: number) {
    let anim = this.createAnimTemplate(canvas, color, delay)
  }

  private startRippleUp(anim: any, cb: any) {

  }


  private createSwishAnim(canvas: ElementRef, color: string, delay: number) {
    let anim = this.createAnimTemplate(canvas, color, delay)
    anim.ctx.shadowColor = "black";
    anim.ctx.shadowBlur = 5;
    anim.ctx.shadowOffsetX = 3;
    anim.ctx.shadowOffsetY = 0;

    anim.pts = [
      {
        x: this.getRandomInt(-100, -100), y: 0, dx: 5
      },
      {
        x: this.getRandomInt(-30, -10), y: anim.height, dx: 5
      }
    ];
    anim.start = this.drawSwish;
    return anim;
  }

  private drawSwish(anim: any, cb: any) {
    let alldone = false;

    anim.ctx.beginPath();
    anim.ctx.moveTo(anim.pts[0].x, anim.pts[0].y) // top left
    anim.ctx.lineTo(anim.pts[0].x + anim.pts[0].dx, anim.pts[0].y) // top right
    anim.ctx.lineTo(anim.pts[1].x + anim.pts[1].dx, anim.pts[1].y); //bttom right
    anim.ctx.lineTo(anim.pts[1].x, anim.pts[1].y); // botto pt

    anim.ctx.fill();
    anim.ctx.closePath();
    anim.pts[0].x += anim.pts[0].dx - 1;
    anim.pts[1].x += anim.pts[1].dx - 1;

    if (anim.pts[0].x > anim.width && anim.pts[1].x > anim.width) {
      console.log('done!')
      cb();
    } else {
      setTimeout(() => anim.start(anim, cb), anim.delay);
    }
  }

  private createGrowingCirleAnim(canvas: ElementRef, color: string, delay: number) {
    let anim = this.createAnimTemplate(canvas, color, delay)
    anim.pts = [];
    let npts = 20
    // x: this.getRandomInt(anim.width * i / this.segs, anim.width * (i + 1) / this.segs),

    for (let i = 0; i < npts; i++) {
      let pt = {
        x: this.getRandomInt(10, anim.width - 10),
        y: this.getRandomInt(10, anim.height - 10),
        dr: this.getRandomInt(1, 3),
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
      if (anim.pts[i].r > anim.width * 1.3 || anim.pts[i].r > anim.height * 1.3) {
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
    let anim = this.createAnimTemplate(canvas, color, delay)
    anim.ctx.shadowColor = "black";
    anim.ctx.shadowBlur = 5;
    anim.ctx.shadowOffsetX = 2;
    anim.ctx.shadowOffsetY = 2;
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
