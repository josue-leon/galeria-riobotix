import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Image } from 'src/app/models/image.model';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.scss']
})
export class ImageModalComponent {
  @Input()
  image!: Image;

  @Input()
  isAdminMode: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private imageService: ImageService
  ) {}

  downloadImage(): void {
    this.imageService.downloadImage(this.image.id).subscribe(
      blob => this.handleDownload(blob),
      errors => console.log(errors)
    );
  }

  private handleDownload(blob: Blob): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = this.image.title || `imagen_${this.image.id}`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
