import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyGoalsComponent } from './weekly-goals.component';
import { DATABASE_SERVICE } from 'src/app/core/firebase/database.service';
import { FirebaseMockService } from 'src/app/core/firebase/firebase.mock.service';
import { BatchWriteMockService } from 'src/app/core/store/batch-write.mock.service';
import { BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';


describe('WeeklyGoalsComponent', () => {
  let component: WeeklyGoalsComponent;
  let fixture: ComponentFixture<WeeklyGoalsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [WeeklyGoalsComponent],
      providers: [
        { provide: DATABASE_SERVICE, useClass: FirebaseMockService },
        { provide: BATCH_WRITE_SERVICE, useClass: BatchWriteMockService },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyGoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
