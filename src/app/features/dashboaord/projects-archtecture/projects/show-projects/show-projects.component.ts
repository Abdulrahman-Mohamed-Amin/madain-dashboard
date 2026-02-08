
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from "@angular/router";
import { ProjectsService } from '../../../../../core/services/projects/projects.service';
import { AlertsService } from '../../../../../core/services/alerts/alerts.service';
import { Project } from '../../../../../core/interfaces/project/project';
import { CommonModule } from "@angular/common";
@Component({
  selector: 'app-show-projects',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './show-projects.component.html',
  styleUrl: './show-projects.component.css'
})
export class ShowProjectsComponent implements OnInit{

  projects:Project[] = []
  constructor(private _projets:ProjectsService , private alert:AlertsService) {}

  ngOnInit(): void {
    this.getProjects()
  }

  getProjects(){
    this._projets.getAllProjects().subscribe(res =>{
      this.projects = res
      console.log(res);
      
    })
  }
  async deleteProject(id:number , idx:number){
    const confirm = await this.alert.deleteConfirm({
      title: 'هل تريد حذف هذا العنصر؟',
      text: 'لا يمكن التراجع بعد الحذف'
    });

    if(!confirm) {
      return
    }

    this._projets.delete(id).subscribe({
      next:(res) =>{
        this.alert.success()
        this.projects.splice(idx , 1)
      }
    })
  }
}
