import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompensacionComponent } from './compensacion.component';

describe('CompensacionComponent', () => {
  let component: CompensacionComponent;
  let fixture: ComponentFixture<CompensacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompensacionComponent]
    });
    fixture = TestBed.createComponent(CompensacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
