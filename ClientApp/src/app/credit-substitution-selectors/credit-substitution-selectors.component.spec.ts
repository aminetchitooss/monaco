import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditSubstitutionSelectorsComponent } from './credit-substitution-selectors.component';

describe('CreditSubstitutionSelectorsComponent', () => {
  let component: CreditSubstitutionSelectorsComponent;
  let fixture: ComponentFixture<CreditSubstitutionSelectorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditSubstitutionSelectorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditSubstitutionSelectorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
