import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectdetilsComponent } from './projectdetils.component';

describe('ProjectdetilsComponent', () => {
  let component: ProjectdetilsComponent;
  let fixture: ComponentFixture<ProjectdetilsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectdetilsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectdetilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
