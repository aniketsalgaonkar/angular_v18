import { Routes } from '@angular/router';
import { MainpageComponent } from './mainpage.component';
import { MenuComponent } from './menu/menu.component';
import { Menu1449Component } from './menu1449/menu1449.component';
import { Menu1452Component } from './menu1452/menu1452.component';
import { Menu4929Component } from './menu4929/menu4929.component';
import { Menu5917Component } from './menu5917/menu5917.component';
import { Menu1450Component } from './menu1450/menu1450.component';
// import { Menu1453Component } from './menu1453/menu1453.component';
// import { Menu1453Page } from './menu1453/menu1453.component';
import { Menu1453Component } from './menu1453/menu1453.component';
import { Menu2538Component } from './menu2538/menu2538.component';
import { Menu129Component } from './menu129/menu129.component';
import { FormTableSubmoduleComponent } from './form-table-submodule/form-table-submodule.component';
import { Menu2532Component } from './menu2532/menu2532.component';
import { Menu2535Component } from './menu2535/menu2535.component';
import { Menu1398Component } from './menu1398/menu1398.component';
import { Menu4914Component } from './menu4914/menu4914.component';
import { Menu1459Component } from './menu1459/menu1459.component';

// new menu generated for testing angular v18
import { Menu6920Page } from './menu6920/menu6920.component';
import { Menu6924Page } from './menu6924/menu6924.component';
import { Menu6926Page } from "./menu6926/menu6926.component";
import { Menu6932Page } from "./menu6932/menu6932.component";
import { Menu6934Page } from './menu6934/menu6934.component';
import { Menu6936Page } from './menu6936/menu6936.component';
import { Menu6937Page } from './menu6937/menu6937.component';
import { Menu6939Page } from './menu6939/menu6939.component';
import { Menu3845Page } from './menu3845/menu3845.component';
import { Menu6940Page } from './menu6940/menu6940.component';


export const mainpageRoutes: Routes = [
  {
    path: '',
    component: MainpageComponent,
    children: [
      {
        path: '',
        component: MenuComponent
      },
      {
        path:'1449',
        component:Menu1449Component
      },
      {
        path:'1459',
        component:Menu1459Component
      },
      {
        path:'1450',
        component:Menu1450Component
      },
      {
        path:'1452',
        component:Menu1452Component
      },
      {
        path:'1453',
        component:Menu1453Component
      },
      {
        path : '1398',
        component: Menu1398Component
      },
      {
        path:'2535',
        component:Menu2535Component
      },
      {
        path:'2538',
        component:Menu2538Component
      },
      {
        path:'2532',
        component:Menu2532Component
      },
      {
        path:'4914',
        component:Menu4914Component
      },
      {
        path:'4929',
        component:Menu4929Component
      },
      {
        path:'5917',
        component:Menu5917Component
      },
      {
        path:'129',
        component:Menu129Component
      },
      {
        path:'3765',
        component:FormTableSubmoduleComponent
      },
      {
        path:'6920',
        component:Menu6920Page
      },
      {
        path:'6924',
        component:Menu6924Page
      },
      {
        path:'6926',
        component: Menu6926Page
      },
      {
        path:'6932',
        component: Menu6932Page
      },
      {
        path:'6934',
        component: Menu6934Page
      },
      {
        path:'6936',
        component: Menu6936Page
      },
      {
        path:'6937',
        component: Menu6937Page
      },
      {
        path:'6939',
        component: Menu6939Page
      },
      {
        path:'3845',
        component: Menu3845Page
      },
      {
        path:'6940',
        component: Menu6940Page
      }
    ]
  }
]; 