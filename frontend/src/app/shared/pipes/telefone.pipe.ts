import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'telefone'
})
export class TelefonePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (value) {
      if (value.length === 11) {
        return value.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, "($1) $2.$3-$4");
      } else if (value.length === 10) {
        return value.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
      }
    }
    return '';
  }

}