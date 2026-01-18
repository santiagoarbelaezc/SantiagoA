import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsVideoComponent } from './projects-video.component';

describe('ProjectsVideoComponent', () => {
  let component: ProjectsVideoComponent;
  let fixture: ComponentFixture<ProjectsVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsVideoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
