import { TestBed } from '@angular/core/testing';

import { GoogleTranslateService } from './translate.service';

describe('TranslateService', () => {
  let service: GoogleTranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranslateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
