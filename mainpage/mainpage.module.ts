import { Menu129Component } from './menu129/menu129.component';
import { Menu1449Component } from './menu1449/menu1449.component';
import { Menu1452Component } from './menu1452/menu1452.component';
// import { Menu1453Component } from './menu1453/menu1453.component';
// import { Menu1453Page } from './menu1453/menu1453.component';
import { Menu1453Component } from './menu1453/menu1453.component';
import { Menu4929Component } from './menu4929/menu4929.component';
import { Menu5917Component } from './menu5917/menu5917.component';
import { Menu1450Component } from './menu1450/menu1450.component';
import { Menu2532Component } from './menu2532/menu2532.component';
import { Menu2538Component } from './menu2538/menu2538.component';

// new menu generated for testing angular v18
import { Menu6920Page } from './menu6920/menu6920.component';
import { Menu6924Page } from './menu6924/menu6924.component';
import { Menu6926Page } from './menu6926/menu6926.component';
import { Menu6932Page } from './menu6932/menu6932.component';
import { Menu6934Page } from './menu6934/menu6934.component';
import { Menu6936Page } from './menu6936/menu6936.component';
import { Menu6937Page } from './menu6937/menu6937.component';
import { Menu6939Page } from './menu6939/menu6939.component';
import { Menu6940Page } from './menu6940/menu6940.component';
import { Menu3845Page } from './menu3845/menu3845.component';


import { FormTableSubmoduleComponent } from './form-table-submodule/form-table-submodule.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MainpageComponent } from './mainpage.component';
import { mainpageRoutes } from './mainpage.routes';
import { MenuComponent } from './menu/menu.component';
import { FieldsetModule } from 'primeng/fieldset';
import { CardModule } from 'primeng/card';
import { BreadcrumbModule } from "primeng/breadcrumb"; // Breadcrumb for menu // published from menu and subscribed in mainpage.html
import { TooltipModule } from 'primeng/tooltip';
import { PanelModule } from 'primeng/panel';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ContextMenuModule } from 'primeng/contextmenu';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ChildColumnPipe } from '../pipe/child-column.pipe';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
// import { DataView } from 'primeng/dataview';
// import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api'; // Required to trigger dialog
import { DialogModule } from 'primeng/dialog';
import { ChipModule } from 'primeng/chip';
import { BadgeModule } from 'primeng/badge';
import { SidebarModule } from 'primeng/sidebar';
import { Tag } from 'primeng/tag';
import { OrderListModule } from 'primeng/orderlist';
import { DataViewModule } from 'primeng/dataview';
import { DrawerModule } from 'primeng/drawer';
import { DatePickerModule } from 'primeng/datepicker';
import { TabsModule } from 'primeng/tabs';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { PaginatorModule } from 'primeng/paginator';
import { FileUpload } from 'primeng/fileupload';
import {MenubarModule} from 'primeng/menubar';
import {MenuItem} from 'primeng/api';
import { SplitButtonModule } from 'primeng/splitbutton';
import { Menu2535Component } from './menu2535/menu2535.component';
import { PivotTableComponent } from '../components/pivot-table/pivot-table/pivot-table.component';
import { Menu1398Component } from './menu1398/menu1398.component';
import { SkeletonModule } from 'primeng/skeleton';
import { SplitterModule } from 'primeng/splitter';
import { TreeTableModule } from 'primeng/treetable';
import { TreeModule } from 'primeng/tree';
import { CardGroupComponent } from '../components/card-group/card-group.component';
import { Menu4914Component } from './menu4914/menu4914.component';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { StepsModule } from 'primeng/steps';
import { DropdownChipComponent } from '../components/dropdown-chip/dropdown-chip/dropdown-chip.component';
// import { SelectModule } from 'primeng/select';
import { FileUploadComponent } from '../components/file-upload/file-upload.component';
import { PopoverModule } from 'primeng/popover';
// import { ImportsModule } from '../components/Imports/imports';
import { SelectModule } from 'primeng/select';
import { Menu1459Component } from './menu1459/menu1459.component';
import { TimelineModule } from 'primeng/timeline';
import { RadioButtonModule } from 'primeng/radiobutton';

@NgModule({
  declarations: [
    // UploadFile,
    ChildColumnPipe,
    MenuComponent,
    MainpageComponent,
    Menu129Component,
    Menu1398Component,
    Menu1449Component,
    Menu1450Component,
    Menu1452Component,
    Menu1453Component,
    Menu2532Component,
    Menu2538Component,
    Menu4929Component,
    Menu5917Component,
    Menu2535Component,
    Menu4914Component,
    Menu1459Component,
    Menu6920Page,
    Menu6924Page,
    Menu6926Page,
    Menu6932Page,
    Menu6934Page,
    Menu6936Page,
    Menu6937Page,
    Menu6939Page,
    Menu6940Page,
    Menu3845Page,
    FormTableSubmoduleComponent,
  ],
  imports: [
    // ImportsModule,
    RadioButtonModule,
    CommonModule,
    SelectModule,
    DropdownChipComponent,
    CardGroupComponent,
    TreeTableModule,
    SkeletonModule,
    BreadcrumbModule,
    CommonModule,
    PanelModule,
    RouterModule.forChild(mainpageRoutes),
    FieldsetModule,
    CardModule,
    TooltipModule,
    DropdownModule,
    FormsModule,
    CalendarModule,
    ButtonModule,
    InputNumberModule,
    ToastModule,
    OverlayPanelModule,
    MenuModule,
    TableModule,
    ContextMenuModule,
    TieredMenuModule,
    ProgressSpinnerModule,
    DataViewModule,
    // ConfirmDialogModule,
    ConfirmDialog,
    DialogModule,
    ChipModule,
    BadgeModule,
    SidebarModule,
    OrderListModule,
    Tag,
    DrawerModule,
    DatePickerModule,
    TabsModule,
    MultiSelectModule,
    CheckboxModule,
    PaginatorModule,
    FileUpload,
    MenubarModule,
    SplitButtonModule,
    PivotTableComponent,
    SplitterModule,
    TreeModule,
    ConfirmPopupModule,
    StepsModule,
    // SelectModule,
    FileUploadComponent,
    PopoverModule,
    TimelineModule
  ],
  providers: [MessageService,ConfirmationService],
})
export class MainpageModule { }
