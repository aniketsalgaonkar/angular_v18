import { Component, EventEmitter, Input, Output } from '@angular/core';
// import { RuleEngine } from '../ruleEngine';
import { RuleEngine } from '../../ruleEngine';
import { ImportsModule } from '../../Imports/imports';
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [ImportsModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() cardData: any;
  @Input() showNavigate?: boolean = false;
  @Input() ruleData: any;
  @Output() navigateButtonClickedCard = new EventEmitter<void>();


  groupedCardData: any[][];
  headerText: string;
  autoplayInterval: string;
  valueKey: string[];
  sampleArray = [0, 0, 0];
  dynamicWidth: string;
  responsiveOptions: any[] | undefined;


  constructor(
    public ruleEngine: RuleEngine
  ) { }

  ngOnInit(): void {
    this.groupedCardData = this.groupCardData(this.cardData);
    this.headerText = this.cardData[0].Group;
    this.autoplayInterval = this.cardData.length <= 3 ? null : "3000";
    const firstItem = this.cardData[0];
    const keys = Object.keys(firstItem);

    // Filter keys that are not 'Attribute' or 'Group' and add to valueKey
    this.valueKey = keys.filter((key) => key !== 'Attribute' && key !== 'Group' && key !== 'ID');
    console.log(this.groupedCardData, 'card data');
    console.log(this.ruleData, "Ruledata in card!");
    console.log(this.valueKey, 'Key');
    this.calculateWidth(this.valueKey.length);

    // this.responsiveOptions = [
    //   {
    //     breakpoint: '1400px',
    //     numVisible: 2,
    //     numScroll: 1,
    //   },
    //   {
    //     breakpoint: '1199px',
    //     numVisible: 3,
    //     numScroll: 1,
    //   },
    //   {
    //     breakpoint: '767px',
    //     numVisible: 2,
    //     numScroll: 1,
    //   },
    //   {
    //     breakpoint: '575px',
    //     numVisible: 1,
    //     numScroll: 1,
    //   },
    // ];
  }

  onNavigateButtonClickCard(): void {
    this.navigateButtonClickedCard.emit();
  }

  groupCardData(array: any): any[][] {
    const result: any[][] = [];

    for (let i = 0; i < array.length; i += 3) {
      result.push(array.slice(i, i + 3));
    }

    console.log(result, "Result");
    return result;
  }

  isNumber(value: any): boolean {
    if (value) {
      // console.log(typeof(value), "valuetype");
      return !isNaN(value);
    }
    else {
      return false
    }
  }

  calculateWidth(count) {

    this.dynamicWidth = `${count * 8}rem`
  }
}
