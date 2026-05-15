import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CdbService } from '../../services/cdb.service';
import { CdbCalculationResult } from '../../models/cdb.model';

@Component({
  selector: 'app-cdb-calculator',
  templateUrl: './cdb-calculator.component.html',
  styleUrls: ['./cdb-calculator.component.scss']
})
export class CdbCalculatorComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly cdbService = inject(CdbService);

  form!: FormGroup;
  result: CdbCalculationResult | null = null;
  isLoading = false;
  errorMessage = '';

  private _rawValue = 0;
  displayValue = '';

  ngOnInit(): void {
    this.form = this.fb.group({
      initialValue: [null, [Validators.required, Validators.min(0.01)]],
      months:       [null, [Validators.required, Validators.min(2)]]
    });
  }

  get initialValueCtrl() { return this.form.get('initialValue'); }
  get monthsCtrl()       { return this.form.get('months'); }

  onValueKeydown(event: KeyboardEvent): void {
    const allowed = [
      'Backspace','Delete','Tab','Escape','Enter',
      'ArrowLeft','ArrowRight','Home','End'
    ];
    if (allowed.includes(event.key)) return;
    if (!/^\d$/.test(event.key)) event.preventDefault();
  }

  onValueInput(event: Event): void {
    const el     = event.target as HTMLInputElement;
    const digits = el.value.replace(/\D/g, '');
    const num    = digits ? parseInt(digits, 10) / 100 : 0;

    this._rawValue   = num;
    this.displayValue = this.formatBRL(num);
    el.value         = this.displayValue;

    this.initialValueCtrl?.setValue(num > 0 ? num : null, { emitEvent: false });
    this.initialValueCtrl?.markAsTouched();
  }
onMonthsKeydown(event: KeyboardEvent): void {
    const allowed = [
      'Backspace','Delete','Tab','Escape','Enter',
      'ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'
    ];
    if (allowed.includes(event.key)) return;
    if (!/^\d$/.test(event.key)) event.preventDefault();
  }

  increment(): void {
    const v = Number(this.monthsCtrl?.value) || 1;
    this.monthsCtrl?.setValue(v + 1);
    this.monthsCtrl?.markAsTouched();
  }

  decrement(): void {
    const v    = Number(this.monthsCtrl?.value) || 3;
    const next = v - 1;
    this.monthsCtrl?.setValue(next >= 2 ? next : 2);
    this.monthsCtrl?.markAsTouched();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading    = true;
    this.result       = null;
    this.errorMessage = '';

    this.cdbService.calculate({
      valorInvestido: Number(this.initialValueCtrl?.value),
      meses:       Number(this.monthsCtrl?.value)
    }).subscribe({
      next: (data: CdbCalculationResult): void => {
        this.result    = data;
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse): void => {
        this.errorMessage =
          (err.error as { message?: string })?.message ??
          'Erro ao calcular. Verifique os dados e tente novamente.';
        this.isLoading = false;
      }
    });
  }

  onReset(): void {
    this.form.reset();
    this.displayValue = '';
    this._rawValue    = 0;
    this.result       = null;
    this.errorMessage = '';
  }

  formatBRL(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency', currency: 'BRL', minimumFractionDigits: 2
    });
  }

  getTaxLabel(): string {
    const m = Number(this.monthsCtrl?.value);
    if (m <= 6)  return '22,5%';
    if (m <= 12) return '20%';
    if (m <= 24) return '17,5%';
    return '15%';
  }
}
