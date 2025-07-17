import { ElementRef, Injectable, OnInit, QueryList, ViewChildren } from '@angular/core';

import { DomSanitizer } from '@angular/platform-browser';
import { MenuService } from '../services/menu.service';

@Injectable({
    providedIn: 'root'
})
export class Dataview implements OnInit {

    filterByValue!: { label: string; value: string; }[];
    ValidationFilter: { label: string; value: string }[] = [];//Used In CrudTable for Validation purpose along with Dataview
    sortOptions: any[] = [];
    sortKey!: string;
    sortField!: string;
    sortOrder!: number;
    constructor(private menuservice: MenuService, private sanitizer: DomSanitizer) {

    }

    ngOnInit(): void {
    }


    onSortChange(event: any) {//dataview sort by
        let value = event.value;

        if (value.indexOf('!') === 0) {
            this.sortOrder = -1;
            this.sortField = value.substring(1, value.length);
        }
        else {
            this.sortOrder = 1;
            this.sortField = value;
        }
    }

    async onImageLoad(dataViewListImage: any, path: any, fileName: any) { //Assign or load images in dataview display type
        try {
            const fullPath = path + "/" + fileName;
            const base64Image = await this.menuservice.getImage(fullPath).toPromise();
            const objectURL = 'data:image/png;base64,' + base64Image;
            //console.log("image", base64Image, objectURL);

            dataViewListImage.src = objectURL;
        } catch (error) {
            console.error("Error loading image:", error);
        }
    }

    GetColumnNames(dataArray:any)// get list of column name for Search by(filterBy) in dataview display type
    {
        if (dataArray != undefined) {
            let columnNames: string = '';
            for (var key in dataArray) {
                columnNames = dataArray[key] + "," + columnNames;
            }
            return columnNames;
        }else{
             return false
        }
        
    }

    GetFilterOptions(ColumnName:any, data:any)//get options for filter in dataview display type
    {
        var options = [];
        if (data != undefined) {
            const unique = data.map((item:any) => item[ColumnName])
                .filter((value:any, index:any, self:any) => self.indexOf(value) === index)

            for (var value in unique) {
                let option:any = {};
                option["label"] = unique[value];
                option["value"] = unique[value];
                options.push(option);
            }
        }
        console.log("options",options);
        
        return options;
    }

}
