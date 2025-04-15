import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel, MatOption, MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-credit-substitution-selectors',
  standalone: true,
  imports: [MatSelect, MatLabel, MatFormField, MatOption, ReactiveFormsModule],
  templateUrl: './credit-substitution-selectors.component.html',
  styleUrl: './credit-substitution-selectors.component.scss'
})
export class CreditSubstitutionSelectorsComponent {
  templateString = 'Convert {C} on {D} and galiik {C} mazaal';

  items = [
    {
      token: '{C}',
      description: 'Currency',
      multi: true,
      substitutionElements: [
        { displayName: 'EUR', value: "'EUR'" },
        { displayName: 'USD', value: "'USD'" },
        { displayName: 'GBP', value: "'GBP'" }
      ]
    },
    {
      token: '{D}',
      description: 'Date',
      multi: false,
      substitutionElements: [
        { displayName: 'Today', value: 'today' },
        { displayName: 'Yesterday', value: 'yesterday' },
        { displayName: 'Tomorrow', value: 'tomorrow' }
      ]
    }
  ];

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      items: this.fb.array([])
    });

    this.initializeForm();

    this.itemControls.valueChanges.subscribe(() => {
      console.log('Swap Elements:', this.getSwapElements());
    });
  }

  get itemControls(): FormArray {
    return this.form.get('items') as FormArray;
  }

  getSwapElements(): SwapElement[] {
    return this.items.map((item, index) => {
      const controlValue = this.itemControls.at(index).value;
      const value = item.multi && Array.isArray(controlValue) ? controlValue.join(', ') : controlValue;

      return {
        key: item.token,
        value: value || ''
      };
    });
  }

  // initializeForm() {
  //   this.items.forEach(item => {
  //     const control = new FormControl(item.multi ? [] : '');
  //     this.itemControls.push(control);
  //   });
  // }

  initializeForm(): void {
    this.items.forEach(item => {
      const defaultValue: any = item.multi
        ? [item.substitutionElements[0]?.value] // pre-select first in array
        : item.substitutionElements[0]?.value || ''; // single selection

      const control = item.multi ? new FormControl<string[]>(defaultValue) : new FormControl<string>(defaultValue);

      this.itemControls.push(control);
    });
  }

  getOutputString(): string {
    let output = this.templateString;

    this.getSwapElements().forEach(swap => {
      const tokenRegex = new RegExp(this.escapeRegex(swap.key), 'g');
      output = output.replace(tokenRegex, swap.value);
    });

    return output;
  }

  // getOutputString(): string {
  //   let output = this.templateString;
  //
  //   this.items.forEach((item, index) => {
  //     const value = this.itemControls.at(index).value;
  //     const replacement = Array.isArray(value) ? value.join(', ') : value;
  //     // Use RegExp with global flag to replace all instances
  //     const tokenRegex = new RegExp(this.escapeRegex(item.token), 'g');
  //     output = output.replace(tokenRegex, replacement || '');
  //   });
  //
  //   return output;
  // }

  // Escape special characters in token (like { and }) so it works in RegExp
  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
export interface SwapElement {
  key: string;
  value: string;
}
