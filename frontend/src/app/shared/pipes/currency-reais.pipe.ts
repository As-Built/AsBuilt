import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({
  name: 'real'
})
export class RealPipe implements PipeTransform {

  constructor(private currencyPipe: CurrencyPipe) {}

  transform(value: any, args?: any): any {
    return this.currencyPipe.transform(value, 'BRL', 'symbol', '1.2-2', 'pt-BR');
  }

}