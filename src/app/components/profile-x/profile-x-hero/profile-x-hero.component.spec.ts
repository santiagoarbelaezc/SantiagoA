import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileXHeroComponent } from './profile-x-hero.component';

describe('ProfileXHeroComponent', () => {
  let component: ProfileXHeroComponent;
  let fixture: ComponentFixture<ProfileXHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileXHeroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileXHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
