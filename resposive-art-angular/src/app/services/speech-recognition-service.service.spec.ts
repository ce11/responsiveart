import { TestBed, inject } from '@angular/core/testing';

import { SpeechRecognitionService } from './speech-recognition-service.service';

describe('SpeechRecognitionServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpeechRecognitionService]
    });
  });

  it('should be created', inject([SpeechRecognitionService], (service: SpeechRecognitionService) => {
    expect(service).toBeTruthy();
  }));
});
