import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesAndResourcesComponent } from './notes-and-resources.component';
import { DATABASE_SERVICE } from 'src/app/core/firebase/database.service';
import { FirebaseMockService } from 'src/app/core/firebase/firebase.mock.service';
import { BatchWriteMockService } from 'src/app/core/store/batch-write.mock.service';
import { BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';


describe('NotesAndResourcesComponent', () => {
  let component: NotesAndResourcesComponent;
  let fixture: ComponentFixture<NotesAndResourcesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NotesAndResourcesComponent],
      providers: [
        { provide: DATABASE_SERVICE, useClass: FirebaseMockService },
        { provide: BATCH_WRITE_SERVICE, useClass: BatchWriteMockService },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesAndResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
