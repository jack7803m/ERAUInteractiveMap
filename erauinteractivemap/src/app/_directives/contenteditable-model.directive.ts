import { Directive, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appContenteditableModel]',
  host: {
    '(blur)': 'onBlur()'
  }
})
export class ContenteditableModelDirective implements OnChanges {

  constructor(private elRef: ElementRef) { }

  @Input('appContenteditableModel') model: any;
  @Output('appContenteditableModelChange') update = new EventEmitter();

  private lastViewModel: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['model'] && (this.lastViewModel !== this.model || changes['model'].isFirstChange())) {
      this.lastViewModel = this.model;
      this.refreshView();
    }
  }

  onBlur(): void {
    var value = this.elRef.nativeElement.innerText;
    this.lastViewModel = value;
    this.update.emit(value);
  }

  private refreshView(): void {
    this.elRef.nativeElement.innerText = this.lastViewModel;
  }

}
