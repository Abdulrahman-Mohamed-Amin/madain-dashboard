import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../core/services/loader/loader.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent implements OnInit {
  showloader: boolean = false
  constructor(public loader: LoaderService) { }
  ngOnInit(): void {
    this.loader.loading$.subscribe(res => {
      this.showloader = res
      
    })
  }
}
