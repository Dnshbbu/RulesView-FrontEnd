import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskConfigComponent } from './risk-config.component';

describe('RiskConfigComponent', () => {
  let component: RiskConfigComponent;
  let fixture: ComponentFixture<RiskConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
