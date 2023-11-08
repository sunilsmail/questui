import { HttpClientTestingModule } from '@angular/common/http/testing';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CustomPipesModule } from 'shared/custom-pipes.module';
import { DataService } from 'shared/services/data.service';
import { PscService } from 'shared/services/psc.service';
import { MockDataService } from 'shared/specs/mocks/mock-data.service';
import { MockPscService } from 'shared/specs/mocks/mock-psc.service';
import { AsConfirmationPrintComponent } from './as-confirmation-print.component';


describe('AsConfirmationPrintComponent', () => {
  let component: AsConfirmationPrintComponent;
  let fixture: ComponentFixture<AsConfirmationPrintComponent>;
  let dataService: DataService;
  let pscService:PscService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AsConfirmationPrintComponent ],
      imports: [CustomPipesModule,
                RouterTestingModule,
                HttpClientTestingModule
              ],
              providers: [
                { provide: DataService, useClass: MockDataService },
                { provide: PscService, useClass: MockPscService }
            ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsConfirmationPrintComponent);
    dataService = TestBed.inject(DataService);
    pscService = TestBed.inject(PscService);
    component = fixture.componentInstance;
    component.inputEvent = {
      facilityTestTypeValue: 'Glucose',
      appointmentDate: '2019-12-24',
      appointmentTime: '07:00',
      firstName:'Shaikh',
      siteCode: 'ACV',
      name: 'Quest Diagnostics - Bound Brook',
      address1: '601 W Union Ave',
      address2: null,
      city: 'Bound Brook',
      state: 'NJ',
      zip: '08805-1166',
      phone: 7327321450,
      confirmationCode: 'QSDDFF',
      estimatedCost: '25',
     // tslint:disable-next-line: max-line-length
      qrcode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUoAAAFKAQAAAABTUiuoAAAChklEQVR4Xu2ZO3LDMAxE4Unh0kfQUXQ08Wg6io7gUoXHCHZBypSczLjMRMsiGhKPzQZf2vzTNdvx5NclVKhQoUL/CLoY1s29PO2KgwuNxX2l5Utoh47xZ70tYzP6w2Ln9rXGfX8K3aFlOw00Lj6CH8sF982E/oDydLVhniqzHQp9Q32eYnMPQZ+5E/oj6oxYCyPQcMIrch7k9WPEnh41LKQ3CLr70CK0Q9uam5KXB8tobxPa6UoJp2T8CZXDJe16Z7IT+kLjk1FZ8In4jRs2YBeVgYDQF+roK7IW0AhdHb4YurofI/bk6DxFl18rJgRFSxYfFs6xtv5CN9RSSd5g/UQYwxdjERHao9CVvphMuKSFL1JloT3qHIKcwUlfRC2o3jcfugyhhR0rjExvoTImAO4OhfP0KJisBfhEewGmJTv0aUJ3KCMWE2Pt8h29GJLdwNlS6IbCCXOMbE9faYOgi71F7MnRJi8EZaiyFyuGLGdT9rZCN+YCXUe8E4axtRdE8dIj9IU6WlVWTDohbjBiHfLu05tQxxhJXbfOjE9fWIEeIvbsKILzGjtUTNyAEw7RbLBwTokIbbpONVShK40rJ/Da8+/+BWdHg2kzdyY0RGyNX14U2qHs8mMyCiMY5w2UhNqnCe3REJSTUaKFvug4xNPXvtkXGkYGJ/Nahmoe8tdZoR1a15KNK+x0OzxXQOx9Q3J2dIGVMdryWnYZWSCmvssQylBlqeTvQSwJtY1Nm9AeLfkyT2bAywTQgr/2VguEEo1j6uoABm/1E4jQIzpiJIr01mpB5DWMkfuIFeqI2CVfU4cqaLgkkx0DV+iGwungbwjVeoM9h6dLCu3Qj5ZQoUKFCv2v6DcvDtJUnzJPEgAAAABJRU5ErkJggg==',
      sitePhone:'(562) 5625926',
      landmark: 'Located in the Shop Rite Shopping Center',
  };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
