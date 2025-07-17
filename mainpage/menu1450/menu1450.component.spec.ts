import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Menu1450Component } from './menu1450.component';

describe('Menu1450Component', () => {
  let component: Menu1450Component;
  let fixture: ComponentFixture<Menu1450Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Menu1450Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Menu1450Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
