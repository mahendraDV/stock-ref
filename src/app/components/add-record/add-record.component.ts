import { Component, Input } from '@angular/core';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-add-record',
  templateUrl: './add-record.component.html',
  styleUrls: ['./add-record.component.scss']
})
export class AddRecordComponent{
  @Input() columns = [];

  pattern = /^\d{0,2}(?:\.\d{0,3}){0,1}$/;

  constructor(private request: RequestService){}

  ngOnInit() {}

  onSubmit(form){
    this.request.send('postRecord', form)
  }
}
