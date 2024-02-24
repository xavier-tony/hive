import { signalState, signalStore, withState } from '@ngrx/signals';

export const featureFlagStore = signalStore({ providedIn: 'root' }, withState({}));
