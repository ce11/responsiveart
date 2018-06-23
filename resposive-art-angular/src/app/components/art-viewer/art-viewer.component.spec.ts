import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtViewerComponent } from './art-viewer.component';

describe('ArtViewerComponent', () => {
  let component: ArtViewerComponent;
  let fixture: ComponentFixture<ArtViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
