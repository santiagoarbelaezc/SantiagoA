import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectPlaxtilineasComponent } from './project-plaxtilineas.component';

describe('ProjectPlaxtilineasComponent', () => {
  let component: ProjectPlaxtilineasComponent;
  let fixture: ComponentFixture<ProjectPlaxtilineasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectPlaxtilineasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectPlaxtilineasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
