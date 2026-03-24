import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertsService } from '../../../../../core/services/alerts/alerts.service';
import { OurServiceService } from '../../../../../core/services/our-services/our-service.service';
import { UnitService } from '../../../../../core/services/units/unit.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BuildingsService } from '../../../../../core/services/bulidings/buildings.service';

@Component({
  selector: 'app-add-unit',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './add-unit.component.html',
  styleUrl: './add-unit.component.css'
})
export class AddUnitComponent {

  englishPattern = /^[A-Za-z0-9\s"',._-]+$/;
  arabicPattern = /^[\u0600-\u06FF0-9\u0660-\u0669\s"',.،_-]+$/;
  submitted = false;

  videoFile: File | null = null;

  imageFiles: File[] = [];
  currentId: number = 0
  projectId:number = 0
  isSold: boolean = false

  addForm: FormGroup = new FormGroup({
    arTitle: new FormControl('', [Validators.required]),
    enTitle: new FormControl(null, Validators.required),
    arDescription: new FormControl(null, [Validators.required]),
    enDescription: new FormControl(null),
    price: new FormControl('', Validators.required),
    floor: new FormControl(null, Validators.required),
    area: new FormControl('', Validators.required),
    isSealed: new FormControl(false),
    buildingId: new FormControl(this.currentId),
    imageFiles: new FormControl([]),
  });

  constructor(private alert: AlertsService, private _unit: UnitService, private _route: ActivatedRoute, private _building: BuildingsService) { }

  ngOnInit(): void {
    this.currentId = +this._route.snapshot.params['id']
    this.getBuilding()
  }
  getSaleText(isSold: boolean | null | undefined): string {
    return isSold ? 'مباعة' : 'غير مباعة';
  }

  getBuilding() {
    this._building.getById(this.currentId).subscribe(res =>{
      this.projectId = res.projectId
    })
  }
  submit() {

    console.log(this.addForm.getRawValue());


    this.submitted = true;


    this.add()
  }

  add() {
    const formData = new FormData()

    formData.append('arTitle', this.addForm.value.arTitle)
    formData.append('arDescription', this.addForm.value.arDescription)
    formData.append('enTitle', this.addForm.value.enTitle)
    formData.append('enDescription', this.addForm.value.enDescription)
    formData.append('price', this.addForm.value.price)
    formData.append('floor', this.addForm.value.floor)
    formData.append('area', this.addForm.value.area)
    formData.append('isSealed', this.addForm.value.isSealed)
    formData.append('buildingId', `${this.currentId}`)



    if (this.imageFiles && this.imageFiles.length > 0) {
      this.imageFiles.forEach((img) => {
        formData.append('imageFiles', img);
      });
    }

    if (this.addForm.valid) {
      this._unit.add(formData).subscribe({
        next: (res) => {
          this.submitted = false
          this.addForm.reset()
          console.log(this.addForm.getRawValue());
          
          this.alert.toaster("تمت اضافة الوحدة بنجاح", 'success')
        },
        error: () => {
          this.alert.toaster('حدث خطأ أثناء التحديث', "error");
        },
        complete: () => {
        setTimeout(() => {
            window.location.reload()
        }, 1000);
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
