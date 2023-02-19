import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutSeqMineComponent } from './about-seq-mine.component';

describe('AboutSeqMineComponent', () => {
  let component: AboutSeqMineComponent;
  let fixture: ComponentFixture<AboutSeqMineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AboutSeqMineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutSeqMineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
