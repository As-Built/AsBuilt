import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'telefone'
})
export class TelefonePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return value ? value.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, "($1) $2.$3-$4") : '';
  }

}