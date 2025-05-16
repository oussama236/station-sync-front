import { TestBed } from '@angular/core/testing';

import { ShellApiService } from './shell-api.service';

describe('ShellApiService', () => {
  let service: ShellApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShellApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
