import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from "@angular/router";
import { Project } from '../../../../../core/interfaces/project/project';
import { ProjectsService } from '../../../../../core/services/projects/projects.service';
import { AlertsService } from '../../../../../core/services/alerts/alerts.service';
import { TypeService } from '../../../../../core/services/project-type/type.service';
import { StatusService } from '../../../../../core/services/project-status/status.service';
import { environment } from '../../../../../../environments/environment';
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-edit-projects',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule , CommonModule],
  templateUrl: './edit-projects.component.html',
  styleUrl: './edit-projects.component.css'
})
export class EditProjectsComponent implements OnInit {
  submitted = false;

 project: Project | null = null;
  curuentId: number = 0

  imgUrl = environment.mediaUrl

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

  imgsTodelet:string[] = []
  selectIMg = false

  interFcaeImgDelete:string = ''

  editForm: FormGroup = new FormGroup({
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
    interfaceImageFile: new FormControl(''),
    proposalFile: new FormControl(''),
    projectCategory: new FormControl(1 , Validators.required),
    warranties: new FormControl([]),
    ImagesToDelete: new FormControl([]),

  });

  constructor(private _project: ProjectsService, private alert: AlertsService, private _route: ActivatedRoute, private _types: TypeService, private _status: StatusService) { }

  ngOnInit(): void {
    this.curuentId = +this._route.snapshot.params['id']
    this.getProject()
    this.getProjectStatus()
    this.getProjectTypes()
  }

  getProject() {
    this._project.getById(this.curuentId).subscribe(res => {
      this.project = res

      this.editForm.patchValue({
        arTitle: this.project.arTitle,
        enTitle: this.project.enTitle,
        arDescription: this.project.arDescription,
        enDescription: this.project.enDescription,
        arLocationName: this.project.arLocationName,
        enLocationName: this.project.enLocationName,
        arLocationDescription: this.project.arLocationDescription,
        enLocationDescription: this.project.enLocationDescription,
        locationUrl: this.project.locationUrl,
        isSealed: this.project.isSealed,
        surfaceArea: this.project.surfaceArea,
        groundArea: this.project.groundArea,
        latitude: this.project.latitude,
        longitude: this.project.longitude,
        buildingCount: this.project.buildingCount,
        unitsCount: this.project.unitsCount,
        projectStatusId: this.project.projectStatusId,
        projectTypeId: this.project.projectTypeId,
        projectCategory: this.project.arProjectCategory == "عماره سكنيه" ? 1 : 2,
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
    formData.append('enTitle', this.editForm.value.enTitle)
    formData.append('arDescription', this.editForm.value.arDescription)
    formData.append('enDescription', this.editForm.value.enDescription)
    formData.append('arLocationName', this.editForm.value.arLocationName)
    formData.append('enLocationName', this.editForm.value.enLocationName)
    formData.append('arLocationDescription', this.editForm.value.arLocationDescription)
    formData.append('enLocationDescription', this.editForm.value.enLocationDescription)
    formData.append('locationUrl', this.editForm.value.locationUrl)
    formData.append('isSealed', this.editForm.value.isSealed)
    formData.append('surfaceArea', this.editForm.value.surfaceArea)
    formData.append('groundArea', this.editForm.value.groundArea)
    formData.append('buildingCount', this.editForm.value.buildingCount)
    formData.append('unitsCount', this.editForm.value.unitsCount)
    formData.append('projectStatusId', this.editForm.value.projectStatusId)
    formData.append('projectTypeId', this.editForm.value.projectTypeId)
    formData.append('projectCategory', this.editForm.value.projectCategory)
    formData.append('warranties', this.editForm.value.warranties)
    formData.append('latitude', this.editForm.value.latitude)
    formData.append('longitude', this.editForm.value.longitude)

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
    if (this.imgsTodelet.length > 0) {
      this.imgsTodelet.forEach((img) => {
        formData.append('ImagesToDelete', img);
      });
    }

    if (this.editForm.valid) {
      this._project.edit(this.curuentId, formData).subscribe({
        next: (res) => {
          
          this.alert.toaster("تم تعديل المشروع بنجاح", 'success')
          this.videoFile = null;
          this.interfaceImageFile = null;
          this.proposalFile = null;
          this.imageFiles = [];
          this.submitted =false

        },
        error: () => {
          this.alert.toaster('حدث خطأ أثناء التحديث', "error");
        },
        complete:() =>{
          setTimeout(() => {
            location.reload()
          }, 1000);
        }
      })
    } else {
      this.alert.toaster( 'بعض الحقول فارغة او هناك خطا ما', "error")
    }

  }


  deletImgs(url:string){
    
    let check = this.imgsTodelet.indexOf(url)
    
    if(check == -1){

      this.imgsTodelet.push(url)
    }else{
      this.imgsTodelet.splice(check , 1)
    }

    
    
  }

  deleteInterFaceImg(){
    
    if(this.interFcaeImgDelete == ''){
      this.interFcaeImgDelete = this.project!.videoPath!
      this.selectIMg = true
    }else{
      this.interFcaeImgDelete = ''
      this.selectIMg = false

    }

    console.log(this.interFcaeImgDelete);
    
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
