import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertsService } from '../../../../../core/services/alerts/alerts.service';
import { UnitService } from '../../../../../core/services/units/unit.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Unit } from '../../../../../core/interfaces/project/project';

@Component({
  selector: 'app-edit-unit',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './edit-unit.component.html',
  styleUrl: './edit-unit.component.css'
})
export class EditUnitComponent {

  englishPattern = /^[A-Za-z0-9\s"',._-]+$/;
  arabicPattern = /^[\u0600-\u06FF0-9\u0660-\u0669\s"',.،_-]+$/;
  submitted = false;

  videoFile: File | null = null;

  imageFiles: File[] = [];
  currentId: number = 0
  buildingId:number = 0

  unit: Unit | null = null

  editForm: FormGroup = new FormGroup({
    arTitle: new FormControl('', [Validators.required]),
    enTitle: new FormControl(''),
    arDescription: new FormControl('', [Validators.required, Validators.pattern(this.arabicPattern)]),
    enDescription: new FormControl('', [Validators.required, Validators.pattern(this.englishPattern)]),
    price: new FormControl('', Validators.required),
    floor: new FormControl(null, Validators.required),
    area: new FormControl('', Validators.required),
    isSealed: new FormControl(false),
    buildingId: new FormControl(this.buildingId),
    imageFiles: new FormControl([]),
  });

  constructor(private alert: AlertsService, private _unit: UnitService, private _route: ActivatedRoute) { }

  ngOnInit(): void {
     
   this.buildingId = this._route.snapshot.params['buildingId'];
  const unitIdParam = this._route.snapshot.paramMap.get('unitId');

  console.log(this.buildingId);
  
  if (!unitIdParam) {
    return;
  }

  this.currentId = Number(unitIdParam);


    this.getUnit()

  }

  submit() {
    console.log(this.editForm.getRawValue());
    
    this.submitted = true;
    this.edit()
  }

  getUnit() {
    this._unit.getById(this.currentId).subscribe(res => {
      
      this.unit = res
      
      this.editForm.patchValue({
        arTitle: this.unit.arTitle,
        enTitle: this.unit.enTitle,
        arDescription: this.unit.arDescription,
        enDescription: this.unit.enTitle,
        price:this.unit.price ,
        floor: this.unit.floor,
        area: this.unit.area,
        isSealed: this.unit.isSealed,
        buildingId: this.buildingId ,
      })
    })
  }
  edit() {
    const formData = new FormData()

    formData.append('arTitle', this.editForm.value.arTitle)
    formData.append('arDescription', this.editForm.value.arDescription)
    formData.append('enTitle', this.editForm.value.enTitle)
    formData.append('enDescription', this.editForm.value.enDescription)
    formData.append('price', this.editForm.value.price)
    formData.append('floor', this.editForm.value.floor)
    formData.append('area', this.editForm.value.area)
    formData.append('isSealed', this.editForm.value.isSealed)
    formData.append('buildingId', `${this.currentId}`)


    if (this.imageFiles && this.imageFiles.length > 0) {
      this.imageFiles.forEach((img) => {
        formData.append('imageFiles', img);
      });
    }

    if (this.editForm.valid) {
      this._unit.edit(this.currentId , formData).subscribe({
        next: (res) => {
          this.submitted = false
          this.alert.toaster("تم تعديل الوحدة بنجاح", 'success')
        },
        error: () => {
          this.alert.toaster('حدث خطأ أثناء التحديث', "error");
        },
        complete: () => {
          // window.location.reload()
        }
      })
    } else {
      this.alert.toaster('بعض الحقول فارغة او هناك خطا ما', "error")
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
