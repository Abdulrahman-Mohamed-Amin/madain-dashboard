import { Component, OnInit } from '@angular/core';
import { OurServiceService } from '../../../../core/services/our-services/our-service.service';
import { Service } from '../../../../core/interfaces/service/service';
import { AlertsService } from '../../../../core/services/alerts/alerts.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-show-services',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './show-services.component.html',
  styleUrl: './show-services.component.css'
})
export class ShowServicesComponent implements OnInit{

  services:Service[] = []

  constructor(private _service:OurServiceService , private alert:AlertsService){}

  ngOnInit(): void {
    this._service.getService().subscribe(res =>{
      this.services = res
    })
  }

  async deleteService(id: number, idx: number) {

    const confirmed = await this.alert.deleteConfirm({
      title: 'هل تريد حذف هذا العنصر؟',
      text: 'لا يمكن التراجع بعد الحذف'
    });

    if (!confirmed) return;
    this._service.deeletService(id).subscribe({
      next:(res) =>{
        this.alert.success()
        this.services.splice(idx , 1)
      }
    })

  }
}
