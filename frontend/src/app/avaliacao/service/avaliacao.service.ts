import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AvaliacaoModel } from '../model/avaliacao.model';
import { Observable } from 'rxjs';
import { ServicoModel } from 'src/app/servico/model/servico.model';

@Injectable({
  providedIn: 'root'
})
export class AvaliacaoService {

  constructor(private httpClient: HttpClient) { }

  private token = localStorage.getItem('token');
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${this.token}`    
    }),
    withCredentials: false
  };

  avaliar(avaliacaoModel: AvaliacaoModel) {
    // Mapeando apenas os IDs dos executores e avaliadores
    let body = JSON.stringify({
      taskId: avaliacaoModel.task.id, // Enviar apenas o ID da task
      taskExecutorsIds: avaliacaoModel.taskExecutors.map(exec => exec.id), // Enviar apenas os IDs dos executores
      taskEvaluatorsIds: avaliacaoModel.taskEvaluators.map(evaluator => evaluator.id), // Enviar apenas os IDs dos avaliadores
      assessmentDate: avaliacaoModel.assessmentDate,
      parameter0Result: avaliacaoModel.parameter0Result,
      parameter1Result: avaliacaoModel.parameter1Result,
      parameter2Result: avaliacaoModel.parameter2Result,
      parameter3Result: avaliacaoModel.parameter3Result,
      parameter4Result: avaliacaoModel.parameter4Result,
      parameter5Result: avaliacaoModel.parameter5Result,
      parameter6Result: avaliacaoModel.parameter6Result,
      parameter7Result: avaliacaoModel.parameter7Result,
      parameter8Result: avaliacaoModel.parameter8Result,
      parameter9Result: avaliacaoModel.parameter9Result,
      assessmentResult: avaliacaoModel.assessmentResult,
      obs: avaliacaoModel.obs,
      assessmentPhoto0: avaliacaoModel.assessmentPhoto0,
      assessmentPhoto1: avaliacaoModel.assessmentPhoto1,
      assessmentPhoto2: avaliacaoModel.assessmentPhoto2,
      assessmentPhoto3: avaliacaoModel.assessmentPhoto3,
      assessmentPhoto4: avaliacaoModel.assessmentPhoto4,
      assessmentPhoto5: avaliacaoModel.assessmentPhoto5,
      isReassessment: avaliacaoModel.isReassessment
    });
  
    return this.httpClient.post<AvaliacaoModel>(
      'http://localhost:8080/asbuilt/assessment/insertAssessment',
      body,
      this.httpOptions
    );
  }

  buscarServicosAguardandoAvaliacao(): Observable<ServicoModel[]> {
    return this.httpClient.get<ServicoModel[]>('http://localhost:8080/asbuilt/assessment/findTasksWithoutAssessment', this.httpOptions);
  }

  buscarServicosAvaliados(): Observable<ServicoModel[]> {
    return this.httpClient.get<ServicoModel[]>('http://localhost:8080/asbuilt/assessment/findTasksWithtAssessmentCompleted', this.httpOptions);
  }

  buscarServicosParaReavaliacao(): Observable<ServicoModel[]> {
    return this.httpClient.get<ServicoModel[]>('http://localhost:8080/asbuilt/assessment/findTasksNeedReassessment', this.httpOptions);
  }

  reavaliar(avaliacaoModel: AvaliacaoModel) {
    let body = JSON.stringify({
      task: avaliacaoModel.task,
      taskExecutors: avaliacaoModel.taskExecutors,
      taskEvaluators: avaliacaoModel.taskEvaluators,
      assessmentDate: avaliacaoModel.assessmentDate,
      parameter0Result: avaliacaoModel.parameter0Result,
      parameter1Result: avaliacaoModel.parameter1Result,
      parameter2Result: avaliacaoModel.parameter2Result,
      parameter3Result: avaliacaoModel.parameter3Result,
      parameter4Result: avaliacaoModel.parameter4Result,
      parameter5Result: avaliacaoModel.parameter5Result,
      parameter6Result: avaliacaoModel.parameter6Result,
      parameter7Result: avaliacaoModel.parameter7Result,
      parameter8Result: avaliacaoModel.parameter8Result,
      parameter9Result: avaliacaoModel.parameter9Result,
      assessmentResult: avaliacaoModel.assessmentResult,
      obs: avaliacaoModel.obs,
      assessmentPhoto0: avaliacaoModel.assessmentPhoto0,
      assessmentPhoto1: avaliacaoModel.assessmentPhoto1,
      assessmentPhoto2: avaliacaoModel.assessmentPhoto2,
      assessmentPhoto3: avaliacaoModel.assessmentPhoto3,
      assessmentPhoto4: avaliacaoModel.assessmentPhoto4,
      assessmentPhoto5: avaliacaoModel.assessmentPhoto5,
      isReassessment: avaliacaoModel.isReassessment
    });

    return this.httpClient.
      post<AvaliacaoModel>('http://localhost:8080/asbuilt/assessment/reassessment', body, this.httpOptions);
  }
}
