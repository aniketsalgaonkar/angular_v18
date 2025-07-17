import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Menu4929Component } from './menu4929.component';

describe('Menu4929Component', () => {
  let component: Menu4929Component;
  let fixture: ComponentFixture<Menu4929Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Menu4929Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Menu4929Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
