import { Component } from '@angular/core';
import FileSaver from 'file-saver';
import * as JSZip from 'jszip';
@Component({
    selector: 'app-uploaders',
    templateUrl: './uploaders.component.html',
    styleUrls: ['./uploaders.component.scss']
})
export class UploadersComponent {
    loadedDatabase: string[] = [];
    loadedLeads: string[] = [];
    loadedProfiles: string[] = [];
    preparedLeads: string[] = [];
    preparedDatabase: string[] = [];
    profileFileTitle: string;
    databaseFileTitle: string;
    leadsFileTitle: string;
    listSize = 50;
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
            sanitizedLines.forEach(element => list.push(element + '\r'));
            sanitizedLines.forEach((element, index) => {
                if (element.length !== 14) {
                    if (element.charAt(5) === '3') {
                        element = element.substr(0, index) + '9' + element.substr(index);
                    }
                }
            });
            self.loadedDatabase = list;
        };

        fileReader.readAsText(fileToLoad, 'UTF-8');
        this.databaseFileTitle = $event.files[0].name;
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
            filteredList.forEach(element => list.push(element + '\r'));
            self.loadedLeads = list;
        };

        fileReader.readAsText(fileToLoad, 'UTF-8');
        this.leadsFileTitle = $event.files[0].name;
    }

    uploadFile ($event) {
        const fileToLoad = $event.files[0];
        const fileReader = new FileReader();
        const sanitizedLines: string[] = [];
        const self = this;

        fileReader.onloadend = function (fileLoadedEvent) {
            const array = (fileLoadedEvent.target?.result as string).split('\n');

            array.forEach((element) => {
                if (element !== '\r' && element !== ',\r' && element !== '') {
                    const newElement = element.replace(/\r?\n|\r/g, '');
                    sanitizedLines.push(newElement);
                }
            });

            const filteredList = sanitizedLines.filter((element, index) => sanitizedLines.indexOf(element) === index);
            const list: string[] = [];
            filteredList.forEach(element => list.push(element + '\r'));
            self.loadedProfiles = list;
        };

        fileReader.readAsText(fileToLoad, 'UTF-8');
        this.profileFileTitle = $event.files[0].name;
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
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    downloadDatabase (title: string) {
        this.downloadFile(this.preparedDatabase, title);
    }

    downloadProfiles (title: string) {
        this.downloadFile(this.loadedProfiles, title);
    }

    downloadLeads () {
        const chunkedList = this.spliceIntoChunks(this.preparedLeads, this.listSize);
        const zip = new JSZip();
        const date = new Date().toISOString().slice(0, 10);

        chunkedList.forEach((list: any, index) => {
            zip.file(date + '_leads-' + ++index + '.txt', list.toString().replace(/,/g, ''));
        });
        zip.generateAsync({ type: 'blob' }).then(function (content) {
            FileSaver.saveAs(content, date + '_leads.zip');
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
