import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { TypeService } from '../../../../core/services/project-type/type.service';
import { AlertsService } from '../../../../core/services/alerts/alerts.service';
import { CommonModule } from "@angular/common";
import { StatusService } from '../../../../core/services/project-status/status.service';




@Component({
  selector: 'app-project-status',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule , FormsModule],
  templateUrl: './project-status.component.html',
  styleUrl: './project-status.component.css'
})
export class ProjectStatusComponent implements OnInit {
  status: any[] = []
  statu: any
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


  constructor(private _statu: StatusService, private alert: AlertsService) { }

  ngOnInit(): void {
    this.getStatus()
  }
  
  add() {

    const arName = this.addForm.value.arName?.trim();
    const enName = this.addForm.value.enName?.trim();

    const isExist = this.status.some(st =>
      st.arName === arName && st.enName === enName
    );

    if (isExist) {
      this.alert.toaster('هذه الحالة موجودة بالفعل', 'error');
      return;
    }

    this._statu.addStatu(this.addForm.value).subscribe({
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


  submit() {
    this.submitted = true;

    if (this.addForm.invalid) {
      this.alert.toaster('بعض الحقول فارغة او هناك خطأ في الادخال', "error")
      return;
    }

    this.add()
  }

  getStatus() {
    this._statu.getStatus().subscribe(res => {
      this.status = res
    })
  }

  editStatu(statu: any) {
    this.statu = statu
    this.editingId = statu.id;
    this.showEditForm = true;

    this.editForm.patchValue({
      arName: statu.arName,
      enName: statu.enName,
    });

  }

  updateStatus() {
    if (this.editingId == null) return;

    if (this.editForm.invalid) {
      this.alert.toaster('بعض الحقول فارغة او هناك خطأ في الادخال', "error");
      return;
    }

    const payload = { id: this.statu.id, arName: this.editForm.value.arName, enName: this.editForm.value.enName };

    this._statu.updateStatu(this.editingId, payload).subscribe({
      next: (res) => {
        this.alert.toaster('تم التعديل بنجاح', 'success');

        // تحديث محلي بدل reload
        const i = this.status.findIndex(x => x.id === this.editingId);

        if (i !== -1) this.status[i] = { ...payload };
        console.log(this.status[i], payload);


        this.showEditForm = false;
        this.editingId = null;
        this.editForm.reset();
      },
      error: () => {
        this.alert.toaster('فشل التعديل', 'error');
      }
    });
  }



  async deleteStatu(id: number, idx: number) {
    let data = { title: 'هل أنت متأكد من إزالة هذه الحالة؟', text: "سوف يتم مسح الحالة بالكامل!", icon: "warning" }
    const ok = await this.alert.deleteConfirm(data);
    if (!ok) return;

    this._statu.deleteStatu(id).subscribe({
      next: () => {
        this.alert.success('تم حذف الحالة')
      },
      complete: () => {
        this.status.splice(idx, 1)
      }
    });
  }
}
