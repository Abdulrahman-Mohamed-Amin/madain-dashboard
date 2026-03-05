import { Component, OnInit } from '@angular/core';
import { TestemonilsService } from '../../../core/services/test/testemonils.service';
import { environment } from '../../../../environments/environment';
import { FormControl, FormGroup, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-partner',
  standalone: true,
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './partner.component.html',
  styleUrl: './partner.component.css'
})
export class PartnerComponent implements OnInit {

  imgs: any[] = []
  url = environment.mediaUrl

  img: File | null = null;

  addForm: FormGroup = new FormGroup({
    id: new FormControl('1'),
    img: new FormControl(null),

  })
  constructor(private _servise: TestemonilsService) { }

  ngOnInit(): void {
    this.get()
  }

add() {
  if (!this.img) {
    console.warn("No file selected!");
    return;
  }

  const formData = new FormData();
  formData.append("id", this.addForm.value.id);
  formData.append("imageFile", this.img); // مهم: نفس اسم الحقل اللي السيرفر مستنيه

 
  formData.forEach((v, k) => console.log(k, v));

  this._servise.add(formData).subscribe({
    next: (res) => console.log(res),
    error: (err) => console.error(err),
   
  });
}


  get() {
    this._servise.get().subscribe(res => {
      this.imgs = res
    })
  }



  deleteImage(id: number) {

    this._servise.delete(id).subscribe({
      next: (res) => {

      },
      complete: () => {
        location.reload()
      }
    })
  }



onImgChange(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0] ?? null;
  this.img = file;
  this.addForm.get('img')?.setValue(file);
}
}
