import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServerdataService {

  currentDB
  currentTABLE
  source = [];
  insecureproto = [];
  InttoExt = [];
  ExttoInt = [];
  insecureriskvalue;
  itoeriskvalue
  etoiriskvalue
  onecol 
  twocols 
  threecols

  constructor() { }

  setcurrent2(source,insecureproto,itoe,etoi){
    this.source=source
    this.insecureproto=insecureproto
    this.InttoExt=itoe
    this.ExttoInt=etoi
  }
  setcurrent1(db,table,onecol,twocols,threecols,insecureriskvalue,itoevalue,etoivalue){
    this.currentDB=db;
    this.currentTABLE=table
    this.insecureriskvalue=insecureriskvalue
    this.itoeriskvalue=itoevalue
    this.etoiriskvalue=etoivalue
    this.onecol=onecol
    this.twocols=twocols
    this.threecols=threecols
    console.log("form setcurrent1")
    console.log(this.onecol,this.twocols,this.threecols)
  }
}
