import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'assessmentResult'
})
export class AssessmentResultPipe implements PipeTransform {

  transform(value: boolean): string {
    return value ? 'Aprovado' : 'Reprovado';
  }

}