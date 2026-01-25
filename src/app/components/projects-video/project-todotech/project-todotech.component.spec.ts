import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectTodotechComponent } from './project-todotech.component';

describe('ProjectTodotechComponent', () => {
  let component: ProjectTodotechComponent;
  let fixture: ComponentFixture<ProjectTodotechComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectTodotechComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectTodotechComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
