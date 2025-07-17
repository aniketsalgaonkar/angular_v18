import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'appHighlight'
})
export class HighlightDirective {
  constructor(private el: ElementRef) { this.highlight('red'); alert('const'); }

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight('red');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight(null);
  }

  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}