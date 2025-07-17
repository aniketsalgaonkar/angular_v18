import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'childColumn'
})
export class ChildColumnPipe implements PipeTransform {

  transform(value:any){
    debugger;
    let a=value.filter((v:any)=>{
      return v.ChildColumn==false;
    })
    console.log('ChildValue:', a);
    return a ;
  }

}
