import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { LongTermGoalsModalComponent } from './long-term-goals-modal.component';
import { DATABASE_SERVICE } from 'src/app/core/firebase/database.service';
import { FirebaseMockService } from 'src/app/core/firebase/firebase.mock.service';
import { BatchWriteMockService } from 'src/app/core/store/batch-write.mock.service';
import { BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';


describe('LongTermGoalsModalComponent', () => {
  let component: LongTermGoalsModalComponent;
  let fixture: ComponentFixture<LongTermGoalsModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [LongTermGoalsModalComponent],
      providers: [
        { provide: DATABASE_SERVICE, useClass: FirebaseMockService },
        { provide: BATCH_WRITE_SERVICE, useClass: BatchWriteMockService },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LongTermGoalsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
