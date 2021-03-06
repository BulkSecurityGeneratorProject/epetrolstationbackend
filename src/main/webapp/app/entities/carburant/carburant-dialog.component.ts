import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Carburant } from './carburant.model';
import { CarburantPopupService } from './carburant-popup.service';
import { CarburantService } from './carburant.service';
import { CatCarburant, CatCarburantService } from '../cat-carburant';

@Component({
    selector: 'jhi-carburant-dialog',
    templateUrl: './carburant-dialog.component.html'
})
export class CarburantDialogComponent implements OnInit {

    carburant: Carburant;
    isSaving: boolean;

    catcarburants: CatCarburant[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private carburantService: CarburantService,
        private catCarburantService: CatCarburantService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.catCarburantService.query()
            .subscribe((res: HttpResponse<CatCarburant[]>) => { this.catcarburants = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.carburant.id !== undefined) {
            this.subscribeToSaveResponse(
                this.carburantService.update(this.carburant));
        } else {
            this.subscribeToSaveResponse(
                this.carburantService.create(this.carburant));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Carburant>>) {
        result.subscribe((res: HttpResponse<Carburant>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Carburant) {
        this.eventManager.broadcast({ name: 'carburantListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackCatCarburantById(index: number, item: CatCarburant) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-carburant-popup',
    template: ''
})
export class CarburantPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private carburantPopupService: CarburantPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.carburantPopupService
                    .open(CarburantDialogComponent as Component, params['id']);
            } else {
                this.carburantPopupService
                    .open(CarburantDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
