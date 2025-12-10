import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateWorldComponent } from './template-world.component';

describe('TemplateWorldComponent', () => {
  let component: TemplateWorldComponent;
  let fixture: ComponentFixture<TemplateWorldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateWorldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateWorldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
