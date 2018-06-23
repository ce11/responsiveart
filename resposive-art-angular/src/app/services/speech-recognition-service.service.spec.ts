import { TestBed, inject } from '@angular/core/testing';

import { SpeechRecognitionServiceService } from './speech-recognition-service.service';

describe('SpeechRecognitionServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpeechRecognitionServiceService]
    });
  });

  it('should be created', inject([SpeechRecognitionServiceService], (service: SpeechRecognitionServiceService) => {
    expect(service).toBeTruthy();
  }));
});
