import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';

import {
  OnboardQuarterlyGoalsComponent,
  DEFAULT_HASHTAG_COLORS,
} from './onboard-quarterly-goals.component';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { User, OnboardingState } from 'src/app/core/store/user/user.model';

describe('OnboardQuarterlyGoalsComponent', () => {
  let component: OnboardQuarterlyGoalsComponent;
  let fixture: ComponentFixture<OnboardQuarterlyGoalsComponent>;

  const mockUser: User = {
    __id: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
    onboardingState: OnboardingState.STEP_3,
  };

  const mockAuthStore = {
    user: signal(mockUser),
  };

  const mockBatchService = {
    batchWrite: jasmine.createSpy('batchWrite').and.returnValue(Promise.resolve()),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnboardQuarterlyGoalsComponent],
      providers: [
        provideNoopAnimations(),
        { provide: AuthStore, useValue: mockAuthStore },
        { provide: BATCH_WRITE_SERVICE, useValue: mockBatchService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OnboardQuarterlyGoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize 3 default goal rows with distinct hashtag colors', () => {
    expect(component.goalsArray.length).toBe(3);
    expect(component.goalsArray.at(0).get('hashtagColor')?.value).toBe(DEFAULT_HASHTAG_COLORS[0]);
    expect(component.goalsArray.at(1).get('hashtagColor')?.value).toBe(DEFAULT_HASHTAG_COLORS[1]);
    expect(component.goalsArray.at(2).get('hashtagColor')?.value).toBe(DEFAULT_HASHTAG_COLORS[2]);
  });

  it('should have invalid form initially when fields are empty', () => {
    expect(component.goalsForm.invalid).toBeTrue();
  });

  it('should format hashtag by removing leading hash symbols', () => {
    component.goalsArray.at(0).get('hashtagName')?.setValue('##interview-prep');
    component.formatHashtag(0);
    expect(component.goalsArray.at(0).get('hashtagName')?.value).toBe('interview-prep');
  });

  it('should emit back event when onBack is called', () => {
    let backEmitted = false;
    component.back.subscribe(() => {
      backEmitted = true;
    });

    component.onBack();
    expect(backEmitted).toBeTrue();
  });

  it('should emit next event with goals data when form is valid', () => {
    let emittedData: any = null;
    component.next.subscribe((data) => {
      emittedData = data;
    });

    component.goalsArray.at(0).patchValue({ text: 'Goal 1', hashtagName: 'tag1' });
    component.goalsArray.at(1).patchValue({ text: 'Goal 2', hashtagName: 'tag2' });
    component.goalsArray.at(2).patchValue({ text: 'Goal 3', hashtagName: 'tag3' });

    expect(component.goalsForm.valid).toBeTrue();

    component.onNext();
    expect(emittedData).toBeTruthy();
    expect(emittedData.length).toBe(3);
    expect(emittedData[0].text).toBe('Goal 1');
    expect(emittedData[0].hashtagName).toBe('tag1');
  });
});
