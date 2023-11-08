import { HttpClientTestingModule } from '@angular/common/http/testing';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PropertiesService } from 'shared/services/properties.service';
import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
import { AsEcheckinConfirmationComponent } from './as-echeckin-confirmation.component';

describe('AsEcheckinConfirmationComponent', () => {
  let component: AsEcheckinConfirmationComponent;
  let fixture: ComponentFixture<AsEcheckinConfirmationComponent>;
  let propertiesService: PropertiesService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AsEcheckinConfirmationComponent ],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [{provide: PropertiesService, useClass: MockPropertiesService}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsEcheckinConfirmationComponent);
    propertiesService = TestBed.inject(PropertiesService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('#getCreateAccountLink', () => {
    it('should get the legacyCreateAccountLink', () => {
      propertiesService.getLegacyCreateAccountLink().subscribe( link => {
        expect(component.legacyCreateAccountLink).toEqual(link);
      });
    });
  });

});

