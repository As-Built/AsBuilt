import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({
  name: 'customCurrency'
})
export class CustomCurrencyPipe implements PipeTransform {

  constructor(private currencyPipe: CurrencyPipe) {}

  transform(value: any, currencyCode: string, display: string = 'symbol', digitsInfo?: string, locale?: string): any {
    let formattedValue = this.currencyPipe.transform(value, currencyCode, display, digitsInfo, locale);
    if (formattedValue && currencyCode === 'USD') {
      formattedValue = formattedValue.replace('$', 'US$');
    }
    return formattedValue;
  }
}