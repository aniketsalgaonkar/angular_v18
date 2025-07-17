import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardComponent } from '../card/card/card.component';
import { ImportsModule } from '../Imports/imports';

@Component({
  selector: 'app-card-group',
  standalone: true,
  imports: [CardComponent,ImportsModule],
  templateUrl: './card-group.component.html',
  styleUrls: ['./card-group.component.scss']
})
export class CardGroupComponent {
  // Input properties to receive data from the parent component
  @Input() cardGroupData: any;
  @Input() ruleData: any;
  @Output() navigateButtonClickedCardGroup = new EventEmitter<void>();

  cardGroupDataByGroup: any;
  showNav: boolean;
  fadeOutTimeout: any;
  
  
  constructor() {}

  ngOnInit(): void {
    this.groupCardGroupDataByGroup(this.cardGroupData);
    this.showNav = this.cardGroupDataByGroup.length <= 5 ? false : true;
    this.startFadeOutTimer();

  }

  ngAfterViewInit() {
    this.startFadeOutTimer();
  }

  onNavigateButtonClickCardGroup(): void {
    this.navigateButtonClickedCardGroup.emit();
  }

  groupCardGroupDataByGroup(array: any[]) {
    const groupedObject = array.reduce((acc, obj) => {
      const key = obj.Group;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
    }, {} as { [key: string]: any[] });

    this.cardGroupDataByGroup = Object.values(groupedObject);
    console.log(this.cardGroupDataByGroup, "cardGroupData");
  }

  showNavButtons() {
    clearTimeout(this.fadeOutTimeout);
    const buttons = document.querySelectorAll('.scroll-button');
    buttons.forEach(button => {
      (button as HTMLElement).style.opacity = '1';
    });
  }

  startFadeOutTimer() {
    this.fadeOutTimeout = setTimeout(() => {
      const buttons = document.querySelectorAll('.scroll-button');
      buttons.forEach(button => {
        (button as HTMLElement).style.opacity = '0';
      });
    }, 6000); // 1 minute
  }

  scrollLeft(cardContainer: HTMLElement) {
    cardContainer.scrollBy({ left: -200, behavior: 'smooth' }); // Adjust scroll amount as needed
  }

  scrollRight(cardContainer: HTMLElement) {
    cardContainer.scrollBy({ left: 200, behavior: 'smooth' }); // Adjust scroll amount as needed
  }

}
