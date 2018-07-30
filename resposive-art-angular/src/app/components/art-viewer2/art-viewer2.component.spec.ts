import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtViewer2Component } from './art-viewer2.component';

describe('ArtViewer2Component', () => {
  let component: ArtViewer2Component;
  let fixture: ComponentFixture<ArtViewer2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtViewer2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtViewer2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
