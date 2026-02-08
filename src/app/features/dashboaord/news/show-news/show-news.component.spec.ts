import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowNewsComponent } from './show-news.component';

describe('ShowNewsComponent', () => {
  let component: ShowNewsComponent;
  let fixture: ComponentFixture<ShowNewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowNewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
