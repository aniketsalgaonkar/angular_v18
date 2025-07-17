// import { Injectable } from '@angular/core';
// import { MainPageService } from '../../services/MainPage.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class TableModuleService {

//   constructor(private mainpageservice: MainPageService) { }

//   async setupTableModule(params: {
//     module: ModuleDefinition;
//     dtIndex: number;
//     moduleIndex: number;
//     appId: number;
//     filterData: any;
//     userName: string;
//     menuId: number;
//   }): Promise<{
//     frozenCols: any[],
//     scrollableCols: any[],
//     tableData: any[],
//     totalRecords: number
//   }> {
//     const { module, dtIndex, moduleIndex, appId, filterData, userName, menuId } = params;

//     const frozenCols = [];
//     const scrollableCols = [];
//     const filterCols = [];

//     if (module.moduleDetails) {
//       module.moduleDetails.forEach(col => {
//         if (col.InputControls !== 'HiddenField') {
//           if (col.FrozenCols) frozenCols.push(col);
//           else scrollableCols.push(col);
//           filterCols.push(col.ColumnName);
//         }
//       });
//     }

//     const data = await this.mainpageservice
//       .populateModuleData(module.ID, menuId, userName, filterData, module.StoredProc, 2, module.NotificationParameterList.length)
//       .toPromise();

//     const moduleData = data["moduleData"];
//     const moduleWiseTiles = data["moduleWiseTiles"];

//     // Convert date fields
//     const dateCols = module.moduleDetails.filter(md => md.DataType.includes('date') || md.DataType.includes('time'));
//     moduleData.forEach(d => {
//       dateCols.forEach(dc => {
//         if (d[dc.ColumnName]) d[dc.ColumnName] = new Date(d[dc.ColumnName]);
//       });
//     });

//     const tableData = moduleData.slice(0, module.Rows);

//     return {
//       frozenCols,
//       scrollableCols,
//       tableData,
//       totalRecords: moduleData.length
//     };
//   }
// }
