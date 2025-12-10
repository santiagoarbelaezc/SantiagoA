import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileXCarouselComponent } from './profile-x-carousel.component';

describe('ProfileXCarouselComponent', () => {
  let component: ProfileXCarouselComponent;
  let fixture: ComponentFixture<ProfileXCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileXCarouselComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileXCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
