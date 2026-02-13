import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[dnd]'
})
export class Dnd {
  @Output() fileDropped = new EventEmitter<File>();

  @HostBinding('class.fileOver')
  fileOver = false;

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.fileOver = true;
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.fileOver = false;
  }

  @HostListener('drop', ['$event'])
  onDrag(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.fileOver = false;
    console.log(event);
    this.fileDropped.emit(event.dataTransfer?.files[0]);
  }
}
