import { Timestamp } from '@angular/fire/firestore';

export interface Hashtag {
  __id: string;
  __userId: string;
  name: string;
  color: string;
  _createdAt?: Timestamp;
  _updatedAt?: Timestamp;
  _deleted?: boolean;
}
