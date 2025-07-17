import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Menu5917Component } from './menu5917.component';

describe('Menu5917Component', () => {
  let component: Menu5917Component;
  let fixture: ComponentFixture<Menu5917Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Menu5917Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Menu5917Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
