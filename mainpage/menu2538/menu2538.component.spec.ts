import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Menu2538Component } from './menu2538.component';

describe('Menu2538Component', () => {
  let component: Menu2538Component;
  let fixture: ComponentFixture<Menu2538Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Menu2538Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Menu2538Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
