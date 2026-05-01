import { inject, effect, WritableSignal } from '@angular/core';
import { signalStore, withState, withMethods } from '@ngrx/signals';
import { withEntities, removeEntity, updateEntity, setEntity, removeEntities, setEntities } from '@ngrx/signals/entities';
import { EntityLoadQuery, EntityStreamQuery, selectEntities, processLoadQueries, withEntitiesAndDBMethods } from 'src/app/core/store/app.store';
import { QueryParams, QueryOptions, AnyEntity } from 'src/app/core/store/app.model';
import { WeeklyGoalReflections } from './weekly-goal-reflections.model';

export class LoadWeeklyGoalReflections extends EntityLoadQuery<WeeklyGoalReflections> {
  constructor(
    store,
    queryParams: QueryParams,
    queryOptions: QueryOptions,
    loadQueries?: (entity: WeeklyGoalReflections) => EntityLoadQuery<AnyEntity>[],
  ) {
    super('weeklyGoalReflectionss', store, queryParams, queryOptions, loadQueries);
  }

  static create(store, queryParams: QueryParams, queryOptions: QueryOptions, loadQueries?: (entity: WeeklyGoalReflections) => EntityLoadQuery<AnyEntity>[]): LoadWeeklyGoalReflections {
    return new LoadWeeklyGoalReflections(store, queryParams, queryOptions, loadQueries);
  }
}

export class StreamWeeklyGoalReflections extends EntityStreamQuery<WeeklyGoalReflections> {
  constructor(
    store,
    queryParams: QueryParams,
    queryOptions: QueryOptions,
    streamQueries?: (entity: WeeklyGoalReflections) => EntityStreamQuery<AnyEntity>[],
  ) {
    super('weeklyGoalReflectionss', store, queryParams, queryOptions, streamQueries);
  }

  static create(store, queryParams: QueryParams, queryOptions: QueryOptions, streamQueries?: (entity: WeeklyGoalReflections) => EntityStreamQuery<AnyEntity>[]): StreamWeeklyGoalReflections {
    return new StreamWeeklyGoalReflections(store, queryParams, queryOptions, streamQueries);
  }
}

export const WeeklyGoalReflectionsStore = signalStore(
  { providedIn: 'root' },
  withEntitiesAndDBMethods<WeeklyGoalReflections>('weeklyGoalReflectionss'),
);
