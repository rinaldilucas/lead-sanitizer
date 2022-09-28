import { Component } from '@angular/core';

@Component({
    selector: 'app-uploaders',
    templateUrl: './uploaders.component.html',
    styleUrls: ['./uploaders.component.scss']
})
export class UploadersComponent {
    loadedDatabase: string[] = [];
    loadedLeads: string[] = [];
    preparedLeads: string[] = [];
    preparedDatabase: string[] = [];
    listSize = 300;
    isPrepared = false;

    uploadDatabase ($event) {
        const fileToLoad = $event.files[0];
        const fileReader = new FileReader();
        const sanitizedLines: string[] = [];
        const self = this;

        fileReader.onloadend = function (fileLoadedEvent) {
            const array = (fileLoadedEvent.target?.result as string).split('\n');

            array.forEach((element) => {
                if (element !== '\r' && element !== ',\r' && element !== '' && element.includes('+55')) {
                    const newElement = element.replace(/\r?\n|\r/g, '').replace('.', '').replace(',', '');
                    sanitizedLines.push(newElement);
                }
            });
            const list: string[] = [];
            sanitizedLines.forEach(element => list.push(element + '\r\n'));
            self.loadedDatabase = list;
        };

        fileReader.readAsText(fileToLoad, 'UTF-8');
    }

    uploadLeads ($event) {
        const fileToLoad = $event.files[0];
        const fileReader = new FileReader();
        const sanitizedLines: string[] = [];
        const self = this;

        fileReader.onloadend = function (fileLoadedEvent) {
            const array = (fileLoadedEvent.target?.result as string).split('\n');

            array.forEach((element) => {
                if (element !== '\r' && element !== ',\r' && element !== '' && element.includes('+55')) {
                    const newElement = element.replace(/\r?\n|\r/g, '').replace('.', '').replace(',', '');
                    sanitizedLines.push(newElement);
                }
            });

            const filteredList = sanitizedLines.filter((element, index) => sanitizedLines.indexOf(element) === index);
            const list: string[] = [];
            filteredList.forEach(element => list.push(element + '\r\n'));
            self.loadedLeads = list;
        };

        fileReader.readAsText(fileToLoad, 'UTF-8');
    }

    prepareLeads () {
        const leads = this.loadedLeads;
        const database = this.loadedDatabase;

        this.preparedLeads = leads.filter(val => !database.includes(val));
        const concatedList = database.concat(leads);
        this.preparedDatabase = concatedList.filter((element, index) => concatedList.indexOf(element) === index);
        this.isPrepared = true;
    }

    downloadFile (data: string[], filename: string) {
        const blob = new Blob([data.join('\n')], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', filename + '.txt');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    downloadDatabase () {
        this.downloadFile(this.preparedDatabase, 'database');
    }

    downloadLeads () {
        const chunkedList = this.spliceIntoChunks(this.preparedLeads, this.listSize);

        chunkedList.forEach((list: any, index) => {
            const date = new Date().toISOString().slice(0, 10);
            this.downloadFile(list, date + '_leads-' + ++index);
        });
    }

    spliceIntoChunks (arr, chunkSize) {
        const res: string[] = [];
        while (arr.length > 0) {
            const chunk = arr.splice(0, chunkSize);
            res.push(chunk);
        }
        return res;
    }
}
