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
        instagram: [],
        facebook: [],
        youtube: [],
        tiktok: [],
        kwai: [],
        telegram: [],
        spotify: [],
        twitter: [],
        google: [],
        twitch: [],
        soundcloud: []
    };

    medias: string[] = ['instagram', 'facebook', 'youtube', 'tiktok', 'kwai', 'telegram', 'spotify', 'twitter', 'google', 'twitch', 'soundcloud'];

    @ViewChild('pdfReport') pdfReport: ElementRef;

    constructor (private stateService: StateService) {}

    ngOnInit (): void {
        // this.report = this.stateService.data;

        this.report = {
            user: 'lucasreinaldi@gmail.com',
            price: 21312,
            medias: 'Instagram, Facebook',
            services: '12312',
            instagram: [
                {
                    instagramQty_1: 12312,
                    instagramCortesy_1: 232,
                    instagramService_1: '1231',
                    instagramUrl_1: '232'
                }
            ],
            facebook: [
                {
                    facebookQty_1: 3232,
                    facebookCortesy_1: 3232,
                    facebookService_1: '32',
                    facebookUrl_1: '3232'
                },
                {
                    facebookQty_2: 323,
                    facebookCortesy_2: 32,
                    facebookService_2: '32',
                    facebookUrl_2: '32'
                }
            ],
            youtube: [],
            tiktok: [],
            kwai: [],
            telegram: [],
            spotify: [],
            twitter: [],
            google: [],
            twitch: [],
            soundcloud: []
        };

        this.medias.forEach(media => {
            this.formatedReport[media] = this.report[media].map((item) => {
                const array = Object.entries(item);
                const media = {
                    Qty: array[0][1],
                    Cortesy: array[1][1],
                    Service: array[2][1],
                    Url: array[3][1]
                };

                return media;
            });
        });

        this.stateService.data = [];
    }

    async generatePDF (): Promise<void> {
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
            const username = this.report.user;

            pdf.save(`Relatorio__${date}-${username.toString().toUpperCase()}.pdf`);
        });
    }
}
