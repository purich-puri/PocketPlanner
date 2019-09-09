import { Component, OnInit } from '@angular/core';
import { PlanService } from 'src/app/services/plan.service';
import { Router } from '@angular/router';
import { PickerController } from '@ionic/angular';
import { PickerOptions } from '@ionic/core';

@Component({
  selector: 'app-createmyplan',
  templateUrl: './createmyplan.page.html',
  styleUrls: ['./createmyplan.page.scss'],
})
export class CreatemyplanPage implements OnInit {

  title = '';
  description = '';
  countryName = 'pick a country';

  constructor(
    private planService: PlanService,
    private router: Router,
    private pickerCtrl: PickerController
  ) { }

  ngOnInit() {
  }

  createPlan(){
    this.planService.createPlan(this.title, this.description)
    .then( res => {
      this.router.navigate(['/tabs/tab2']);
    })
  }

  async showPicker(){
    let pickOpt: PickerOptions = {
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Done'
        }
      ],
      columns: [
        {
          name: 'countryName',
          options: [
            { text: 'countryName1', value: '1' },
            { text: 'countryName2', value: '2' },
          ]
        }
      ]
    };
    let picker = await this.pickerCtrl.create(pickOpt);
    picker.present();
    picker.onDidDismiss().then( async data => {
      let col = await picker.getColumn('countryName');
      this.countryName = col.options[col.selectedIndex].text
    });

  }

}
