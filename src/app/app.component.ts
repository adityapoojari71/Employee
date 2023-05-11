import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ApexChart, ApexDataLabels, ApexNonAxisChartSeries,
  ApexTitleSubtitle } from 'ng-apexcharts';
declare var $ :any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  activeRoute:any;
  empData:any;
  employeeDataInformation:any =[];

  // variables for chart
  empTotalTime: ApexNonAxisChartSeries = [];
  empName = [];
  chartDetails: ApexChart = {
  type: 'pie',
  toolbar: {
  show: true
  }
  };
  chartTitle: ApexTitleSubtitle = {
  align: 'center'
  };
  chartDataLabels: ApexDataLabels = {
  enabled: true
  };

  constructor(private httpClient:HttpClient,private route:ActivatedRoute){

  }
  
  async ngOnInit(){
  var restAPI:any="https://rc-vault-fap-live-1.azurewebsites.net/api/gettimeentries?code=vO17RnE8vuzXzPJo5eaLLjXjmRW07law99QTD90zat9FfOQJKKUcgQ==";
  this.empData = await this.httpClient.get(restAPI).toPromise().then();
  console.log(this.empData)
  this.getEmployeeData();
  }

  getEmployeeData(){
    var workstartTime:any,workEndTime:any,totalTimeWorked:any;
    var empTotalTimeWorkedData:any=[];

    //method to calculte total time worked by employee date:11/05/2023
    for(var i=0;i<this.empData.length;i++){
      var obj={};
      workstartTime = new Date(this.empData[i].StarTimeUtc);
      workEndTime = new Date(this.empData[i].EndTimeUtc);
      totalTimeWorked = (workEndTime - workstartTime);
      obj ={
      "EmployeeName":this.empData[i].EmployeeName,
      "totalTimeWorked":totalTimeWorked
      }
      empTotalTimeWorkedData.push(obj);
    }

    //method to calculate overall time worked by employee date:11/05/2023
    const result = Array.from(empTotalTimeWorkedData.reduce((
    empArray:any, {EmployeeName, totalTimeWorked}: any) =>
    empArray.set(EmployeeName,(empArray.get(EmployeeName) || 0) +
    totalTimeWorked), new Map),
    ([EmployeeName, totalTimeWorked]) =>
    ({EmployeeName, totalTimeWorked})
    );
    this.employeeDataInformation = Object.entries(result);
    
    this.employeeDataInformation.map((val:any) =>{
      val[1]['totalTimeWorked'] = this.msToTime(val[1].totalTimeWorked)
    })
    
    //method to sort the array according to totalTimeWorkeds alphabetical oder date:09/11/2022
    this.employeeDataInformation =
    this.employeeDataInformation.sort((a:any, b:any) => {
    
    return this.stringToInteger(b[1].totalTimeWorked) > this.stringToInteger(a[1].totalTimeWorked )? 1
    : this.stringToInteger(b[1].totalTimeWorked) < this.stringToInteger(a[1].totalTimeWorked) ? -1
    : 0;
    
    });

    // method to push data to chart date:09/11/2022
    this.empName=this.employeeDataInformation.map((i: any)=>{
    if(i[1].EmployeeName !== null){return i[1].EmployeeName}
    else{return "Unknown"}
    }) ;

    this.empTotalTime=this.employeeDataInformation.map((i: any)=>{
      return parseInt(i[1].totalTimeWorked);
    }) ;
  }


    //method to switching tab date:09/11/2022
    showSelectedTab(data:any){
      if(data == "tableView"){
        $('#tableView').css({display: 'block'});
        $('#barChatView').css({display: 'none'});
        $('#tableFormat').css("font-weight", "bold");
        $('#graphFormat').css("font-weight", "");
      }
      else{
        $('#tableView').css({display: 'none'});
        $('#barChatView').css({display: 'block'});
        $("#graphFormat").css("font-weight", "bold");
        $("#tableFormat").css("font-weight", "");
      }
    }

    //method to convert milisecond to hours and seconds
    msToTime(duration :any) {
      var minutes:any = Math.floor((duration / (1000 * 60)) % 60),
        hours:any = Math.floor((duration / (1000 * 60 * 60)));
        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        return hours + "hrs" + '  ' + minutes + "min" 
    }

    //method for converting string to integer
    stringToInteger(value:any){
      console.log( parseInt(value))
      return parseInt(value)
    }
  }