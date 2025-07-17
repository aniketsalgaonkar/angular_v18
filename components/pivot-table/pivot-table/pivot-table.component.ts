import { Component, Input, OnChanges, OnInit, SimpleChanges, TrackByFunction } from "@angular/core";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';


import { MenuItem, MessageService } from "primeng/api";
import { Table } from "primeng/table";
// import { PivotAggregate, PivotDropDown, PivotView } from "src/app/Models/PivotView";
import { PivotAggregate, PivotDropDown, PivotView } from "../../../models/PivotView";
// import { MainPageService } from "src/app/Services/MainPage.service";


import { MenuService } from "../../../services/menu.service";
import { ViewChild } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import { ImportsModule } from "../../Imports/imports";
import { DropdownModule } from "primeng/dropdown";
import { BarChartDirective } from "../../../Directive/google-charts/bar-chart.directive";
import { PieChartDirective } from "../../../Directive/google-charts/pie-chart.directive";
import { ColumnChartDirective } from "../../../Directive/google-charts/column-chart.directive";
import { LineChartDirective } from "../../../Directive/google-charts/linechart.directive";

interface ChartType {
    name: string,
    code: number
}
@Component({
    selector: 'app-pivot-table',
    templateUrl: './pivot-table.component.html',
    styleUrls: ['./pivot-table.component.scss'],
    standalone: true,
    imports: [FormsModule, DialogModule, DropdownModule, ImportsModule]
})

export class PivotTableComponent implements OnChanges, OnInit {

    @Input() ModuleList: any;
    @Input() IsDefaultPivot: boolean;
    @Input() chartLayoutTemplateId?: number = 0;

    display: boolean = false;
    isSavePopUp: boolean = false;
    viewname: string;
    dropdownRowsvalue: PivotDropDown;
    dropdownColumnsValue: any;
    dropdownValuesValue: any;
    selectedRows: any;
    selectedColumn: PivotDropDown;
    selectedValue: PivotDropDown;
    selectedAggregate: PivotAggregate;
    aggregate: PivotAggregate[];
    selectedPivotViews: PivotView;
    pivotCols: any;
    products: any;
    selectedScrollableDataColumnsArray: any;
    frozenHeaders: any;
    scrollableHeaders: any;
    selectedScrollableColumnsArray: any;
    frozenWidth: any;
    isShowChart: boolean;
    show = false;
    chartTypes: ChartType[];
    selectedChartTypes: ChartType[];
    filter_data: any[];
    x: any;
    y: any;
    chartData: any;
    allColumns: any;

    @ViewChild('pv') pv: Table;
    rowGroupMetadata: {};
    sortData: any[];
    filteredIndex: any;
    originalScrollableHeaders: any[];
    indexColumn: any;
    selectedColumnMd: any;
    selectedValueMd: any;
    SelectedJSON: any;
    layoutTemplates = [
        {
            0: "p-col-12",
            1: "p-col-12",
            2: "p-col-12",
            3: "p-col-12"
        },
        {
            0: "p-col-6",
            1: "p-col-6",
            2: "p-col-6",
            3: "p-col-6"
        },
        {
            0: "p-col-6",
            1: "p-col-6",
            2: "p-col-12",
            3: "p-col-12"
        },
        {
            0: "p-col-3",
            1: "p-col-3",
            2: "p-col-3",
            3: "p-col-3",
        },
    ]
    Module: any;
    trackByFn: TrackByFunction<ChartType>;
    tableSecondaryOptions: MenuItem[];

    constructor(

        private mainpageservice: MenuService,

        private messageService: MessageService) {

        this.aggregate = [
            { name: 'Sum', code: 'sum' },
            { name: 'Count', code: 'count' },
            { name: 'Average', code: 'mean' },
            { name: 'Min', code: 'min' },
            { name: 'Max', code: 'max' }
        ];
        // this.selectedAggregate = this.aggregate[0]; // Default to 'Sum'

        this.chartTypes = [
            { name: 'Column Chart', code: 0 },
            { name: 'Line Chart', code: 1 },
            { name: 'Bar Chart', code: 2 },
            { name: 'Pie Chart', code: 3 }
        ];

        // this.selectedChartTypes = this.chartTypes; // for default showing all charts
        // Set selectedChartType to only the "Column Chart"
        this.selectedChartTypes = this.chartTypes.filter(chart => chart.code === 0); // for only column chart

    }



    ngOnChanges(changes: SimpleChanges): void {

        if (this.ModuleList != undefined) {

            this.showPivot(

                this.ModuleList.PivotColumn,

                null,

                null,

                null

            );

        }

    }



    ngOnInit(): void {
        if (this.IsDefaultPivot && this.ModuleList != undefined) {
            this.showPivot(
                this.ModuleList.PivotViews[0].FrozenColumn,
                this.ModuleList.PivotViews[0].AggregateFunction,
                this.ModuleList.PivotViews[0].PivotColumn,
                this.ModuleList.PivotViews[0].ValueColumn
            );
            this.isShowChart = true;
        }
    }


    showPivot(selectedRows, selectedAggregate?, selectedColumn?, selectedValue?) {

        this.show = true;
        this.filter_data = [];

        if (this.selectedRows != null) {

            this.selectedPivotViews = null;

        }

        const index = Array.isArray(selectedRows) ? selectedRows.map(item => item.Value).join(', ') : selectedRows;

        var moduleDetails = this.ModuleList.moduleDetails;

        this.mainpageservice.getPivot(index, selectedColumn, selectedValue, selectedAggregate, this.ModuleList.StoredProc).subscribe({

            next: (x) => {

                if (x['Error']) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: x['Error'], life: 5000 });
                    return;

                }

                var headers = Object.keys(x[0]);

                this.products = x;

                this.products.sort((a, b) => {
                    if (a.MainLocation < b.MainLocation) {
                        return -1;
                    }

                    if (a.MainLocation > b.MainLocation) {
                        return 1;
                    }

                    return 0;
                });

                this.sortData = [...this.products]

                let y = index.split(",").map(item => item.trim());

                this.x = x;
                this.y = y;

                this.selectedColumnMd = moduleDetails.find(md => md.ColumnName === selectedColumn);
                this.selectedValueMd = moduleDetails.find(md => md.ColumnName === selectedValue);
                console.log(this.selectedColumnMd, this.selectedValueMd, "selected headers")

                let selectedColumnDD = moduleDetails
                    .filter(md => md.ColumnName === selectedColumn) // Filter to find matching column
                    .map(md => ({ Text: md.ColumnHeader, Value: md.ColumnName }))[0]; // Create PivotDropDown object

                let selectedValueDD = moduleDetails
                    .filter(md => md.ColumnName === selectedValue) // Filter to find matching column
                    .map(md => ({ Text: md.ColumnHeader, Value: md.ColumnName }))[0]; // Create PivotDropDown object

                let selectedRowsDD = y
                    .map(rowIndex => {
                        const matchedRow = moduleDetails.find(md => md.ColumnName === rowIndex);
                        return matchedRow ? { Text: matchedRow.ColumnHeader, Value: matchedRow.ColumnName } : null; // Create PivotDropDown object or null
                    })
                    .filter(row => row !== null); // Filter out nulls

                let selectedAggregateDD = this.aggregate.find(ag => ag.code === selectedAggregate);

                this.PrepareSelectedJSON(selectedRowsDD, selectedColumnDD, selectedValueDD, selectedAggregateDD);


                if (this.y.length <= 5 && (selectedColumn || selectedValue)) {
                    this.isShowChart = true;
                    this.PrepareChartsData();
                }
                else {
                    this.isShowChart = false;
                }

                // Create new header with merged column
                const mergedColumnHeader = y.join('_');
                this.indexColumn = mergedColumnHeader;

                y.forEach(i => {
                    const uniqueMainLocationsMap = new Map();
                    this.products.forEach((element, index) => {
                        uniqueMainLocationsMap.set(element[i], index);
                    });

                    const uniqueMainLocationsList = Array.from(uniqueMainLocationsMap).map(([name, index]) => ({ name, index }));

                    this.filter_data.push(uniqueMainLocationsList.sort((a, b) => {
                        const nameA = String(a.name);
                        const nameB = String(b.name);
                        return nameA.localeCompare(nameB);
                    }));

                });


                this.frozenHeaders = [];
                this.scrollableHeaders = [];
                this.allColumns = [];

                headers.forEach(item => {

                    const matchingDetail = moduleDetails.find(detail => detail.ColumnName === item);

                    if (y.includes(item)) {

                        var headerMap = matchingDetail ? ({ field: item, header: matchingDetail.ColumnHeader, dataType: matchingDetail.DataType, frozenCols: true }) : ({ field: item, header: item, dataType: 'decimal', frozenCols: true });

                        this.frozenHeaders.push(headerMap);

                    }

                    else {

                        var headerMap = matchingDetail ? ({ field: item, header: matchingDetail.ColumnHeader, dataType: matchingDetail.DataType, frozenCols: false }) : ({ field: item, header: item, dataType: 'decimal', frozenCols: false });

                        this.scrollableHeaders.push(headerMap);

                    }

                });


                this.allColumns = [...this.frozenHeaders, ...this.scrollableHeaders];

                this.selectedScrollableColumnsArray = this.scrollableHeaders;



                if (this.frozenHeaders.length > 5) {

                    var width = (window.innerWidth * 0.5);

                    this.frozenWidth = width + "px";

                    let frozenHead = this.frozenHeaders;

                    this.frozenHeaders = [];

                    let scrollableHead = this.scrollableHeaders;

                    this.scrollableHeaders = [];

                    for (let i = 0; i < frozenHead.length; i++) {

                        if (i < 5)

                            this.frozenHeaders.push(frozenHead[i]);

                        else

                            this.scrollableHeaders.push(frozenHead[i]);

                    }

                    this.scrollableHeaders.push(...scrollableHead);

                }

                else {

                    var width = (window.innerWidth * this.frozenHeaders.length * 0.1);

                    this.frozenWidth = width + "px";

                }
                // Create a constant copy of scrollableHeaders to preserve the original order
                this.originalScrollableHeaders = [...this.scrollableHeaders];
            },

            error: (error) => {

                this.messageService.add({ severity: 'error', summary: 'Error', detail: error, life: 5000 });

            },

            complete: () => {

                this.show = false;
                this.ModuleList.ChartConfiguration.HAxisTitle = this.selectedColumnMd?.ColumnHeader;

                this.ModuleList.ChartConfiguration.VAxisTitle = this.selectedValueMd?.ColumnHeader;

                (this.ModuleList.ChartConfiguration);

            }

        });

    }
    isNumber(value: any): boolean {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }


    saveView(viewname) {

        var index = this.selectedRows.map(item => item.Value).join(', ')

        var pivotView: PivotView = {

            ViewName: viewname,

            ModuleId: this.ModuleList.ID,

            FrozenColumn: index,

            PivotColumn: this.selectedColumn ? this.selectedColumn.Value : null,

            ValueColumn: this.selectedValue ? this.selectedValue.Value : null,

            AggregateFunction: this.selectedAggregate ? this.selectedAggregate.code : 'sum',

            Type: 'User Define',

            UserName: 'Admin',

            CreationDate: new Date(),

            Active: true

        };



        this.ModuleList.PivotViews.push(pivotView);



        this.mainpageservice.saveViewName(pivotView).subscribe({

            next: (response) => {

                this.isSavePopUp = false;

            },

            error: (error) => {

                (error);

                this.isSavePopUp = false;

            }

        })

    }



    onRowChange(selectedRows) {

        // Call PrepareSelectedJSON with current selected rows, column, and value
        this.PrepareSelectedJSON(selectedRows, this.selectedColumn, this.selectedValue, this.selectedAggregate);

        let yTexts = selectedRows.map(item => item.Text);

        this.dropdownColumnsValue = this.ModuleList.FrozenColumn.filter(item => !yTexts.includes(item.Text));

        this.dropdownValuesValue = this.ModuleList.FrozenColumn.filter(item => !yTexts.includes(item.Text));

    }

    onColumnChange(selectedColumn) {

        let x: PivotDropDown[] = [];

        if (selectedColumn != null && selectedColumn != undefined) {
            // Call PrepareSelectedJSON with current selected rows, column, and value
            this.PrepareSelectedJSON(this.selectedRows, selectedColumn, this.selectedValue, this.selectedAggregate);

            x.push(selectedColumn);
            let zText = selectedColumn.Text

            // (this.dropdownValuesValue, "6");

            this.dropdownValuesValue = this.dropdownValuesValue.filter(item => !zText.includes(item.Text));

        }

        if (this.selectedValue != undefined) {

            x.push(this.selectedValue);

        }

        let yTexts = x.map(item => item.Text);

        this.dropdownRowsvalue = this.ModuleList.FrozenColumn.filter(item => !yTexts.includes(item.Text));

    }


    onValueChange(selectedValue) {

        let x: PivotDropDown[] = [];

        if (selectedValue != null) {
            // Call PrepareSelectedJSON with current selected rows, column, and value
            this.PrepareSelectedJSON(this.selectedRows, this.selectedColumn, selectedValue, this.selectedAggregate);


            x.push(selectedValue);

            let zText = selectedValue.Text

            this.dropdownColumnsValue = this.dropdownColumnsValue.filter(item => !zText.includes(item.Text));

        }

        if (this.selectedColumn != undefined)

            x.push(this.selectedColumn);

        let yTexts = x.map(item => item.Text);

        this.dropdownRowsvalue = this.ModuleList.FrozenColumn.filter(item => !yTexts.includes(item.Text));

    }
    onAggregateChange(selectedAggregate) {
        // Call PrepareSelectedJSON with current selected rows, column, and value
        this.PrepareSelectedJSON(this.selectedRows, this.selectedColumn, this.selectedValue, selectedAggregate);
    }



    public calculateVisiblePrimengTotal(col: string, pv: Table): number {

        let columnName = col;

        let total = 0;

        const data = pv.filteredValue || pv.value;

        const first = pv.first || 0;

        const rows = pv.rows || 10;

        const last = first + rows;



        for (let i = first; i < Math.min(last, data.length); i++) {

            total += parseFloat(data[i][columnName]);

        }



        return total;

    }



    showSavePopUp() {
        if (this.selectedRows) {
            this.isSavePopUp = true;
        }

    }

    getFilteredIndex(col) {

        this.filteredIndex = this.allColumns.indexOf(col);
        console.log(this.filteredIndex, col, "Current Filter Index");
    }

    loggin(value, pv) {

        console.log(value, "Arthur");

        let frozenColsToKeep = this.frozenHeaders.map(item => item.field);
        let scrollableColsToKeep = this.scrollableHeaders.map(item => item.field);
        // Combine the fields to keep into a single array
        let combinedFieldsToKeep = [...frozenColsToKeep, ...scrollableColsToKeep];
        let fieldsToKeep = Array.from(new Set(combinedFieldsToKeep));

        // Get the data to modify
        let y = pv.filteredValue || pv._value;

        let columnsMatching = this.compareArrays(Object.keys(y[0]), fieldsToKeep)
        console.log("Columns matching: ", columnsMatching)
        if (!columnsMatching) {
            // Filter each object to keep only the specified fields
            y = y.map(obj => {
                let filteredObj: any = {};
                fieldsToKeep.forEach(field => {
                    if (field in obj) {
                        filteredObj[field] = obj[field];
                    }
                });
                return filteredObj;
            });

            // Update this.x with the modified array
            this.x = [...y];
        }

        if (this.isShowChart) {
            this.PrepareChartsData();
        }

    }



    hello(pv) {

        console.log("Sandeep", pv);

        for (let prop in pv.filters) {

            if (pv.filters[prop].value !== null) {

                pv.filters[prop].value = null;

            }
        }

    }



    modelChangeScrollable(event, pv) {

        console.log(event, pv, "1");

        console.log(this.scrollableHeaders, "Before")
        let selectedValues = event;
        let unselectedOptions = this.selectedScrollableColumnsArray.filter(option => !selectedValues.includes(option));
        this.scrollableHeaders = this.originalScrollableHeaders.filter(option => !unselectedOptions.includes(option));
        console.log(this.scrollableHeaders, "After");

        // Create a deep copy of the pv.filteredValue or pv._value
        let y = JSON.parse(JSON.stringify(pv.filteredValue || pv._value));

        // Remove fields based on unselectedOptions
        let fieldsToRemove = unselectedOptions.map(item => item.field);
        y.forEach(obj => {
            fieldsToRemove.forEach(field => {
                delete obj[field];
            });
        });

        // this.y = y;
        this.x = [...y];
        if (this.isShowChart) {
            this.PrepareChartsData();
        }
    }

    updateRowGroupMetaData(data, groupByColumnName, sortColumnName) {

        //alert();

        this.rowGroupMetadata = {};

        if (data) {

            let groupIndex = 1;

            for (let i = 0; i < data.length; i++) {

                let rowData = data[i];

                let sortColumnValue = rowData[sortColumnName];

                let groupbyColumnValue = rowData[groupByColumnName];

                //this.rowGroupMetadata[sortColumnValue]={};

                if (i == 0) {

                    this.rowGroupMetadata[groupbyColumnValue] = {};

                    this.rowGroupMetadata[groupbyColumnValue][sortColumnValue] = { index: 0, size: 1, GroupIndex: groupIndex };

                }

                else {

                    let previousRowData = data[i - 1];

                    let previousRowGroup = previousRowData[groupByColumnName];

                    if (groupbyColumnValue === previousRowGroup) {

                        if (rowData[sortColumnName] == previousRowData[sortColumnName]) {

                            this.rowGroupMetadata[groupbyColumnValue][sortColumnValue].size++;

                        }

                        else {

                            groupIndex++;

                            this.rowGroupMetadata[groupbyColumnValue][sortColumnValue] = { index: i, size: 1, GroupIndex: groupIndex };

                        }

                    }

                    else {

                        if (!this.rowGroupMetadata.hasOwnProperty(groupbyColumnValue)) {

                            this.rowGroupMetadata[groupbyColumnValue] = {};

                        }

                        groupIndex++;

                        this.rowGroupMetadata[groupbyColumnValue][sortColumnValue] = { index: i, size: 1, GroupIndex: groupIndex };

                    }

                }

            }

        }

        console.log(this.rowGroupMetadata, 'Sandeep');

    }



    updateRowGroupMetaDataSingle(data, groupByColumnName) {//table with row grouping

        this.rowGroupMetadata = {};



        data.sort((a, b) => {

            if (a.MainLocation < b.MainLocation) {

                return -1;

            }

            if (a.MainLocation > b.MainLocation) {

                return 1;

            }

            return 0;

        });



        console.log(data);

        debugger;

        if (data) {

            for (let i = 0; i < data.length; i++) {

                let rowData = data[i];

                let groupByColumnName_value = rowData[groupByColumnName];



                if (i == 0) {

                    this.rowGroupMetadata[groupByColumnName_value] = { index: 0, size: 1 };

                }

                else {

                    let previousRowData = data[i - 1];

                    let previousRowGroup = previousRowData[groupByColumnName];

                    if (groupByColumnName_value === previousRowGroup)

                        this.rowGroupMetadata[groupByColumnName_value].size++;

                    else {

                        if (!this.rowGroupMetadata.hasOwnProperty(groupByColumnName_value)) {

                            this.rowGroupMetadata[groupByColumnName_value] = {};

                            this.rowGroupMetadata[groupByColumnName_value] = { index: i, size: 1 };

                        } else {



                            this.rowGroupMetadata[groupByColumnName_value].size++;

                        }

                    }

                }

            }

        }

        console.log("rowGroupMetadata", this.rowGroupMetadata);

    }



    onSort(data, groupByColumnName) {

        //this.updateRowGroupMetaDataSingle(data, groupByColumnName);

    }



    data1(city) {

        //console.log(Object.keys(this.rowGroupMetadata[city]).length, city)

        return Object.keys(this.rowGroupMetadata[city]).length;

    }



    data2(city) {

        //console.log(Object.keys(this.rowGroupMetadata).indexOf(city), city)

        return Object.keys(this.rowGroupMetadata).indexOf(city);

    }
    exportExcel(data: any[], fileName: string): void {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, fileName);
    }


    // saveAsExcelFile(buffer: any, fileName: string): void {  // added to download primeng table in excel format
    //     var FileSaver = require('file-saver');
    //     let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    //     let EXCEL_EXTENSION = '.xlsx';
    //     const data: Blob = new Blob([buffer], {
    //         type: EXCEL_TYPE
    //     });
    //     FileSaver.saveAs(data, this.ModuleList.ModuleName + EXCEL_EXTENSION);
    // }
    saveAsExcelFile(buffer: any, fileName: string): void {
        const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
        FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
    }


    // Function to rearrange columns
    sortColumns(columns: string[], prioritized: string[]): string[] {
        // Create a new array with prioritized columns
        const sortedColumns = prioritized.filter(column => columns.includes(column));

        // Add the remaining columns that are not in the prioritized list
        const remainingColumns = columns.filter(column => !prioritized.includes(column));

        return [...sortedColumns, ...remainingColumns];
    }

    // Helper function to compare two arrays
    compareArrays(arr1: string[], arr2: string[]): boolean {
        if (arr1.length !== arr2.length) return false;
        return arr1.every(item => arr2.includes(item)) && arr2.every(item => arr1.includes(item));
    }

    PrepareChartsData() {
        let columnNames = Object.keys(this.x[0]);

        // Create new header with merged column
        const mergedColumnHeader = this.y.join('_');
        this.indexColumn = mergedColumnHeader;

        // Update data rows by concatenating values of the selected columns into JSON format
        const newData = this.x.map(row => {
            // Merge the values from the selected columns
            const mergedValue = this.y.map(col => row[col]).join('_');

            // Collect remaining columns that are not being merged
            const remainingValues = {};
            columnNames
                .filter(col => !this.y.includes(col))
                .forEach(col => {
                    remainingValues[col] = row[col];
                });

            // Return an object where the key is the new merged column name and remaining columns
            return {
                [mergedColumnHeader]: mergedValue,
                ...remainingValues
            };
        });
        this.chartData = newData;

    }

    PrepareSelectedJSON(selectedRows, selectedColumn, selectedValue, selectedAggregate) {
        let selectedJSON = {};

        // Add Rows if present
        if (selectedRows && selectedRows.length > 0) {
            selectedJSON["Rows"] = selectedRows.map(item => item.Text).join(', ');
        }

        // Add Pivot Column if present
        if (selectedColumn) {
            selectedJSON["Pivot Column"] = selectedColumn.Text;
        }

        // Add Value if present
        if (selectedValue) {
            selectedJSON["Value"] = selectedValue.Text;
        }

        // Add Value if present
        if (selectedAggregate) {
            selectedJSON["Aggregate Function"] = selectedAggregate.name;
        }
        // Update SelectedJSON array with the constructed object
        this.SelectedJSON = selectedJSON;
    }

    formatJSONWithColor(json: any): string {
        // console.log(json, "SelectedJSON");

        let parsedData = json;
        const formattedParts: string[] = [];
        for (const key in parsedData) {
            if (parsedData.hasOwnProperty(key)) {
                const value = parsedData[key];

                // Format the key and value with HTML styles
                let formattedKey = `<span class="json-key">${key}:</span>`;
                let formattedValue = `<span class="json-value">${value}</span>`;

                formattedParts.push(`${formattedKey} ${formattedValue}`);
            }
        }
        return formattedParts.join(', '); // Join the parts with commas
    }

    getChartClass(index: number, size: number): string {
        // Every chart has half-width (50%) to show 2 charts per row
        let widthClass = index % 2 === 0 && index === size - 1 ? 'full-width' : 'half-width';
        console.log(index, size, widthClass, "index and size")
        return 'full-width';
    }

    getChartLayoutFromTemplate(chartCode) {
        return this.layoutTemplates[this.chartLayoutTemplateId][chartCode];
    }


}