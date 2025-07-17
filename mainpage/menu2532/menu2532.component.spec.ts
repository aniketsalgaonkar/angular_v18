import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Menu2532Component } from './menu2532.component';

describe('Menu2532Component', () => {
  let component: Menu2532Component;
  let fixture: ComponentFixture<Menu2532Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Menu2532Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Menu2532Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
