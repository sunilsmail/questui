import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DeeplinkService } from 'shared/services/deeplink.service';
import { MockActivatedRoute } from 'shared/specs/mocks/mock-activatedroute';
import { MockDeeplinkService } from 'shared/specs/mocks/mock-deeplink.service';
import { DeepLinkReasonResolver } from './deeplink-reason.resolver';

describe('Deeplink Resolver', () => {
    let pageService: DeeplinkService;
    let resolver: DeepLinkReasonResolver;
    let route: ActivatedRouteSnapshot;
    let router: Router;
    let activeRoute: any;

    beforeEach(() => {
        route = new ActivatedRouteSnapshot();
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientModule],
            providers: [
                { provide: DeeplinkService, useClass: MockDeeplinkService },
                { provide: ActivatedRoute, useClass: MockActivatedRoute },

            ]
        });
    });
    beforeEach(() => {
        pageService = TestBed.inject(DeeplinkService);
        resolver = TestBed.inject(DeepLinkReasonResolver);
        router = TestBed.inject(Router);
        activeRoute = TestBed.inject(ActivatedRoute);

    });
    it('should be created', () => {
        expect(resolver).toBeTruthy();
    });
    it('should call getReasonItems', () => {
        spyOn(pageService, 'getReasonItems').and.callThrough();
        route.queryParams = { 'reasonForVisit': 'PHLEBOTOMY' };
        resolver = new DeepLinkReasonResolver(pageService);
        const content = resolver.resolve(route, null);
        expect(pageService.getReasonItems).toHaveBeenCalledWith();
        content.subscribe(data => {
            expect(data.length).toEqual(3);
        });
    });
    it('should not call getReasonItems', () => {
        route.queryParams = { 'reasonForVisit': '' };
        resolver = new DeepLinkReasonResolver(pageService);
        const content = resolver.resolve(route, null);
        content.subscribe(data => {
            expect(data.length).toEqual(0);
        });
    });
});
