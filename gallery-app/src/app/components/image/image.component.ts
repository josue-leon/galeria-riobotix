import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Image } from 'src/app/models/image.model';
import { ImageService } from 'src/app/services/image.service';
import { ImageModalComponent } from '../image-modal/image-modal.component';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent {
  isLoading: boolean = true;

  @Input()
  image!: Image;

  @Input()
  isAdminMode: boolean = false;

  @Output()
  deletedImage: EventEmitter<number> = new EventEmitter<number>();

  @ViewChild('imageElement')
  imageElement!: ElementRef<HTMLImageElement>;

  constructor(
    private imageService: ImageService,
    private modalService: NgbModal,
    private toastService: ToastService
  ) {}

  onImageLoad(event: Event): void {
    this.isLoading = false;
    const img = event.target as HTMLImageElement;
    this.calculateMasonrySpan(img);
  }

  private calculateMasonrySpan(img: HTMLImageElement): void {
    const aspectRatio = img.naturalWidth / img.naturalHeight;
    const cardElement = img.closest('.masonry-image-card') as HTMLElement;

    if (cardElement) {
      // Calcular spans basado en aspect ratio optimizado para fotos iPhone
      let rowSpan = 1;
      let sizeClass = '';

      if (aspectRatio < 0.6) {
        // Imagen muy vertical (típica de iPhone en portrait)
        rowSpan = 3;
        sizeClass = 'tall';
      } else if (aspectRatio < 0.8) {
        // Imagen vertical moderada
        rowSpan = 2;
        sizeClass = 'medium-tall';
      } else if (aspectRatio < 1.2) {
        // Imagen cuadrada o casi cuadrada
        rowSpan = 2;
        sizeClass = 'square';
      } else if (aspectRatio < 1.8) {
        // Imagen horizontal moderada
        rowSpan = 1;
        sizeClass = 'medium-wide';
      } else {
        // Imagen muy horizontal (panorámica)
        rowSpan = 1;
        sizeClass = 'wide';
      }

      // Limpiar clases previas
      cardElement.className = cardElement.className.replace(/\b(tall|medium-tall|square|medium-wide|wide)\b/g, '');

      // Agregar nueva clase
      cardElement.classList.add(sizeClass);
      cardElement.style.gridRowEnd = `span ${rowSpan}`;
    }
  }

  openImageModal(): void {
    const modalRef = this.modalService.open(ImageModalComponent, { size: 'lg' });
    modalRef.componentInstance.image = this.image;
    modalRef.componentInstance.isAdminMode = this.isAdminMode;
  }

  deleteImage(): void {
    this.imageService.deleteImage(this.image.id).subscribe(
      response => this.handleResponse(response),
      errors => console.log(errors)
    );
  }

  downloadImage(): void {
    this.imageService.downloadImage(this.image.id).subscribe(
      blob => this.handleDownload(blob),
      errors => console.log(errors)
    );
  }

  private handleResponse(response: any): void {
    this.toastService.show('Eliminación', response.message, { classname: 'bg-success text-white', icon: 'ri-check-line' });
    this.deletedImage.emit(this.image.id);
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
