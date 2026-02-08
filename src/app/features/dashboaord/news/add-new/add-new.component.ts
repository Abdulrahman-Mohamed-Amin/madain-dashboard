import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertsService } from '../../../../core/services/alerts/alerts.service';
import { OurServiceService } from '../../../../core/services/our-services/our-service.service';
import { NewsService } from '../../../../core/services/news/news.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-new',
  standalone: true,
  imports: [ReactiveFormsModule , RouterModule],
  templateUrl: './add-new.component.html',
  styleUrl: './add-new.component.css'
})
export class AddNewComponent {
  englishPattern = /^[A-Za-z0-9\s"',._-]+$/;
  arabicPattern = /^[\u0600-\u06FF0-9\u0660-\u0669\s"',.،_-]+$/;
  submitted = false;

  videoFile: File | null = null;

  imageFiles: File[] = [];

  addForm: FormGroup = new FormGroup({
    arTitle: new FormControl('', [Validators.required, Validators.pattern(this.arabicPattern)]),
    enTitle: new FormControl('', [Validators.required, Validators.pattern(this.englishPattern)]),
    arDescription: new FormControl('', [Validators.required, Validators.pattern(this.arabicPattern)]),
    enDescription: new FormControl('', [Validators.required, Validators.pattern(this.englishPattern)]),
    videoFile: new FormControl(null),
    imageFiles: new FormControl([], Validators.required),
    date: new FormControl('', Validators.required)

  });

  constructor(private alert: AlertsService, private _news: NewsService) { }

  ngOnInit(): void {
    this.getService()
  }
  getService() {

  }

  submit() {

    this.submitted = true;
    console.log(this.addForm.getRawValue());

    if (this.addForm.invalid) {
      this.alert.toaster('بعض الحقول فارغة او هناك خطأ في الادخال', "error")
      return;
    }

    this.add()
  }

  add() {
    const formData = new FormData()

    formData.append('arTitle', this.addForm.value.arTitle)
    formData.append('arDescription', this.addForm.value.arDescription)
    formData.append('enTitle', this.addForm.value.enTitle)
    formData.append('enDescription', this.addForm.value.enDescription)
    formData.append('date', this.addForm.value.date)

    if (this.videoFile instanceof File) {
      formData.append('videoFile', this.videoFile);
    }

    if (this.imageFiles && this.imageFiles.length > 0) {
      this.imageFiles.forEach((img) => {
        formData.append('imageFiles', img);
      });
    }

    if (this.addForm.valid) {
      this._news.addNew(formData).subscribe({
        next: (res) => {
          this.addForm.reset()
          this.alert.toaster("تمت اضافة الخدمة بنجاح", 'success')
        },
        error: () => {
          this.alert.toaster('حدث خطأ أثناء التحديث', "error");
        },
      })
    } else {
      this.alert.toaster('بعض الحقول فارغة', "error")
    }

  }







  // ====================== اضافة الصور والفيديوهات

  onVideoSelected(event: any) {
    const file = event.target.files[0];
    console.log(file);

    this.videoFile = file || null;
  }

  onImagesSelected(event: any) {
    const files = event.target.files as FileList;
    this.imageFiles = [];

    console.log(files);

    for (let i = 0; i < files.length; i++) {
      this.imageFiles.push(files[i]);
    }
  }

}
