import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileStorageTableComponent } from './file-storage-table.component';

describe('FileStorageTableComponent', () => {
  let component: FileStorageTableComponent;
  let fixture: ComponentFixture<FileStorageTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileStorageTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileStorageTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
