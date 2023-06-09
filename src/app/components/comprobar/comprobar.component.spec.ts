import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprobarComponent } from './comprobar.component';

describe('ComprobarComponent', () => {
  let component: ComprobarComponent;
  let fixture: ComponentFixture<ComprobarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComprobarComponent]
    });
    fixture = TestBed.createComponent(ComprobarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
