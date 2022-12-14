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
    whatsapps = 10;
    leadsQty = 60;
    isEmail = false;
    isPrepared = false;
    isLoading = false;

    uploadDatabase ($event) {
        this.isLoading = true;
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
            self.isLoading = false;
        };

        fileReader.readAsText(fileToLoad, 'UTF-8');
        this.databaseFileTitle = $event.files[0].name;
    }

    uploadLeads ($event) {
        this.isLoading = true;

        const self = this;
        const fileToLoad = $event.files[0];
        const fileReader = new FileReader();
        const sanitizedLines: string[] = [];

        fileReader.onloadend = function (fileLoadedEvent) {
            const array = (fileLoadedEvent.target?.result as string).split('\n');

            if (self.isEmail) {
                array.forEach((element) => {
                    if (element !== '\r' && element !== ',\r' && element !== '') {
                        const newElement = element.replace(/\r?\n|\r/g, '');
                        sanitizedLines.push(newElement);
                    }
                });
            } else {
                array.forEach((element) => {
                    if (element !== '\r' && element !== ',\r' && element !== '' && element.includes('+55')) {
                        const newElement = element.replace(/\r?\n|\r/g, '').replace('.', '').replace(',', '');
                        sanitizedLines.push(newElement);
                    }
                });
            }

            const filteredList = sanitizedLines.filter((element, index) => sanitizedLines.indexOf(element) === index);
            const list: string[] = [];
            if (self.isEmail) {
                filteredList.forEach(element => list.push(element + '\r\n'));
            } else {
                filteredList.forEach(element => list.push(element + '\r'));
            }
            self.loadedLeads = list;
            self.isLoading = false;
        };

        fileReader.readAsText(fileToLoad, 'UTF-8');
        this.leadsFileTitle = $event.files[0].name;
    }

    uploadFile ($event) {
        const fileToLoad = $event.files[0];
        const fileReader = new FileReader();
        const self = this;

        fileReader.onloadend = function (fileLoadedEvent) {
            const list = [...new Set((fileLoadedEvent.target?.result as string).split('\n'))];
            const errorList: string[] = [];
            list.forEach(element => {
                const ocurrences = (element as string).match(/,/g)?.length;

                if (ocurrences && ocurrences !== 5) {
                    errorList.push(element);
                }
            });

            const finalList = list.filter(val => !errorList.includes(val));
            self.loadedProfiles = finalList;
        };

        fileReader.readAsText(fileToLoad, 'UTF-8');
        this.profileFileTitle = $event.files[0].name;
    }

    prepareLeads () {
        this.isLoading = true;

        setTimeout(() => {
            this.preparedLeads = leads.filter(val => !database.includes(val));
            const concatedList = database.concat(leads);
            this.preparedDatabase = concatedList.filter((element, index) => concatedList.indexOf(element) === index);
            this.isPrepared = true;
            this.isLoading = false;
        }, 500);
        const leads = this.loadedLeads;
        const database = this.loadedDatabase;
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
        let chunkedList = this.spliceIntoChunks(this.preparedLeads, this.leadsQty);
        const zip = new JSZip();
        const date = new Date().toISOString().slice(0, 10);
        let modifier = 1;
        const extension = this.isEmail ? '.txt' : '.csv';

        for (let index = 0; index < 6;) {
            if (chunkedList.length > 0) {
                switch (index) {
                case 0:
                    const segunda = zip.folder(modifier + ' - ' + 'segunda-feira');
                    for (let j = 0; j < this.whatsapps; j++) {
                        if (chunkedList[j]) {
                            segunda?.file(date + '_leads-' + (j + 1) + extension, chunkedList[j].toString().replace(/,/g, ''));
                        }
                    }
                    chunkedList = chunkedList.slice(this.whatsapps, chunkedList.length);
                    break;
                case 1:
                    const terca = zip.folder(modifier + ' - ' + 'ter??a-feira');
                    for (let j = 0; j < this.whatsapps; j++) {
                        if (chunkedList[j]) {
                            terca?.file(date + '_leads-' + (j + 1) + extension, chunkedList[j].toString().replace(/,/g, ''));
                        }
                    }
                    chunkedList = chunkedList.slice(this.whatsapps, chunkedList.length);
                    break;
                case 2:
                    const quarta = zip.folder(modifier + ' - ' + 'quarta-feira');
                    for (let j = 0; j < this.whatsapps; j++) {
                        if (chunkedList[j]) {
                            quarta?.file(date + '_leads-' + (j + 1) + extension, chunkedList[j].toString().replace(/,/g, ''));
                        }
                    }
                    chunkedList = chunkedList.slice(this.whatsapps, chunkedList.length);
                    break;
                case 3:
                    const quinta = zip.folder(modifier + ' - ' + 'quinta-feira');
                    for (let j = 0; j < this.whatsapps; j++) {
                        if (chunkedList[j]) {
                            quinta?.file(date + '_leads-' + (j + 1) + extension, chunkedList[j].toString().replace(/,/g, ''));
                        }
                    }
                    chunkedList = chunkedList.slice(this.whatsapps, chunkedList.length);
                    break;
                case 4:
                    const sexta = zip.folder(modifier + ' - ' + 'sexta-feira');
                    for (let j = 0; j < this.whatsapps; j++) {
                        if (chunkedList[j]) {
                            sexta?.file(date + '_leads-' + (j + 1) + extension, chunkedList[j].toString().replace(/,/g, ''));
                        }
                    }
                    chunkedList = chunkedList.slice(this.whatsapps, chunkedList.length);
                    break;
                case 5:
                    const sabado = zip.folder(modifier + ' - ' + 'sabado');
                    for (let j = 0; j < this.whatsapps; j++) {
                        if (chunkedList[j]) {
                            sabado?.file(date + '_leads-' + (j + 1) + extension, chunkedList[j].toString().replace(/,/g, ''));
                        }
                    }
                    chunkedList = chunkedList.slice(this.whatsapps, chunkedList.length);
                    break;
                }
                modifier++;
                if (index === 5) {
                    index = 0;
                } else {
                    index++;
                }
            } else {
                index = 6;
            }
        }

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
