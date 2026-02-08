import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertsService } from '../../../../core/services/alerts/alerts.service';
import { OurServiceService } from '../../../../core/services/our-services/our-service.service';
import { Service } from '../../../../core/interfaces/service/service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-service',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-service.component.html',
  styleUrl: './edit-service.component.css'
})
export class EditServiceComponent {
  url = environment.mediaUrl
  currntService!: Service
  currentId: number = 0

  englishPattern = /^[A-Za-z0-9\s"',._-]+$/;
  arabicPattern = /^[\u0600-\u06FF0-9\u0660-\u0669\s"',.،_-]+$/;
  submitted = false;

  imgsToDelet: string[] = []
  selcetImg = false

  videoFile: File | null = null;
  imageFiles: File[] = [];

  editForm: FormGroup = new FormGroup({
    arTitle: new FormControl('', [Validators.required, Validators.pattern(this.arabicPattern)]),
    enTitle: new FormControl('', [Validators.required, Validators.pattern(this.englishPattern)]),
    arDescription: new FormControl('', [Validators.required, Validators.pattern(this.arabicPattern)]),
    enDescription: new FormControl('', [Validators.required, Validators.pattern(this.englishPattern)]),
    videoFile: new FormControl(null),
    imageFiles: new FormControl([]),
    ImagesToDelete: new FormControl([]),
    mediaType: new FormControl(null),
  });

  constructor(private alert: AlertsService, private _service: OurServiceService, private activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.getService()
    this.currentId = +this.activeRoute.snapshot.params['id']

  }

  getService() {
    let serviceID = +this.activeRoute.snapshot.params['id']
    this._service.getService().subscribe(res => {
      console.log(res);
      
      const service = res.find(serv => serv.id === serviceID);
      if (!service) {
        return;
      }

      this.currntService = service;

      this.editForm.patchValue({
        arTitle: this.currntService.arTitle,
        enTitle: this.currntService.enTitle,
        arDescription: this.currntService.arDescription,
        enDescription: this.currntService.enDescription,
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


    if (this.videoFile instanceof File) {
      formData.append('videoFile', this.videoFile);
    }

    if (this.imageFiles && this.imageFiles.length > 0) {
      this.imageFiles.forEach((img) => {
        formData.append('imageFiles', img);
        formData.append('ImagesToDelete', this.currntService.imagePaths[0]);
        
      });
    }
    if (this.imgsToDelet.length > 0) {
      this.imgsToDelet.forEach((img) => {
        formData.append('ImagesToDelete', img);
      });
    }


    if (this.editForm.valid) {
      this._service.editService(formData, this.currentId).subscribe({
        next: (res) => {
          this.alert.toaster("تمت تعديل الخدمة بنجاح", 'success')
        },
        error: () => {
          this.alert.toaster('حدث خطأ أثناء التعديل', "error");
        }
      })
    } else {
      if(this.editForm.get('imageFiles')?.invalid){
        this.alert.toaster('اذا كنت ستمسح صورة يجب اضافة اخري', "error")

      }else{

        this.alert.toaster('بعض الحقول فارغة', "error")
      }

    }

  }

  // =================== ازالة الصورة ===============

  selectImgToDelete() {
    let check = this.imgsToDelet.indexOf(this.currntService.imagePaths[0])
    let input = this.editForm.get('imageFiles')
    if (check == -1) {
      this.selcetImg = true
      this.imgsToDelet.push(this.currntService.imagePaths[0])
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



  mediaPreviewUrl: string | null = null;
previewKind: 'image' | 'video' = 'image';

selectedImageFile: File | null = null;
selectedVideoFile: File | null = null;

onMediaSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  // clean old preview url
  if (this.mediaPreviewUrl) {
    URL.revokeObjectURL(this.mediaPreviewUrl);
    this.mediaPreviewUrl = null;
  }

  const type = this.editForm.get('mediaType')?.value;

  // ✅ يا صورة يا فيديو
  if (type === 'image') {
    this.previewKind = 'image';
    this.selectedImageFile = file;
    this.selectedVideoFile = null;

        this.imageFiles = [file];
    this.videoFile = null;
    // لو عندك form controls قديمة للفيديو/الصورة امسح التاني
    this.editForm.patchValue({ videoFile: null });
  } else {
    this.previewKind = 'video';
    this.selectedVideoFile = file;
    this.selectedImageFile = null;
        this.videoFile = file;
    this.imageFiles = [];
    this.editForm.patchValue({ imageFiles: null });
  }

  this.mediaPreviewUrl = URL.createObjectURL(file);

  // reset input value عشان لو اختار نفس الملف تاني يشتغل change
  input.value = '';
}

resetMedia() {
  if (this.mediaPreviewUrl) {
    URL.revokeObjectURL(this.mediaPreviewUrl);
    this.mediaPreviewUrl = null;
  }
  this.selectedImageFile = null;
  this.selectedVideoFile = null;

  // optional: reset form controls
  this.editForm.patchValue({ imageFiles: null, videoFile: null });

}
}