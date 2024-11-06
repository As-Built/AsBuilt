import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioProducaoComponent } from './relatorio-producao.component';

describe('RelatorioProducaoComponent', () => {
  let component: RelatorioProducaoComponent;
  let fixture: ComponentFixture<RelatorioProducaoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RelatorioProducaoComponent]
    });
    fixture = TestBed.createComponent(RelatorioProducaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
