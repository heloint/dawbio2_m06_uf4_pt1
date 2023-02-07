import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileStorageManageComponent } from './file-storage-manage.component';

describe('FileStorageManageComponent', () => {
  let component: FileStorageManageComponent;
  let fixture: ComponentFixture<FileStorageManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileStorageManageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileStorageManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
