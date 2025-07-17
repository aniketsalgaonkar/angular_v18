import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Menu4914Component } from './menu4914.component';

describe('Menu4914Component', () => {
  let component: Menu4914Component;
  let fixture: ComponentFixture<Menu4914Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Menu4914Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Menu4914Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
