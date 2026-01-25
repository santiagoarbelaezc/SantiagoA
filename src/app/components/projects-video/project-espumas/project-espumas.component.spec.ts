import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectEspumasComponent } from './project-espumas.component';

describe('ProjectEspumasComponent', () => {
  let component: ProjectEspumasComponent;
  let fixture: ComponentFixture<ProjectEspumasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectEspumasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectEspumasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
