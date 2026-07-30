import { Component, OnInit, ChangeDetectionStrategy, input, output, inject, WritableSignal, Signal, signal, computed, Inject, Injector } from '@angular/core';
import { WeeklyGoalsAnimations } from './weekly-goals.animations';
import { User } from 'src/app/core/store/user/user.model';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { BatchWriteService, BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { WeeklyGoalsItemComponent } from './weekly-goals-item/weekly-goals-item.component';
import { Timestamp } from '@angular/fire/firestore';
import { WeeklyGoalData } from '../home.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-weekly-goals',
  templateUrl: './weekly-goals.component.html',
  styleUrls: ['./weekly-goals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: WeeklyGoalsAnimations,
  standalone: true,
  imports: [WeeklyGoalsItemComponent],
})
export class WeeklyGoalsComponent implements OnInit {  
  // --------------- INPUTS AND OUTPUTS ------------------

  // --------------- LOCAL UI STATE ----------------------

  sampleData: WeeklyGoalData = {
    __id: 'wg1',
    __userId: 'test-user',
    __quarterlyGoalId: 'qg1',
    __hashtagId: 'ht1',
    text: 'Apply to Microsoft',
    completed: false,
    order: 1,
    _createdAt: Timestamp.now(),
    _updatedAt: Timestamp.now(),
    _deleted: false,
    hashtag: {
      __id: 'ht1',
      __userId: 'test-user',
      name: 'apply-internships',
      color: '#2DBDB1',
      _createdAt: Timestamp.now(),
      _updatedAt: Timestamp.now(),
      _deleted: false,
    },
  };

  
  // --------------- COMPUTED DATA -----------------------


  // --------------- EVENT HANDLING ----------------------
  completion = "incomplete";
  checkGoal(newCheckState: boolean) {
    if( newCheckState === true){
        this.completion = "incomplete"
    } else {
        this.completion = "complete"
    }
    this.snackBar.open(
      'Clicked on checkbox to change state to: ' + this.completion,
      '',
      {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
      },
    );
  }


  // --------------- OTHER -------------------------------

  constructor(private snackBar: MatSnackBar) {}

  // --------------- LOAD AND CLEANUP --------------------
  
  ngOnInit() {}
}