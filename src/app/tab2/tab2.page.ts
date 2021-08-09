import {Component, ViewChild} from '@angular/core';
import { Chart, registerables } from 'chart.js';
import {DashboardService} from "../services/dashboard.service";


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  @ViewChild('barChart') barChart;
  AverageArriveTime:any;
  AcceptedOccurrences:any;
  RefusedOccurrences:any;
  occurrencesAcceptedByMonth:any;
  bars: any;
  colorArray: any;
  constructor(private _dashboardService:DashboardService) { }

  ionViewDidEnter() {
    Chart.register(...registerables);
    this.prepararData()
  }

  createBarChart(occurrencesAcceptedByMonth:any) {
    this.bars = new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        labels:["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"],
        datasets: [{
          label: 'Nº ocorrencias aceites',
          data:[occurrencesAcceptedByMonth.ocorrencias[0].accepted ,occurrencesAcceptedByMonth.ocorrencias[1].accepted,
            occurrencesAcceptedByMonth.ocorrencias[2].accepted,occurrencesAcceptedByMonth.ocorrencias[3].accepted,
            occurrencesAcceptedByMonth.ocorrencias[4].accepted,occurrencesAcceptedByMonth.ocorrencias[5].accepted,
            occurrencesAcceptedByMonth.ocorrencias[6].accepted,occurrencesAcceptedByMonth.ocorrencias[7].accepted,
            occurrencesAcceptedByMonth.ocorrencias[8].accepted,occurrencesAcceptedByMonth.ocorrencias[9].accepted,
            occurrencesAcceptedByMonth.ocorrencias[10].accepted,occurrencesAcceptedByMonth.ocorrencias[11].accepted],
          backgroundColor: 'rgb(45, 211, 111)', // array should have same number of elements as number of dataset
          borderColor: 'rgb(45, 211, 111)',// array should have same number of elements as number of dataset
          borderWidth: 1
        }]
      },
    });
  }

  prepararData(){
    this._dashboardService.getAverageArriveTime(localStorage.getItem('token')).subscribe(res=>{
      this.AverageArriveTime = res
      console.log(res)
    })
    this._dashboardService.countAcceptedOccurrences(localStorage.getItem('token')).subscribe(res=>{
      this.AcceptedOccurrences = res
      console.log(res)
    })
    this._dashboardService.countRefusedOccurrences(localStorage.getItem('token')).subscribe(res=>{
      this.RefusedOccurrences = res
      console.log(res)
    })
    this._dashboardService.occurrencesAcceptedByMonth(localStorage.getItem('token')).subscribe(res=>{
      this.occurrencesAcceptedByMonth = res
      console.log(res)
      this.createBarChart(res);

    })
  }
}
