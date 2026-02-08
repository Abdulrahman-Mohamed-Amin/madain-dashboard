import { Component, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { News } from '../../../../core/interfaces/news/new';
import { NewsService } from '../../../../core/services/news/news.service';
import { AlertsService } from '../../../../core/services/alerts/alerts.service';

@Component({
  selector: 'app-show-news',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './show-news.component.html',
  styleUrl: './show-news.component.css'
})
export class ShowNewsComponent implements OnInit {
  news: News[] = []
  constructor(private _news: NewsService, private alert: AlertsService) { }

  ngOnInit(): void {
    console.log("dfdf");
    this.getNews()

  }

  getNews() {
    this._news.getNews().subscribe(res => {
      this.news = res
      console.log(res);

    })
  }

  async delete(id: number, idx: number) {
    const confirmed = await this.alert.deleteConfirm({
      title: 'هل تريد حذف هذا العنصر؟',
      text: 'لا يمكن التراجع بعد الحذف'
    });

    if (!confirmed) return;

    this._news.deleteNew(id).subscribe({
      next: (res) => {
        this.alert.success('تم الحذف بنجاح')
        this.news.splice(idx , 1)
      }
    })
  }
}
