import { Component, OnInit } from '@angular/core';
import { MaintainService } from 'shared/services/maintenace.service';

@Component({
  selector: 'as-closure-message',
  templateUrl: './as-closure-message.component.html',
  styleUrls: ['./as-closure-message.component.scss'],
})
export class AsClosureMessageComponent implements OnInit {
msg: any;
node: any;
  constructor(private maintainService: MaintainService) { }

  ngOnInit() {
    this.maintainService.getMaintenaceMsg().subscribe((res: Object[]) => {
      // console.log('res - chatbot', res);
      if(res && res['message'].length === 0){
        this.maintainService.isMessageNotAvilable = true;
      }
      this.msg = res;
    });
  }
  remove(id: string){
     this.node = document.getElementById(id);
     if (this.node) {
       this.maintainService.setMessageClose(true);
       this.node.parentNode.removeChild(this.node);
     }
  }
}
