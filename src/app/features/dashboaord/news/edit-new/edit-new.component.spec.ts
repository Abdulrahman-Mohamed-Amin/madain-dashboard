import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNewComponent } from './edit-new.component';

describe('EditNewComponent', () => {
  let component: EditNewComponent;
  let fixture: ComponentFixture<EditNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
