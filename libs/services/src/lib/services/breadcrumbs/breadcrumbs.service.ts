// breadcrumb.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, switchMap } from 'rxjs/operators';
import { Breadcrumb } from './breadcrumbs.interface';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private breadcrumbs = new BehaviorSubject<Breadcrumb[]>([]);

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.listenToRouteEvents();
  }

  private listenToRouteEvents(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        switchMap(() => this.createBreadcrumbs(this.activatedRoute.root))
      )
      .subscribe((breadcrumbs) => {
        this.breadcrumbs.next(breadcrumbs);
      });
  }

  private createBreadcrumbs(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: Breadcrumb[] = []
  ): Observable<Breadcrumb[]> {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return of(
        breadcrumbs.map((breadcrumb) => ({
          ...breadcrumb,
          label:
            typeof breadcrumb.label === 'function'
              ? breadcrumb.label()
              : breadcrumb.label,
        }))
      );
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url
        .map((segment) => segment.path)
        .join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      let label = child.snapshot.data['breadcrumb'];
      if (typeof label === 'function') {
        // Pass both params and resolved data to the label function
        label = label(child.snapshot.params, child.snapshot.data);
      } else if (
        child.snapshot.data &&
        child.snapshot.data['resolvedBreadcrumb']
      ) {
        // Use resolved data directly if specified
        label = child.snapshot.data['resolvedBreadcrumb'];
      }

      if (label) {
        breadcrumbs.push({ label, url });
      }

      return this.createBreadcrumbs(child, url, breadcrumbs);
    }
  }

  getBreadcrumbs(): Observable<Breadcrumb[]> {
    return this.breadcrumbs.asObservable();
  }
}
