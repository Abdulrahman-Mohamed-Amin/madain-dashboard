import { Injectable } from '@angular/core';
import { Notyf } from 'notyf';
import { timer } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {


  constructor() { }

  deleteConfirm(option:{title:string , text:string }): Promise<boolean> {
    return Swal.fire({
      title: option.title,
      text: option.text,
      icon: "warning" ,
      showCancelButton: true,
      cancelButtonText: 'إلغاء',
      confirmButtonText: 'نعم، متأكد',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#777',
    }).then(res => res.isConfirmed);
  }

  success(msg = 'تمت الإزالة بنجاح') {
    return Swal.fire({
      title: msg,
      icon: 'success',
      timer: 1200
    });
  }

  toaster(msg: string, choice: string) {

    const notyf = new Notyf({ duration: 3000, position: { x: 'left', y: 'top' } , ripple:true , dismissible: true});

    if (choice == "success") {
      notyf.success(msg);
    }else{
      notyf.error(msg);
    }

  }
}
