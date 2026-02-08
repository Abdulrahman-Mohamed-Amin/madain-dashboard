import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NewsService } from '../../../core/services/news/news.service';
import { OurServiceService } from '../../../core/services/our-services/our-service.service';
import { News } from '../../../core/interfaces/news/new';
import { Service } from '../../../core/interfaces/service/service';
import { ProjectsService } from '../../../core/services/projects/projects.service';


@Component({
  selector: 'app-hello',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './hello.component.html',
  styleUrl: './hello.component.css'
})
export class HelloComponent implements OnInit {
  news: News[] = []
  services: Service[] = []
  projects:any[] = []
  constructor(private _news: NewsService, private _service: OurServiceService , private _projects:ProjectsService) { }

  ngOnInit(): void {
    this.getNews()
    this.getServices()
    this.getProjects()
  }

  getNews() {
    this._news.getNews().subscribe(res => {
      this.news = res
      console.log(res);
      
    })
  }

  getServices() {
    this._service.getService().subscribe(res => {
      this.services = res
    })
  }
  getProjects() {
    this._projects.getAllProjects().subscribe(res => {
      this.projects = res
    })
  }
}
