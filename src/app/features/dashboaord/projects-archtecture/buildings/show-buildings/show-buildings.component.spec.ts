import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowBuildingsComponent } from './show-buildings.component';

describe('ShowBuildingsComponent', () => {
  let component: ShowBuildingsComponent;
  let fixture: ComponentFixture<ShowBuildingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowBuildingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowBuildingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
