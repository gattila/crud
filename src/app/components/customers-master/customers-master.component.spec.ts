import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersMasterComponent } from './customers-master.component';

describe('CustomersMasterComponent', () => {
  let component: CustomersMasterComponent;
  let fixture: ComponentFixture<CustomersMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomersMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomersMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
