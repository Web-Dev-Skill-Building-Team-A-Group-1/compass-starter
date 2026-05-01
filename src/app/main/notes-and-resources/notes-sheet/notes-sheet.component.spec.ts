import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesSheetComponent } from './notes-sheet.component';
import { DATABASE_SERVICE } from 'src/app/core/firebase/database.service';
import { FirebaseMockService } from 'src/app/core/firebase/firebase.mock.service';
import { BatchWriteMockService } from 'src/app/core/store/batch-write.mock.service';
import { BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';


describe('NotesSheetComponent', () => {
  let component: NotesSheetComponent;
  let fixture: ComponentFixture<NotesSheetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NotesSheetComponent],
      providers: [
        { provide: DATABASE_SERVICE, useClass: FirebaseMockService },
        { provide: BATCH_WRITE_SERVICE, useClass: BatchWriteMockService },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
