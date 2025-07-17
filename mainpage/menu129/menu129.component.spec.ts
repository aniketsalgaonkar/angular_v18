import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Menu129Component } from './menu129.component';

describe('Menu129Component', () => {
  let component: Menu129Component;
  let fixture: ComponentFixture<Menu129Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Menu129Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Menu129Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
