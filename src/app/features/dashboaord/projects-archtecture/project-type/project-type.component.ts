import { Component } from '@angular/core';
import { TypeService } from '../../../../core/services/project-type/type.service';
import { AlertsService } from '../../../../core/services/alerts/alerts.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-type',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-type.component.html',
  styleUrl: './project-type.component.css'
})
export class ProjectTypeComponent {

  types: any[] = []
  type: any
  showEditForm = false
  submitted = false;
  englishPattern = /^[A-Za-z0-9\s"',._-]+$/;
  arabicPattern = /^[\u0600-\u06FF0-9\u0660-\u0669\s"',.،_-]+$/;
  editingId: number | null = null;
  addForm: FormGroup = new FormGroup({
    arName: new FormControl('', [Validators.required, Validators.pattern(this.arabicPattern)]),
    enName: new FormControl('', [Validators.required, Validators.pattern(this.englishPattern)]),
  });

  editForm = new FormGroup({
    arName: new FormControl('', [Validators.required, Validators.pattern(this.arabicPattern)]),
    enName: new FormControl('', [Validators.required, Validators.pattern(this.englishPattern)]),
  });


  constructor(private _type: TypeService, private alert: AlertsService) { }

  ngOnInit(): void {
    this.getStatus()
  }

  submit() {
    this.submitted = true;

    if (this.addForm.invalid) {
      this.alert.toaster('بعض الحقول فارغة او هناك خطأ في الادخال', "error")
      return;
    }

    this.add()
  }

    add() {

    const arName = this.addForm.value.arName?.trim();
    const enName = this.addForm.value.enName?.trim();

    const isExist = this.types.some(st =>
      st.arName === arName && st.enName === enName
    );

    if (isExist) {
      this.alert.toaster('هذه الحالة موجودة بالفعل', 'error');
      return;
    }

    this._type.addType(this.addForm.value).subscribe({
      next: (res) => {
        console.log(res);
        this.addForm.reset()
        this.alert.toaster("تمت الاضافة بنجاح", "success")
      },
      error: (err) => {
        this.alert.toaster("تمت الاضافة بنجاح", "error")
      },
      complete: () => {
        setTimeout(() => {
          location.reload()
        }, 1000);
      }
    })
  }

  getStatus() {
    this._type.getTypes().subscribe(res =>{
      console.log(res);
      this.types = res
      
    })
  }

  openEditForm(type: any) { }

  edit() { }

  async deleteType(id: number, idx: number) {
    let data = { title: 'هل أنت متأكد من إزالة هذه الحالة؟', text: "سوف يتم مسح الحالة بالكامل!", icon: "warning" }
    const ok = await this.alert.deleteConfirm(data);
    if (!ok) return;

    this._type.deleteType(id).subscribe({
      next: () => {
        this.alert.success('تم حذف الحالة')
      },
      complete: () => {
        this.types.splice(idx, 1)
      }
    });
  }

}
