import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Menu1398Component } from './menu1398.component';

describe('Menu1398Component', () => {
  let component: Menu1398Component;
  let fixture: ComponentFixture<Menu1398Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Menu1398Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Menu1398Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
