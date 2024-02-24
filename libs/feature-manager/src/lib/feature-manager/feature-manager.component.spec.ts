import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureManagerComponent } from './feature-manager.component';

describe('FeatureManagerComponent', () => {
  let component: FeatureManagerComponent;
  let fixture: ComponentFixture<FeatureManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureManagerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
