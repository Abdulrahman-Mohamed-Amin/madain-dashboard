import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';


import { MessageService } from 'primeng/api';
import { StatusService } from '../../../../../core/services/project-status/status.service';
import { TypeService } from '../../../../../core/services/project-type/type.service';
import { ProjectsService } from '../../../../../core/services/projects/projects.service';
import { AlertsService } from '../../../../../core/services/alerts/alerts.service';
import { RouterLink, RouterModule } from "@angular/router";

@Component({
  selector: 'app-add-projects',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule , RouterLink],
  providers: [],
  templateUrl: './add-projects.component.html',
  styleUrl: './add-projects.component.css'
})
export class AddProjectsComponent implements OnInit {
  submitted = false;

  englishPattern = /^[A-Za-z0-9\s"',._-]+$/;
  arabicPattern = /^[\u0600-\u06FF0-9\u0660-\u0669\s"',.،_-]+$/;

  videoFile: File | null = null;
  imageFiles: File[] = [];
  interfaceImageFile: File | null = null;
  proposalFile: File | null = null;

  uploadedFiles: any[] = [];
  imgs: any[] = []

  projectTypes: any[] = []
  projectStatus: any[] = []

  addForm: FormGroup = new FormGroup({
    arTitle: new FormControl('', [Validators.required, Validators.pattern(this.arabicPattern)]),
    enTitle: new FormControl('', [Validators.required, Validators.pattern(this.englishPattern)]),
    arDescription: new FormControl('', [Validators.required, Validators.pattern(this.arabicPattern)]),
    enDescription: new FormControl('', [Validators.required, Validators.pattern(this.englishPattern)]),
    arLocationName: new FormControl('', [Validators.required, Validators.pattern(this.arabicPattern)]),
    enLocationName: new FormControl('', [Validators.required, Validators.pattern(this.englishPattern)]),
    arLocationDescription: new FormControl('', [Validators.pattern(this.arabicPattern)]),
    enLocationDescription: new FormControl('', [Validators.pattern(this.englishPattern)]),
    locationUrl: new FormControl('', [Validators.required]),
    latitude: new FormControl(null),
    longitude: new FormControl(null),
    isSealed: new FormControl(false, Validators.required),
    surfaceArea: new FormControl('', Validators.required),
    groundArea: new FormControl('', Validators.required),
    buildingCount: new FormControl(null, Validators.required),
    unitsCount: new FormControl(null, Validators.required),
    videoFile: new FormControl(''),
    imageFiles: new FormControl([]),
    projectStatusId: new FormControl(0, Validators.required),
    projectTypeId: new FormControl(0, Validators.required),
    interfaceImageFile: new FormControl('', Validators.required),
    proposalFile: new FormControl(''),
    projectCategory: new FormControl(1),
    warranties: new FormControl([]),

  });
  
  add() {
    const formData = new FormData()

    formData.append('arTitle', this.addForm.value.arTitle)
    formData.append('enTitle', this.addForm.value.enTitle)
    formData.append('arDescription', this.addForm.value.arDescription)
    formData.append('enDescription', this.addForm.value.enDescription)
    formData.append('arLocationName', this.addForm.value.arLocationName)
    formData.append('enLocationName', this.addForm.value.enLocationName)
    formData.append('arLocationDescription', this.addForm.value.arLocationDescription)
    formData.append('enLocationDescription', this.addForm.value.enLocationDescription)
    formData.append('locationUrl', this.addForm.value.locationUrl)
    formData.append('isSealed', this.addForm.value.isSealed)
    formData.append('surfaceArea', this.addForm.value.surfaceArea)
    formData.append('groundArea', this.addForm.value.groundArea)
    formData.append('buildingCount', this.addForm.value.buildingCount)
    formData.append('unitsCount', this.addForm.value.unitsCount)
    formData.append('projectStatusId', this.addForm.value.projectStatusId)
    formData.append('projectTypeId', this.addForm.value.projectTypeId)
    formData.append('projectCategory', this.addForm.value.projectCategory)
    formData.append('warranties', this.addForm.value.warranties)

    if (this.videoFile instanceof File) {
      formData.append('videoFile', this.videoFile);
    }

    if (this.interfaceImageFile instanceof File) {
      formData.append('interfaceImageFile', this.interfaceImageFile);
    }
    if (this.proposalFile instanceof File) {
      formData.append('proposalFile', this.proposalFile);
    }

    if (this.imageFiles && this.imageFiles.length > 0) {
      this.imageFiles.forEach((img) => {
        formData.append('imageFiles', img);
      });
    }

    if (this.addForm.valid) {
      this._projects.add(formData).subscribe({
        next: (res) => {
          this.addForm.reset()
          this.alert.toaster("تمت اضافة المشروع بنجاح", 'success')
          this.videoFile = null;
          this.interfaceImageFile = null;
          this.proposalFile = null;
          this.imageFiles = [];

        },
        error: () => {
          this.alert.toaster('حدث خطأ أثناء التحديث', "error");
        },
      })
    } else {
      this.alert.toaster('بعض الحقول فارغة', "error")
    }

  }

  constructor(private _types: TypeService, private _status: StatusService, private _projects: ProjectsService, private alert: AlertsService) { }

  ngOnInit(): void {
    this.getProjectStatus()
    this.getProjectTypes()
  }

  getProjectTypes() {
    this._types.getTypes().subscribe(res => {
      this.projectTypes = res
    })
  }

  getProjectStatus() {
    this._status.getStatus().subscribe(res => {
      this.projectStatus = res
    })
  }


  submit() {

    this.submitted = true;

    if (this.addForm.invalid) {
      this.alert.toaster('بعض الحقول فارغة', "error")
      return;
    }
    this.add()
  }





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


  onInterfaceImageChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.interfaceImageFile = input.files?.[0] ?? null;
  }

  onProposalFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.proposalFile = input.files?.[0] ?? null;
  }


}
