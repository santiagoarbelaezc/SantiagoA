import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileXAboutComponent } from './profile-x-about.component';

describe('ProfileXAboutComponent', () => {
  let component: ProfileXAboutComponent;
  let fixture: ComponentFixture<ProfileXAboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileXAboutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileXAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
