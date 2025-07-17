import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Menu2535Component } from './menu2535.component';

describe('Menu2535Component', () => {
  let component: Menu2535Component;
  let fixture: ComponentFixture<Menu2535Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Menu2535Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Menu2535Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
