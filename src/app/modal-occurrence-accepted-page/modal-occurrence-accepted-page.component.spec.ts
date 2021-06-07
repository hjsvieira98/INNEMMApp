import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalOccurrenceAcceptedPageComponent } from './modal-occurrence-accepted-page.component';

describe('ModalOccurrenceAcceptedPageComponent', () => {
  let component: ModalOccurrenceAcceptedPageComponent;
  let fixture: ComponentFixture<ModalOccurrenceAcceptedPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalOccurrenceAcceptedPageComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalOccurrenceAcceptedPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
