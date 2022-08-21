import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadBalanceComponent } from './upload-balance.component';

describe('UploadBalanceComponent', () => {
  let component: UploadBalanceComponent;
  let fixture: ComponentFixture<UploadBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadBalanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
