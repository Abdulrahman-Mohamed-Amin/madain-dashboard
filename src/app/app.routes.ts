import { Routes } from '@angular/router';
import { HelloComponent } from './features/dashboaord/hello/hello.component';
import { AddProjectsComponent } from './features/dashboaord/projects-archtecture/projects/add-projects/add-projects.component';
import { ShowProjectsComponent } from './features/dashboaord/projects-archtecture/projects/show-projects/show-projects.component';
import { EditProjectsComponent } from './features/dashboaord/projects-archtecture/projects/edit-projects/edit-projects.component';
import { AddServiceComponent } from './features/dashboaord/our-services/add-service/add-service.component';
import { ShowServicesComponent } from './features/dashboaord/our-services/show-services/show-services.component';
import { EditServiceComponent } from './features/dashboaord/our-services/edit-service/edit-service.component';
import { AddNewComponent } from './features/dashboaord/news/add-new/add-new.component';
import { ShowNewsComponent } from './features/dashboaord/news/show-news/show-news.component';
import { EditNewComponent } from './features/dashboaord/news/edit-new/edit-new.component';
import { DashComponent } from './features/dashboaord/dash/dash.component';
import { LoginComponent } from './features/login/login.component';
import { authGuard } from './core/gurades/auth.guard';
import { ProjectTypeComponent } from './features/dashboaord/projects-archtecture/project-type/project-type.component';
import { ProjectStatusComponent } from './features/dashboaord/projects-archtecture/project-status/project-status.component';
import { AddBuildingComponent } from './features/dashboaord/projects-archtecture/buildings/add-building/add-building.component';
import { EditBuildingComponent } from './features/dashboaord/projects-archtecture/buildings/edit-building/edit-building.component';
import { ShowBuildingsComponent } from './features/dashboaord/projects-archtecture/buildings/show-buildings/show-buildings.component';
import { ProjectdetilsComponent } from './features/dashboaord/projects-archtecture/projects/projectdetils/projectdetils.component';
import { AddUnitComponent } from './features/dashboaord/projects-archtecture/units/add-unit/add-unit.component';
import { EditUnitComponent } from './features/dashboaord/projects-archtecture/units/edit-unit/edit-unit.component';

export const routes: Routes = [

    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },

    {
        path: "dashboard", component: DashComponent, canActivate: [authGuard], children: [
            { path: '', redirectTo: "hello", pathMatch: "full" },
            { path: 'hello', component: HelloComponent },
            { path: 'add_project', component: AddProjectsComponent },
            { path: 'show_projects', component: ShowProjectsComponent },
            { path: 'edit_project/:id', component: EditProjectsComponent },
            { path: 'project_detils/:id', component: ProjectdetilsComponent },

            { path: 'add_service', component: AddServiceComponent },
            { path: 'show_services', component: ShowServicesComponent },
            { path: 'edit_service/:id', component: EditServiceComponent },

            { path: 'add_new', component: AddNewComponent },
            { path: 'show_news', component: ShowNewsComponent },
            { path: 'edit_new/:id', component: EditNewComponent },

            { path: 'project_type', component: ProjectTypeComponent },
            { path: 'project_status', component: ProjectStatusComponent },

            { path: 'add_build/:id', component: AddBuildingComponent },
            { path: 'edit_build/:id', component: EditBuildingComponent },
            { path: 'show_buildings', component: ShowBuildingsComponent },

            { path: 'add_unit/:id', component: AddUnitComponent },
            { path:'edit_unit/:unitId/:buildingId', component: EditUnitComponent}


        ]
    },

];
