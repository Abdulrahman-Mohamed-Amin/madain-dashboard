import { Component } from '@angular/core';
import { AlertsService } from '../../../../../core/services/alerts/alerts.service';
import { BuildingsService } from '../../../../../core/services/bulidings/buildings.service';
import { ProjectsService } from '../../../../../core/services/projects/projects.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Project } from '../../../../../core/interfaces/project/project';
import { ActivatedRoute } from '@angular/router';
import { Build } from '../../../../../core/interfaces/building/build';

@Component({
  selector: 'app-edit-building',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-building.component.html',
  styleUrl: './edit-building.component.css'
})
export class EditBuildingComponent {

  englishPattern = /^[A-Za-z0-9\s"',._-]+$/;
  arabicPattern = /^[\u0600-\u06FF0-9\u0660-\u0669\s"',.،_-]+$/;
  submitted = false;
  currentId: number = 0

  videoFile: File | null = null;
  imageFiles: File[] = [];

  projects: Project[] = []
  building: Build | null = null

  editForm: FormGroup = new FormGroup({
    arTitle: new FormControl('', [Validators.required, Validators.pattern(this.arabicPattern)]),
    enTitle: new FormControl('', [Validators.required, Validators.pattern(this.englishPattern)]),
    arDescription: new FormControl('', [Validators.required, Validators.pattern(this.arabicPattern)]),
    enDescription: new FormControl('', [Validators.required, Validators.pattern(this.englishPattern)]),
    projectId: new FormControl(null, Validators.required),
    imageFiles: new FormControl([]),
    units: new FormControl(null),
  });

  constructor(private alert: AlertsService, private _build: BuildingsService, private _projects: ProjectsService, private _route: ActivatedRoute) { }

  ngOnInit(): void {
    this.currentId = this._route.snapshot.params['id']
    this.getProjects()
    this.getBuilding()
  }

  getBuilding() {
    this._build.getById(this.currentId).subscribe(res => {
      this.building = res
      console.log(res);

      this.editForm.patchValue({
        arTitle: res.arTitle,
        enTitle: res.enTitle,
        arDescription: res.arDescription,
        enDescription: res.enDescription,
        projectId: res.projectId,
      })
    })
  }
  getProjects() {
    this._projects.getAllProjects().subscribe(res => {
      this.projects = res
    })
  }

  submit() {

    console.log('FORM:', this.editForm.getRawValue());


    this.submitted = true;

    if (this.editForm.invalid) {
      this.alert.toaster('بعض الحقول فارغة او هناك خطأ في الادخال', "error")
      return;
    }

    this.edit()
  }

  edit() {
    const formData = new FormData()

    formData.append('arTitle', this.editForm.value.arTitle)
    formData.append('arDescription', this.editForm.value.arDescription)
    formData.append('enTitle', this.editForm.value.enTitle)
    formData.append('enDescription', this.editForm.value.enDescription)
    formData.append('projectId', this.editForm.value.projectId)

    if (this.imageFiles && this.imageFiles.length > 0) {
      this.imageFiles.forEach((img) => {
        formData.append('imageFiles', img);
      });
    }

    if (this.editForm.valid) {
      console.log(this.editForm.value);

      this._build.edit(this.currentId, formData).subscribe({
        next: (res) => {
          this.alert.toaster("تم تعديل المبنى بنجاح", 'success')
        },
        error: () => {
          this.alert.toaster('حدث خطأ أثناء التحديث', "error");
        },
        complete: () => {
          // window.location.reload()
        }
      })
    } else {
      this.alert.toaster('بعض الحقول فارغة او خاطئة', "error")
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
