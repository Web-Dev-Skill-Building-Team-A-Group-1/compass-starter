import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyGoalsHeaderComponent } from './weekly-goals-header.component';
import { DATABASE_SERVICE } from 'src/app/core/firebase/database.service';
import { FirebaseMockService } from 'src/app/core/firebase/firebase.mock.service';
import { BatchWriteMockService } from 'src/app/core/store/batch-write.mock.service';
import { BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';


describe('WeeklyGoalsHeaderComponent', () => {
  let component: WeeklyGoalsHeaderComponent;
  let fixture: ComponentFixture<WeeklyGoalsHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [WeeklyGoalsHeaderComponent],
      providers: [
        { provide: DATABASE_SERVICE, useClass: FirebaseMockService },
        { provide: BATCH_WRITE_SERVICE, useClass: BatchWriteMockService },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyGoalsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
