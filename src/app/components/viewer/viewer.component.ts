import { formatDate } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';
import { StateService } from '../services/state.service';

@Component({
    selector: 'app-viewer',
    templateUrl: './viewer.component.html',
    styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent {
    currentDate = new Date();
    report: any;
    formatedReport = {
        instagram: []
    };

    @ViewChild('pdfReport') pdfReport: ElementRef;

    constructor (private stateService: StateService) {}

    ngOnInit (): void {
        this.report = this.stateService.data;

        this.formatedReport.instagram = this.report.instagram.map((item) => {
            const array = Object.entries(item);
            const instagram = {
                instagramQty: array[0][1],
                instagramCortesy: array[1][1],
                instagramService: array[2][1],
                instagramUrl: array[3][1]
            };

            return instagram;
        });

        this.stateService.data = [];
    }

    async generatePDF (): Promise<any> {
        const pdfReport = this.pdfReport.nativeElement;

        await html2canvas(pdfReport).then((canvas) => {
            const componentWidth = pdfReport.offsetWidth;
            const componentHeight = pdfReport.offsetHeight;

            const orientation = componentWidth >= componentHeight ? 'l' : 'p';

            const imgData = canvas.toDataURL('image/png');
            const pdf = new JsPDF({
                orientation,
                unit: 'px'
            });

            pdf.internal.pageSize.width = componentWidth / 2;
            pdf.internal.pageSize.height = componentHeight / 2;

            pdf.addImage(imgData, 'JPG', 0, 0, componentWidth / 2, componentHeight / 2);

            const date = formatDate(new Date(), 'dd/MM/YYYY', 'pt-BR');
            const client = this.report.user;

            pdf.save(`Relatorio__${date}-${client}.pdf`);
        });
    }
}
