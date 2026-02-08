import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../../../../../core/services/projects/projects.service';
import { AlertsService } from '../../../../../core/services/alerts/alerts.service';
import { BuildingsService } from '../../../../../core/services/bulidings/buildings.service';
import { UnitService } from '../../../../../core/services/units/unit.service';
import { Project } from '../../../../../core/interfaces/project/project';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { map, pipe } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projectdetils',
  standalone: true,
  imports: [ RouterModule , CommonModule],

  templateUrl: './projectdetils.component.html',
  styleUrl: './projectdetils.component.css'
})
export class ProjectdetilsComponent implements OnInit{
  url = environment.mediaUrl
project:Project | null = null
currentId:number = 0
  constructor(private _project:ProjectsService , private alert:AlertsService , private building:BuildingsService , private units:UnitService , private _activeRoute:ActivatedRoute , private route:Router){}

  ngOnInit(): void {
    this.currentId = this._activeRoute.snapshot.params['id']
    this.getProject()
  }

  getProject(){
    this._project.getById(this.currentId).subscribe({
      next:(res) =>{
        this.project = res
        console.log(res);
        
      }
    })

    this._project.getById(this.currentId).pipe(
        map(project => ({
    ...project,
    buildings: project.buildings.map(building => ({
      ...building,
      units: [...building.units].sort((a, b) => {
        const [aChar, aNum] = a.arTitle.split('-');
        const [bChar, bNum] = b.arTitle.split('-');

        // 1️⃣ ترتيب حسب الرقم
        if (+aNum !== +bNum) {
          return +aNum - +bNum;
        }

        // 2️⃣ ترتيب أبجدي
        return aChar.localeCompare(bChar);
      })
    }))
  }))
    ).subscribe(res =>{
      console.log(res);
      
    })
  }

  async deleteProject(){
    const confirm =await this.alert.deleteConfirm({
      title:'هل أنت متأكد من حذف المشروع',
      text:"سيتم مسح البيانات نهائيا",
    })

    if(!confirm){
      return
    }

    this._project.delete(this.currentId).subscribe({
      next:(res) =>{
        this.alert.success()
      },
      complete:() =>{
        setTimeout(() => {
          this.route.navigateByUrl('/dashboard/show_projects')
        }, 1000);
      }
    })
  }
  async deleteBuilding(id:number){
    const confirm =await this.alert.deleteConfirm({
      title:'هل أنت متأكد من حذف المبنى',
      text:"سيتم مسح البيانات نهائيا",
    })

    if(!confirm){
      return
    }

    this.building.delete(id).subscribe({
      next:(res) =>{
        this.alert.success()
      },
      complete:() =>{
        setTimeout(() => {
          location.reload()
        }, 1000);
      }
    })
  }

  async deleteUnit(id:number){

    const confirm =await this.alert.deleteConfirm({
      title:'هل أنت متأكد من حذف الوحدة',
      text:"سيتم مسح البيانات نهائيا",
    })

    if(!confirm){
      return
    }

    this.units.delete(id).subscribe({
      next:(res) =>{
        this.alert.success()
      },
      complete:() =>{
        setTimeout(() => {
          location.reload()
        }, 1000);
      }
    })
  }
}
