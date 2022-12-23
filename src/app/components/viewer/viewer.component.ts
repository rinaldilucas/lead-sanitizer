import { formatDate } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';
import { StateService } from '../_shared/services/state.service';

@Component({
    selector: 'app-viewer',
    templateUrl: './viewer.component.html',
    styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent {
    @ViewChild('printableContent') printableContent: ElementRef;
    socialmedias: string[] = ['instagram', 'facebook', 'youtube', 'tiktok', 'kwai', 'telegram', 'spotify', 'twitter', 'google', 'twitch', 'soundcloud'];
    currentDate = new Date();
    report: any;
    mappedInputs = [
        { title: 'instagram', items: [] },
        { title: 'facebook', items: [] },
        { title: 'youtube', items: [] },
        { title: 'tiktok', items: [] },
        { title: 'kwai', items: [] },
        { title: 'telegram', items: [] },
        { title: 'spotify', items: [] },
        { title: 'twitter', items: [] },
        { title: 'google', items: [] },
        { title: 'twitch', items: [] },
        { title: 'soundcloud', items: [] }
    ];

    constructor (private stateService: StateService) {}

    ngOnInit (): void {
        this.report = this.stateService.data;

        this.socialmedias.forEach(media => {
            const selectedObject: any = this.mappedInputs.find((r) => r.title === media.toString());
            selectedObject.items = this.report[media].map((item) => {
                const array = Object.entries(item);
                const socialmedia = {
                    Qty: array[0][1],
                    Cortesy: array[1][1],
                    Service: array[2][1],
                    Url: array[3][1]
                };

                return socialmedia;
            });
        });

        this.stateService.data = [];
    }

    async generatePDF (): Promise<void> {
        const printableContent = this.printableContent.nativeElement;

        await html2canvas(printableContent).then((canvas) => {
            const componentWidth = printableContent.offsetWidth;
            const componentHeight = printableContent.offsetHeight;
            const orientation = componentWidth >= componentHeight ? 'l' : 'p';
            const imgData = canvas.toDataURL('image/png');
            const pdf = new JsPDF({ orientation, unit: 'px' });
            pdf.internal.pageSize.width = componentWidth / 2;
            pdf.internal.pageSize.height = componentHeight / 2;
            pdf.addImage(imgData, 'JPG', 0, 0, componentWidth / 2, componentHeight / 2);
            const date = formatDate(new Date(), 'dd/MM/YYYY', 'pt-BR');
            const username = this.report.user;
            pdf.save(`Reporte [${date}] - ${username.toString().toUpperCase()}.pdf`);
        });
    }
}
