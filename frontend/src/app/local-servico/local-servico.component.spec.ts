import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalServicoComponent } from './local-servico.component';

describe('LocalServicoComponent', () => {
  let component: LocalServicoComponent;
  let fixture: ComponentFixture<LocalServicoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LocalServicoComponent]
    });
    fixture = TestBed.createComponent(LocalServicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
