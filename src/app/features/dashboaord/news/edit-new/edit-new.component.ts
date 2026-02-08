import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NewsService } from '../../../../core/services/news/news.service';
import { News } from '../../../../core/interfaces/news/new';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertsService } from '../../../../core/services/alerts/alerts.service';
import { environment } from '../../../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-new',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule , CommonModule],
  templateUrl: './edit-new.component.html',
  styleUrl: './edit-new.component.css'
})
export class EditNewComponent implements OnInit {
  new!: News
  englishPattern = /^[A-Za-z0-9\s"',._-]+$/;
  arabicPattern = /^[\u0600-\u06FF0-9\u0660-\u0669\s"',.،_-]+$/;
  submitted = false;

  url = environment.mediaUrl

  imgsToDelet: string[] = []
  selcetImg = false

  videoFile: File | null = null;
  imageFiles: File[] = [];

  currentId: number = 0

  editForm: FormGroup = new FormGroup({
    arTitle: new FormControl('', [Validators.required, Validators.pattern(this.arabicPattern)]),
    enTitle: new FormControl('', [Validators.required, Validators.pattern(this.englishPattern)]),
    arDescription: new FormControl('', [Validators.required, Validators.pattern(this.arabicPattern)]),
    enDescription: new FormControl('', [Validators.required, Validators.pattern(this.englishPattern)]),
    videoFile: new FormControl(null),
    imageFiles: new FormControl([]),
    ImagesToDelete: new FormControl([]),
    date: new FormControl('', Validators.required)

  });
  constructor(private _route: ActivatedRoute, private _news: NewsService, private alert: AlertsService) { }

  ngOnInit(): void {
    this.currentId = +this._route.snapshot.params['id']
    this.getAll()
  }



  getAll() {
    this._news.getNews().subscribe(res => {
      const found = res.find(n => n.id == this.currentId);

      if (found) {
        this.new = found;
      }

      this.editForm.patchValue({
        arTitle: this.new.arTitle,
        enTitle: this.new.enTitle,
        arDescription: this.new.arDescription,
        enDescription: this.new.enDescription,
        date: this.new.date,
      })
    })
  }





  submit() {

    this.submitted = true;

    this.edit()
  }

  edit() {
    const formData = new FormData()

    formData.append('arTitle', this.editForm.value.arTitle)
    formData.append('arDescription', this.editForm.value.arDescription)
    formData.append('enTitle', this.editForm.value.enTitle)
    formData.append('enDescription', this.editForm.value.enDescription)
    formData.append('date', this.editForm.value.date)


    if (this.videoFile instanceof File) {
      formData.append('videoFile', this.videoFile);
    }

    if (this.imageFiles && this.imageFiles.length > 0) {
      this.imageFiles.forEach((img) => {
        formData.append('imageFiles', img);
        formData.append('ImagesToDelete', this.new.imagePaths[0]);

      });
    }
    if (this.imgsToDelet.length > 0) {
      this.imgsToDelet.forEach((img) => {
        formData.append('ImagesToDelete', img);
      });
    }


    if (this.editForm.valid) {
      this._news.editNew(this.currentId, formData).subscribe({
        next: (res) => {
          this.alert.toaster("تمت تعديل الخدمة بنجاح", 'success')
        },
        error: () => {
          this.alert.toaster('حدث خطأ أثناء التعديل', "error");
        },
        complete:() =>{
          setTimeout(() => {
            location.reload()
          }, 1000);
        }
      })
    } else {
      if (this.editForm.get('imageFiles')?.invalid) {
        this.alert.toaster('اذا كنت ستمسح صورة يجب اضافة اخري', "error")

      } else {

        this.alert.toaster('بعض الحقول فارغة', "error")
      }

    }

  }

  // =================== ازالة الصورة ===============

  selectImgToDelete() {
    let check = this.imgsToDelet.indexOf(this.new.imagePaths[0])
    let input = this.editForm.get('imageFiles')
    if (check == -1) {
      this.selcetImg = true
      this.imgsToDelet.push(this.new.imagePaths[0])
      input?.setValidators([Validators.required])
    } else {
      this.imgsToDelet.splice(check, 1)
      this.selcetImg = false
      input?.clearValidators()
    }

    input?.updateValueAndValidity()
  }


  // ====================== اضافة الصور والفيديوهات

  onVideoSelected(event: any) {
    const file = event.target.files[0];
    this.videoFile = file || null;
  }

  onImagesSelected(event: any) {
    const files = event.target.files as FileList;
    this.imageFiles = [];

    for (let i = 0; i < files.length; i++) {
      this.imageFiles.push(files[i]);
    }
  }

}
