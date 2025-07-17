import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Menu1459Component } from './menu1459.component';

describe('Menu1459Component', () => {
  let component: Menu1459Component;
  let fixture: ComponentFixture<Menu1459Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Menu1459Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Menu1459Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
