import { TestBed } from '@angular/core/testing';
import {
  Router,
  NavigationEnd,
  ActivatedRoute,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { UrlSegment } from '@angular/router';
import { BreadcrumbService } from './breadcrumbs.service';
import { RouterTestingModule } from '@angular/router/testing';

function createMockUrlSegment(path: string): UrlSegment {
  return new UrlSegment(path, {});
}

// Mock ActivatedRoute with nested children
function createMockActivatedRoute(
  snapshot: Partial<ActivatedRouteSnapshot>,
  children: ActivatedRoute[] = []
): ActivatedRoute {
  const urlSegments =
    snapshot.url?.map((path) => createMockUrlSegment(path)) || [];

  return {
    snapshot: {
      ...snapshot,
      url: urlSegments,
      data: snapshot.data || {},
      params: snapshot.params || {},
    },
    url: of(urlSegments),
    params: of(snapshot.params || {}),
    data: of(snapshot.data || {}),
    queryParams: of({}),
    fragment: of(''),
    outlet: '',
    component: null,
    routeConfig: null,
    root: this as any, // this line may need adjustment based on context
    parent: null,
    firstChild: children[0] || null,
    children: children,
    pathFromRoot: [this as any], // this line may need adjustment based on context
    paramMap: of(new Map<string, string>()),
    queryParamMap: of(new Map<string, string>()),
  } as unknown as ActivatedRoute;
}

describe('BreadcrumbService', () => {
  let service: BreadcrumbService;
  let routerMock: { events: BehaviorSubject<any> };
  let activatedRouteMock: ActivatedRoute;

  beforeEach(() => {
    // Example of setting up a mock ActivatedRoute with nested children for a test
    activatedRouteMock = createMockActivatedRoute({}, [
      createMockActivatedRoute({
        url: [{ path: 'test' }],
        data: { breadcrumb: 'Test' },
      }),
    ]);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        BreadcrumbService,
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    });

    service = TestBed.inject(BreadcrumbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate breadcrumbs for static routes', (done) => {
    // Simulate a static route configuration
    activatedRouteMock.children = [
      createMockActivatedRoute({
        url: [{ path: 'test' }],
        data: { breadcrumb: 'Test' },
      }),
    ];

    service.getBreadcrumbs().subscribe((breadcrumbs) => {
      expect(breadcrumbs).toEqual([{ label: 'Test', url: '/test' }]);
      done();
    });

    routerMock.events.next(new NavigationEnd(1, '/test', '/test'));
  });

  it('should generate breadcrumbs for dynamic routes', (done) => {
    // Simulate a dynamic route with parameters
    activatedRouteMock.children = [
      createMockActivatedRoute({
        url: [{ path: 'user' }, { path: '123' }],
        data: { breadcrumb: (params) => `User ${params.id}` },
        params: { id: '123' },
      }),
    ];

    service.getBreadcrumbs().subscribe((breadcrumbs) => {
      expect(breadcrumbs).toEqual([{ label: 'User 123', url: '/user/123' }]);
      done();
    });

    routerMock.events.next(new NavigationEnd(1, '/user/123', '/user/123'));
  });

  it('should generate breadcrumbs for routes with resolved data', (done) => {
    // Simulate a route with resolved data
    activatedRouteMock.children = [
      createMockActivatedRoute({
        url: [{ path: 'profile' }],
        data: { breadcrumb: (params, data) => `Profile: ${data.user.name}` },
        // Mock the resolved data
        _resolvedData: { user: { name: 'John Doe' } },
      }),
    ];

    service.getBreadcrumbs().subscribe((breadcrumbs) => {
      expect(breadcrumbs).toEqual([
        { label: 'Profile: John Doe', url: '/profile' },
      ]);
      done();
    });

    routerMock.events.next(new NavigationEnd(1, '/profile', '/profile'));
  });
});
