import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, output, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { PrimeNG } from 'primeng/config';
import { FileUploadModule, UploadEvent } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [ButtonModule, CommonModule, FileUploadModule, TooltipModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class FileUploadComponent {
  @Input() name: string = '';
  @Output() uploadHandler = new EventEmitter<UploadEvent>();
  @Output() onDownloadClicked = new EventEmitter<void>();
  selectedFileName: any;
  file: File | null = null;
  totalSize: number = 0;

  totalSizePercent: number = 0;

  constructor(private config: PrimeNG, private messageService: MessageService) { }

  onUpload(event: UploadEvent) {
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Basic Mode' });
  }

  onFileSelect(event: any) {
    const file = event.files?.[0];
    if (file) {
      this.selectedFileName = file.name;
      console.log('Selected file:', this.selectedFileName);
    }
  }

  choose(event, callback) {
    callback();
  }

  onRemoveTemplatingFile(event, file, removeFileCallback, index) {
    removeFileCallback(event, index);
    this.totalSize -= parseInt(this.formatSize(file.size));
    this.totalSizePercent = this.totalSize / 10;
  }

  onClearTemplatingUpload(clear) {
    clear();
    this.totalSize = 0;
    this.totalSizePercent = 0;
  }

  onTemplatedUpload(event: UploadEvent) {
    this.uploadHandler.emit(event);
  }

  onSelectedFiles(event) {
    if (event.currentFiles && event.currentFiles.length > 0) {
      this.file = event.currentFiles[0];
      this.selectedFileName = this.file.name;
      this.totalSize = parseInt(this.formatSize(this.file.size));
      this.totalSizePercent = this.totalSize / 10;
    }
  }

  uploadEvent(callback) {
    callback();
  }

  formatSize(bytes) {
    const k = 1024;
    const dm = 3;
    const sizes = this.config.translation.fileSizeTypes;
    if (bytes === 0) {
      return `0 ${sizes[0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes[i]}`;
  }

  onDownloadButtonClicked() {
    this.onDownloadClicked.emit();
  }

}
