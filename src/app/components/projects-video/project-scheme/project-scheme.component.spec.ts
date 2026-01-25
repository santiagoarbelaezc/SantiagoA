import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSchemeComponent } from './project-scheme.component';

describe('ProjectSchemeComponent', () => {
  let component: ProjectSchemeComponent;
  let fixture: ComponentFixture<ProjectSchemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectSchemeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectSchemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
