import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { trigger, style, animate, transition } from '@angular/animations';


@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({ transform: 'translateX(100%)', opacity: 0 }),
          animate('500ms', style({ transform: 'translateX(0)', opacity: 1 }))
        ]),
        transition(':leave', [
          style({ transform: 'translateX(0)', opacity: 1 }),
          animate('500ms', style({ transform: 'translateX(100%)', opacity: 0 }))
        ])
      ]
    )
  ]
})
export class NotificationComponent implements OnInit {
  error: any;
  show: boolean;
  type: string;
  load: boolean;
  constructor(private notificationservice: NotificationService) {
    this.show = false;
    this.load = false;
  }

  ngOnInit() {
    console.log('inside on init');
    this.notificationservice.getNotification().subscribe(notify => {
      this.error = notify.message;
      this.hide();
      this.type = notify.type;
      console.log(this.error);
      console.log(this.type + 'fadfdafaadfda');
      this.show = true;
      setTimeout(() => {
        this.hide();
      }, 3000);
    }
    );
    this.notificationservice.getLoad().subscribe(load => {
      this.isLoading(load.load);
    });
  }
  hide() {
    console.log('hide');
    this.show = false;
  }
  isLoading(load: boolean) {
    console.log('loader called' + load);
    if (!load) {
      setTimeout(() => {
        this.load = load;
      }, 1500);
    } else {
      this.load = load;
    }
  }

}
