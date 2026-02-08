import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from "@angular/router";
import { BuildingsService } from '../../../../../core/services/bulidings/buildings.service';
import { AlertsService } from '../../../../../core/services/alerts/alerts.service';

@Component({
  selector: 'app-show-buildings',
  standalone: true,
  imports: [RouterLink , RouterModule],
  templateUrl: './show-buildings.component.html',
  styleUrl: './show-buildings.component.css'
})
export class ShowBuildingsComponent implements OnInit{
  buildings:any[] = []
  constructor(private _building:BuildingsService , private alert:AlertsService){}

  ngOnInit(): void {
    this.getBuildings()
  }
  getBuildings(){
    this._building.getBuildings().subscribe(res =>{
      console.log(res);
      
      this.buildings = res
    })
  }

 async deleteBuilding(id:number , idx:number){
  const confirm = await this.alert.deleteConfirm({
    title:"هل تريد مسح هذا العنصر !",
    text:'سيتم مسح هذا العنصر نهائيا'
  })

  if(!confirm){
    return
  }
    this._building.delete(id).subscribe({
      next:(res) =>{
        console.log(res);
        this.buildings.splice(idx , 1)
        this.alert.success()
      }
    })
  }
}
