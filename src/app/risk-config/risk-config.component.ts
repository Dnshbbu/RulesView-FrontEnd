import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastContainerDirective,ToastrService } from 'ngx-toastr';
import { FormGroup,  FormBuilder,  Validators, FormControl  } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { ServerdataService } from "../serverdata.service"



export interface riskcolumns {
  onecolumn: number,
  twocolumns: number,
  threecolumns: number
}


@Component({
  selector: 'app-risk-config',
  templateUrl: './risk-config.component.html',
  styleUrls: ['./risk-config.component.css']
})
export class RiskConfigComponent implements OnInit {



  source = [];
  insecureproto = [];
  InttoExt = [];
  ExttoInt = [];
  // username=20;
  insecureriskvalue;
  itoeriskvalue
  etoiriskvalue
  spinnertext="Loading..."

  status;
  // currentDB=this.da
  currentDB
  currentTABLE


  model: riskcolumns[] = []
  submitted = false;

  onSubmit() { this.submitted = true;
  this.sendriskconfig();
}

  constructor(private serverdata:ServerdataService,private spinner: NgxSpinnerService,private httpClient:HttpClient,private toastr: ToastrService) {
    //this.showSpinner()
    // this.showSpinner()
    this.currentDB=this.serverdata.currentDB
    this.currentTABLE=this.serverdata.currentTABLE

    this.source=this.serverdata.source
    this.insecureproto=this.serverdata.insecureproto
    this.InttoExt=this.serverdata.InttoExt
    this.ExttoInt=this.serverdata.ExttoInt

    console.log(this.model)

    this.model['onecolumn']=this.serverdata.onecol
    this.model['twocolumns']=this.serverdata.twocols
    this.model['threecolumns']=this.serverdata.threecols

    this.insecureriskvalue=this.serverdata.insecureriskvalue
    this.itoeriskvalue=this.serverdata.itoeriskvalue
    this.etoiriskvalue=this.serverdata.etoiriskvalue

  }

  ngOnInit() {


  }

  showSuccess() {
    this.toastr.success('Hello world!', 'Toastr fun!');
    // this.toastr.success('in div');
  }


  showSpinner() {
    this.spinner.show();
  }

  hideSpinner(){
    this.spinnertext="Loading..."
    this.spinner.hide();
  }

  sendriskconfig(){
    const formData = new FormData();
    formData.append('onecolumn', this.model['onecolumn']);
    formData.append('twocolumns', this.model['twocolumns']);
    formData.append('threecolumns', this.model['threecolumns']);
    this.httpClient.post('http://127.0.0.1:5000/todo/api/updateriskconfig', formData)
      .subscribe(res=> {
        console.log(res);
        this.toastr.success('Updated!');
        this.status = res['message']
  });

  }

  ngAfterViewInit() {

}
ngAfterViewChecked( ){
  // this.hideSpinner()
  setTimeout(() => {
    /** spinner ends after 5 seconds */
    this.spinner.hide();
  }, 2000);

}

  sendinsecureproto(iswhat){
    if (iswhat=='insecureproto'){
      var abc=[]
      this.insecureproto.forEach(element => {
        var ab = element.split('||');
        abc.push(ab[1].trim())
      });
      const formData = new FormData();
      formData.append('dbname', this.currentDB);
      formData.append('tablename', "services");
      formData.append('iswhat', iswhat );
      formData.append('insecureriskvalue', this.insecureriskvalue);
      var json_arr_insecureproto = JSON.stringify(abc);
      formData.append('saveinsecureproto', json_arr_insecureproto);
      this.spinnertext="Updating ..."
      this.showSpinner()
      this.httpClient.post('http://127.0.0.1:5000/todo/api/saveinsecureproto', formData)
        .subscribe(res=> {
          console.log(res);
          this.toastr.success('Updated!');
          //this.status = res['message']
          console.log(res['message']);
          this.hideSpinner()
    });
  }
    if (iswhat=='inttoext'){
      var abc=[]
      this.InttoExt.forEach(element => {
        var ab = element.split('||');
        abc.push(ab[1].trim())
      });
      const formData = new FormData();
      formData.append('dbname', this.currentDB);
      formData.append('tablename', "services");
      formData.append('iswhat', iswhat );
      formData.append('itoeriskvalue', this.itoeriskvalue);
      var json_arr_insecureproto = JSON.stringify(abc);
      formData.append('saveinsecureproto', json_arr_insecureproto);
      this.httpClient.post('http://127.0.0.1:5000/todo/api/saveinsecureproto', formData)
        .subscribe(res=> {
          console.log(res);
          this.toastr.success(res['message']);
          //this.status = res['message']
          console.log(res['message']);
    });
  }
    if (iswhat=='exttoint'){
      var abc=[]
      this.ExttoInt.forEach(element => {
        var ab = element.split('||');
        abc.push(ab[1].trim())
      });
      const formData = new FormData();
      formData.append('dbname', this.currentDB);
      formData.append('tablename', "services");
      formData.append('iswhat', iswhat );
      formData.append('etoiriskvalue', this.etoiriskvalue);
      var json_arr_insecureproto = JSON.stringify(abc);
      formData.append('saveinsecureproto', json_arr_insecureproto);
      this.httpClient.post('http://127.0.0.1:5000/todo/api/saveinsecureproto', formData)
        .subscribe(res=> {
          console.log(res);
          this.toastr.success(res['message']);
          //this.status = res['message']
          console.log(res['message']);
    });
  }
}

clearvars(){
  this.status=""
}



}
