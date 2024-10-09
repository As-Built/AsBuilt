import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AvaliacaoModel } from '../model/avaliacao.model';
import { Observable } from 'rxjs';
import { ServicoModel } from 'src/app/servico/model/servico.model';
import { JwtHelperService } from '@auth0/angular-jwt';

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
      task: avaliacaoModel.task,
      taskExecutorsIds: avaliacaoModel.taskExecutors.map(exec => exec.id), // Enviar apenas os IDs dos executores
      taskEvaluatorsIds: avaliacaoModel.taskEvaluators.map(evaluator => evaluator.id), // Enviar apenas os IDs dos avaliadores
      assessmentDate: avaliacaoModel.assessmentDate,
      parameter0Result: avaliacaoModel.assessmentParameter0Result,
      parameter1Result: avaliacaoModel.assessmentParameter1Result,
      parameter2Result: avaliacaoModel.assessmentParameter2Result,
      parameter3Result: avaliacaoModel.assessmentParameter3Result,
      parameter4Result: avaliacaoModel.assessmentParameter4Result,
      parameter5Result: avaliacaoModel.assessmentParameter5Result,
      parameter6Result: avaliacaoModel.assessmentParameter6Result,
      parameter7Result: avaliacaoModel.assessmentParameter7Result,
      parameter8Result: avaliacaoModel.assessmentParameter8Result,
      parameter9Result: avaliacaoModel.assessmentParameter9Result,
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

  updateAssessmentPhotos(assessmentId: number, photos: {buffer: Uint8Array, name: string}[]): Observable<any> {
    let formData = new FormData();
    formData.append('assessmentId', assessmentId.toString());
  
    photos.forEach((photo, index) => {
      let file = new File([photo.buffer], photo.name);
      formData.append(`file${index}`, file);
    });
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
  
    return this.httpClient.post("http://localhost:8080/asbuilt/blob/uploadAssessmentPhotos", formData, { headers });
}

  buscarAvaliacaoPorId(id: number): Observable<AvaliacaoModel> {
    return this.httpClient.get<AvaliacaoModel>(`http://localhost:8080/asbuilt/assessment/findAssessmentById/${id}`, this.httpOptions);
  }

  buscarServicosAguardandoAvaliacao(): Observable<ServicoModel[]> {
    return this.httpClient.get<ServicoModel[]>('http://localhost:8080/asbuilt/assessment/findTasksWithoutAssessment', this.httpOptions);
  }

  buscarServicosAvaliados(): Observable<ServicoModel[]> {
    return this.httpClient.get<ServicoModel[]>('http://localhost:8080/asbuilt/assessment/findTasksWithAssessmentCompleted', this.httpOptions);
  }

  buscarServicosParaReavaliacao(): Observable<ServicoModel[]> {
    return this.httpClient.get<ServicoModel[]>('http://localhost:8080/asbuilt/assessment/findTasksNeedReassessment', this.httpOptions);
  }

  buscarAvaliacaoPorServicoId(id: number): Observable<AvaliacaoModel> {
    return this.httpClient.get<AvaliacaoModel>(`http://localhost:8080/asbuilt/assessment/findAssessmentByTaskId/${id}`, this.httpOptions);
  }

  reavaliar(avaliacaoModel: AvaliacaoModel) {
    let body = JSON.stringify({
      task: avaliacaoModel.task,
      taskExecutors: avaliacaoModel.taskExecutors,
      taskEvaluators: avaliacaoModel.taskEvaluators,
      assessmentDate: avaliacaoModel.assessmentDate,
      parameter0Result: avaliacaoModel.assessmentParameter0Result,
      parameter1Result: avaliacaoModel.assessmentParameter1Result,
      parameter2Result: avaliacaoModel.assessmentParameter2Result,
      parameter3Result: avaliacaoModel.assessmentParameter3Result,
      parameter4Result: avaliacaoModel.assessmentParameter4Result,
      parameter5Result: avaliacaoModel.assessmentParameter5Result,
      parameter6Result: avaliacaoModel.assessmentParameter6Result,
      parameter7Result: avaliacaoModel.assessmentParameter7Result,
      parameter8Result: avaliacaoModel.assessmentParameter8Result,
      parameter9Result: avaliacaoModel.assessmentParameter9Result,
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

  deletarAvaliacao(id: number) {
    return this.httpClient.delete(`http://localhost:8080/asbuilt/assessment/deleteAssessmentById/${id}`, this.httpOptions);
  }
}
