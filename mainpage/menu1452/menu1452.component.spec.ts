import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Menu1452Component } from './menu1452.component';

describe('Menu1452Component', () => {
  let component: Menu1452Component;
  let fixture: ComponentFixture<Menu1452Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Menu1452Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Menu1452Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
