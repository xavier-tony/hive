import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap, exhaustMap, takeWhile } from 'rxjs/operators';

interface ScriptOptions {
  url: string;
  onLoadAction?: any; // Type based on your specific NgRx action type
  onErrorAction?: any; // Type based on your specific NgRx action type
  retries?: number;
  retryDelay?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ScriptLoaderService {
  constructor(private store: Store) {}

  loadScript(options: ScriptOptions): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = options.url;

      const load$ = Observable.create((innerObserver) => {
        script.onload = () => {
          innerObserver.next(true);
          innerObserver.complete();
          if (options.onLoadAction) {
            // Dispatch the NgRx action for successful loading
            this.store.dispatch(options.onLoadAction);
          }
        };

        script.onerror = () => {
          if (options.retries > 0) {
            innerObserver.error({
              url: options.url,
              retries: options.retries - 1,
            });
          } else {
            innerObserver.error({ url: options.url, retries: 0 });
            if (options.onErrorAction) {
              // Dispatch the NgRx action for error handling
              this.store.dispatch(options.onErrorAction);
            }
          }
        };

        document.head.appendChild(script);
      });

      return load$.pipe(
        exhaustMap((success) => {
          if (success) {
            // Script loaded successfully, prevent retries
            return throwError(new Error('Script already loaded'));
          } else {
            // Continue with retries
            return of(success);
          }
        }),
        tap(() => {
          // Retry logic (without retryWhen)
          if (options.retries > 0) {
            observer.error({ url: options.url, retries: options.retries - 1 });
          }
        }),
        delay(options.retryDelay || 1000), // Default delay of 1 second
        takeWhile((error) => error.retries > 0) // Allow retries based on configured count
      );
    });
  }
}

// This is how you use it

// this.scriptLoaderService
//   .loadScript({
//     url: 'https://example.com/script.js',
//     onLoadAction: createScriptLoadedAction(),
//     onErrorAction: createScriptLoadFailedAction(),
//     retries: 3, // Enable retries
//     retryDelay: 2000, // Retry after 2 seconds
//   })
//   .subscribe(
//     () => console.log('Script loaded successfully'),
//     (error) => console.error('Script loading failed:', error)
//   );
