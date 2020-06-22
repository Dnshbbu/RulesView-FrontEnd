import { Component, ViewChild, ElementRef,AfterContentInit,OnInit, TemplateRef,ChangeDetectorRef } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators, FormControl  } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource,MatTable} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {SelectionModel} from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { map, startWith} from 'rxjs/operators'
import cytoscape from 'cytoscape'
import cola from 'cytoscape-cola'
import klay from 'cytoscape-klay';
import fcose from 'cytoscape-fcose';
import dagre from 'cytoscape-dagre';
import avsdf from 'cytoscape-avsdf';
// import * as $ from "jquery";
declare var $: any; // ADD THIS
import { HttpClient } from '@angular/common/http';
import { Papa } from 'ngx-papaparse';
import * as popper from 'cytoscape-popper';
import * as expandCollapse from 'cytoscape-expand-collapse';
import * as cose from 'cytoscape-cose-bilkent';
import undoRedo from 'cytoscape-undo-redo';
import contextMenus from 'cytoscape-context-menus';
import 'cytoscape-context-menus/cytoscape-context-menus.css'; // import CSS as well
import viewUtilities from 'cytoscape-view-utilities'
import { DualListComponent } from 'angular-dual-listbox';
import { RiskConfigComponent } from '../app/risk-config/risk-config.component'
import { ToastContainerDirective,ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { ServerdataService } from "./serverdata.service"

// import {Sort} from '@angular/material/sort';

// register extension
cytoscape.use(contextMenus, $);
cytoscape.use(viewUtilities);
cytoscape.use(cola);
cytoscape.use(klay);
cytoscape.use(fcose);
cytoscape.use(dagre);
cytoscape.use(avsdf);
cytoscape.use(cose)
cytoscape.use(popper);
cytoscape.use(expandCollapse);
cytoscape.use(undoRedo);

export interface layout {
  value: string;
  viewValue: string;
}
export interface SrcDstSer_Select {
  value: string;
  viewValue: string;
}
export interface UploadCategory {
  value: string;
  viewValue: string;
}

export interface DialogData {
  animal: string;
  name: string;
}
//  No.	Type	Name	Source	Destination	VPN	Services & Applications	Content	Action	Track	Install On

export interface PeriodicElement {
  num: number;
  type: string;
  name: string;
  src: string;
  dst: string;
  ser: string;
  action: string;
  risk: string;
}

export interface Pokemon {
  value: string;
  viewValue: string;
}
export interface DispProp {
  keyvalue: string;
  valuevalue: string;
}

;

export interface PokemonGroup {
  disabled?: boolean;
  name: string;
  pokemon: Pokemon[];
}



export interface RiskReason {
  riskid: string,
  service: string,
  reason: string,
  riskvalue: string
}

export interface riskcolumns {
  onecolumn: number,
  twocolumns: number,
  threecolumns: number
}



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit,  AfterContentInit {

  //@ViewChild(MatPaginator) paginator: MatPaginator;

  //private popper: Popper;
  title = 'RulesView';

  @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;

  angForm: FormGroup;
  testnodeprop:string;
  nodeprop= [];
  nodeslist= [];
  heroes = ['Windstorm', 'Bombasto', 'Magneta', 'Tornado'];
  baseURL:string;
  allrels:any;
  // allfwpolicies:any;
  // allfwpoliciesarray= [];
  allgroups:any;
  deflimit:string;
  searchnodeurl:string;
  datarefresh:any;
  testvalue:string;
  searchurl:string;
  creategroupurl:string;
  getfwrulesurl:string;
  colortest:any;
  color:string;
  relsearch = new FormControl('');
  rellimit = new FormControl('');
  nodesearch = new FormControl('');
  groupips = new FormControl('');
  groupname = new FormControl('');
  groupcolor = new FormControl('');
  layoutselect = new FormControl('');
  cust_query = new FormControl('');
  upload_query = new FormControl('');
  path_src = new FormControl('');
  path_dest = new FormControl('');
  path_rel = new FormControl('');
  src_select = new FormControl('');
  dst_select = new FormControl('');
  ser_select = new FormControl('');
  fileinp = new FormControl('');
  firewallname = new FormControl('');
  policyname = new FormControl('');
  typeofservice = new FormControl('');

  // policyname = new FormControl('');
  // policyname = new FormControl('');
  // policyname = new FormControl('');

  comparetext;
  lay:string = "cola";
  UploadForm = new FormGroup({
    fileinput: new FormControl(''),
  });
  UploadFormNetObj = new FormGroup({
    fileinputNetObj: new FormControl(''),
  });
  layouts: layout[] = [
    {value: 'cola', viewValue: 'cola'},
    {value: 'circle', viewValue: 'circle'},
    {value: 'klay', viewValue: 'klay'},
    //{value: 'fcose', viewValue: 'fcose'},
    {value: 'cose', viewValue: 'cose'},
    {value: 'avsdf', viewValue: 'avsdf'},
    {value: 'dagre', viewValue: 'dagre'},
    {value: 'grid', viewValue: 'grid'},
    //{value: 'concentric', viewValue: 'concentric'},
  ];
  uploadcategory: UploadCategory[] = [
    {value: 'rules', viewValue: 'Rules'},
    {value: 'network objects', viewValue: 'Network objects'},
  ];
  col_select: SrcDstSer_Select[];

  myControl = new FormControl();
  myControlNodes = new FormControl();
  myallfirewallpolicies = new FormControl();
  myinsecureproto = new FormControl();

  options: string[] = [];
  Nodesoptions: string[] = [];
  // displayprop: DispProp[] = [];
  displayprop = [];
  FwPoliciesoptions: string[] = [];
  // insecureprotooptions: string[] = [];


  filteredOptions: Observable<string[]>;
  filteredOptionsNodes: Observable<string[]>;
  filteredOptionsFwpolicies: Observable<string[]>;
  filteredOptionsinsecureproto: Observable<string[]>;

  allfwpoliciesadd: Observable<string[]>;
  fileData: File = null;
  fileDatanetobj: File = null;
  fileDataservices: File = null;

  stat;
  statnetobj;
  animal: string;
  name: string;
  csvoptions = {
    complete: (results, file) => {
        console.log('Parsed: ', results, file);
    }
    // Add your options here
};
  ParsedEachRow;
  parsedtest;
  parsedtestnetobj;
  parsedheading= [];
  parsedheadingnetobj= [];
  hereissample;
  hereissamplenetobj;
  noofNodes;
  noofEdges;
  isLoadingHidden;
  tofollow1;
  tofollow2;
  uploadstatus;
  uploadstatarray1= [];
  uploadstatarray2= [];
  statstr;
  //  No.	Type	Name	Source	Destination	VPN	Services & Applications	Content	Action	Track	Install On
  displayedColumns: string[] = ['select','Num', 'Type','Name', 'Source','Destination','Service', 'Action', 'Risk'];
  ELEMENT_DATA: PeriodicElement[];
  sortedData: PeriodicElement[];
  dataSource;
  selection;
  collect_nodes=[]
  rowarray = []
  pokemonControl = new FormControl();
  pokemonGroups;
  currentDB
  currentTABLE
  message
  source = [];
  target = [];

  insecureprotooptions
  riskreasondata:RiskReason
  spinnertext="Loading..."

  // source = [];
  insecureproto = [];
  InttoExt = [];
  ExttoInt = [];
  // displayprop=[];
  showkeyval=[]
  // username=20;


  //riskConfigComponent :RiskConfigComponent;


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private serverdata:ServerdataService, private spinner: NgxSpinnerService, private toastr: ToastrService,private riskConfigComponent :RiskConfigComponent,private fb: FormBuilder,private httpClient: HttpClient,public dialog: MatDialog,private papa: Papa,private changeDetectorRefs: ChangeDetectorRef) {
    //this.createForm();
    // this.sortedData = this.dataSource.slice();

 }

  ngOnInit() {
    console.log("this is from ngOnInit")


    /** spinner starts on init */
    // this.spinner.show();

    // setTimeout(() => {
    //   /** spinner ends after 5 seconds */
    //   this.spinner.hide();
    // }, 3000);

    this.dataSource = new MatTableDataSource<PeriodicElement>();
    this.toastr.overlayContainer = this.toastContainer;


    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    this.filteredOptionsNodes = this.myControlNodes.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filternodes(value))
    );
    this.filteredOptionsFwpolicies = this.myallfirewallpolicies.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filterallfwpolicies(value))
    );
    this.filteredOptionsinsecureproto = this.myinsecureproto.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filterallinsecureproto(value))
    );


  }

  ngAfterViewInit() {
    console.log("this is from ngAfterViewInit")
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    //this.selection = new SelectionModel<PeriodicElement>(true, []);
    // console.log(this.dataSource)
    $('[data-toggle="popover"]').popover();
    $('[data-toggle="tooltip"]').tooltip();
      // Add the following code if you want the name of the file appear on select
    $(".custom-file-input").on("change", function() {
      var fileName = $(this).val().split("\\").pop();
      $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
    });
}


  ngAfterContentInit() {
    console.log("this is from ngAfterContentInit")
    this.isLoadingHidden = true;
    // this.get_fwrules()
    this.get_allrels();
    // this.get_allgroups();
    this.get_allfwpolicies();


    // this.ELEMENT_DATA = [
    //   {num: 1, src: 'Hydrogenddddddddd ddddd dd dddd dddddddddddd ddddddd ddddddddddddd d dddddd', ser: '1.0079', dst: 'H'},
    //   {num: 2, src: 'Helium', ser: '4.0026', dst: 'He'}
    // ];
    // this.dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);
    this.selection = new SelectionModel<PeriodicElement>(true, []);


  }





 /** Filter on Edges on the right pane */
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();


    return this.options.filter(option =>  option['nodeprop'].toLowerCase().includes(filterValue));
  }

  /** Filter on the Nodes(autocomplete) on the right pane */
  private _filternodes(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.Nodesoptions.filter(option => option.toLowerCase().includes(filterValue));
  }

  /** Filter on the fw policies while uploading */
  private _filterallfwpolicies(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.FwPoliciesoptions.filter(option => option.toLowerCase().includes(filterValue));
  }
    /** Filter on the insecureproto for Risk calculator */
    private _filterallinsecureproto(value: string): string[] {
      const filterValue = value.toLowerCase();
      this.insecureprotooptions=this.source

      return this.insecureprotooptions.filter(option => option.toLowerCase().includes(filterValue));
    }

/** ============================= Tool bar =============================*/
 /**Toolbar: Reload icon: To refresh the graph */
 refreshgraph(){
  //cy.remove
  // $("#cy").empty();
  this.showSuccess()
  // this.showSpinner()
  this.redraw(this.datarefresh,this.nodeprop);
  this.hideSpinner()
  console.log("this is from refreshgraph")
  console.log(this.displayprop)
  console.log(this.showkeyval)
}
showSpinner() {
  console.log("showing spinner")
  this.spinner.show();
}

hideSpinner(){
  this.spinnertext="Loading..."
  this.spinner.hide();
}

showSuccess() {
  this.toastr.success('Hello world!', 'Toastr fun!');
  // this.toastr.success('in div');

}

getriskconfig(){
  // this.riskConfigComponent.retrieveinsecureprotoconfig()
}

retrieveriskconfig(){
  console.log("retrieveriskconfig")
  this.httpClient.get('http://127.0.0.1:5000/todo/api/retrieveriskconfig')
  .subscribe(res=> {
    console.log(res);
    this.serverdata.setcurrent1(this.currentDB,this.currentTABLE,res[0],res[1],res[2],res[3],res[4],res[5])
    //this.username=res[3]
});

}

retrieveinsecureprotoconfig(){
  console.log("retrieveinsecureprotoconfig")
  const formData = new FormData();
  formData.append('dbname', this.currentDB);
  formData.append('tablename', 'services');
  this.httpClient.post('http://127.0.0.1:5000/todo/api/retrieveinsecureprotoconfig', formData)
    .subscribe(res=> {
      res[0].forEach(element => {
        this.source.push(element[1]+"  ||  "+element[2]+"  ||  "+element[4])
      });
      res[1].forEach(element => {
        this.insecureproto.push(element[1]+"  ||  "+element[2]+"  ||  "+element[4])
      });
      res[2].forEach(element => {
        this.InttoExt.push(element[1]+"  ||  "+element[2]+"  ||  "+element[4])
      });
      res[3].forEach(element => {
        this.ExttoInt.push(element[1]+"  ||  "+element[2]+"  ||  "+element[4])
      });
});

this.serverdata.setcurrent2(this.source,this.insecureproto,this.InttoExt,this.ExttoInt)
// this.riskConfigComponent.dataforduallist(this.currentDB,this.currentTABLE)
}


 /**Toolbar: Group heirarchy icon: Group heirarchy page */
 GrpHeirarchy() {
  //$("#nodeprop").empty();
  //this.redraw(this.relsearch.value,this.rellimit.value,this.nodeprop)
  //this.deflimit='300'
  //this.testvalue="https"
  this.isLoadingHidden = false;
  this.searchurl="http://127.0.0.1:5000/todo/api/grpheirarchy";
  this.httpClient.get(this.searchurl).subscribe((datafromURL)=>{
    this.datarefresh=datafromURL;
    this.isLoadingHidden = true;
    this.redraw_grp(datafromURL,this.nodeprop)
    //this.redraw(datafromURL,this.nodeprop)
    console.log(this.datarefresh)
  });
}

/**Toolbar: Upload icon */
openDialogWithTemplateRef(templateRef: TemplateRef<any>) {
  this.stat=""
  this.statnetobj=""
  this.parsedtest="";
  this.parsedtestnetobj="";
  this.hereissample="";
  this.hereissamplenetobj="";
  this.dst_select.reset();
  this.src_select.reset();
  this.ser_select.reset();

  this.dialog.open(templateRef);

}

/**Toolbar: Upload icon */
openDialogWithTemplateRef2(templateRef: TemplateRef<any>,riskid) {

  this.dialog.open(templateRef);
  const formData = new FormData();
  formData.append('dbname', this.currentDB);
  formData.append('tablename', this.currentTABLE);
  formData.append('riskid', riskid );
  this.httpClient.post('http://127.0.0.1:5000/todo/api/getriskreason', formData)
    .subscribe(res=> {
      console.log(res);
      if(res['status']=="success"){
      // this.toastr.success(res['message']);
      var riskreason;
      this.riskreasondata=res['data']
      // riskreason=res['data'][0].split(';')
      // riskreason.forEach(element => {
      //   if (element!=""){
      //   this.riskreasondata=element.split(',')
      }
    console.log(this.riskreasondata)
});
}


/**Toolbar(tab- Rules): File input in the dialog*/
  fileChange(element) {
    this.fileData = element.target.files[0];
    this.FileUpload()
}
/**Toolbar(tab- Rules): to show sample data, fill in other dropdowns*/
FileUpload() {
  this.parsedtest="";
  this.parsedheading=[];


  this.papa.parse(this.fileData,{preview : 5,
    complete: (result) => {
        var parseddata = result['data'];
        console.log("print 5")
        console.log(parseddata)
        this.parsedtest=parseddata;
        parseddata[0].forEach(element => {
          var ph = element.split(",")
          for (var i=0;i<ph.length;i++){
          this.parsedheading.push(ph[i])
          }
        });

        this.hereissample="Here is the sample of the uploaded file.."
    }
});



  }


/**Toolbar(tab- Netobj): File input in the dialog*/
  fileChangenetobj(element) {
    this.fileDatanetobj = element.target.files[0];
    this.FileUploadNetObj()
  }
/**Toolbar(tab- Netobj): to show sample data, fill in other dropdowns*/
  FileUploadNetObj() {
    this.parsedtestnetobj="";
    this.parsedheadingnetobj=[];
    //console.log("Result:", this.papa.parse(this.fileData));
    this.papa.parse(this.fileDatanetobj,{preview : 5,
      complete: (result) => {
          var parseddata = result['data'];
          this.parsedtestnetobj=parseddata;
          this.hereissamplenetobj="Here is the sample of the uploaded file.."
          parseddata[0].forEach(element => {
            var ph = element.split(",")
            for (var i=0;i<ph.length;i++){
            this.parsedheadingnetobj.push(ph[i])
            }
          });
      }
  });
     }

  displayinputvalue(a){
    console.log(a)
  }

/**Toolbar: Final upload button in the dialog*/
  submitSelValues(iswhat:any){
    this.tofollow1 = ""
    this.tofollow2 = ""
    if (iswhat=='rules'){
      if ((this.src_select.value != this.dst_select.value) && (this.dst_select.value != this.ser_select.value) && (this.ser_select.value != this.src_select.value)){
      const formData = new FormData();
      formData.append('typeoffile', iswhat);
      formData.append('file', this.fileData);
      console.log(this.src_select,this.dst_select,this.ser_select)
      formData.append('firewallname', this.myallfirewallpolicies.value);
      formData.append('policyname', this.policyname.value);
      formData.append('src_select', this.src_select.value);
      formData.append('dst_select', this.dst_select.value);
      formData.append('ser_select', this.ser_select.value);
      var json_arr_parsedheading = JSON.stringify(this.parsedheading);
      formData.append('header_row', json_arr_parsedheading);
      this.isLoadingHidden = false;
      this.stat = "Uploading..."
      this.spinnertext="Uploading... Please wait.. It may take some time"
      this.showSpinner()
      this.httpClient.post('http://127.0.0.1:5000/todo/api/upload', formData)
      .subscribe(res=> {
        this.stat = res['message']
        this.toastr.success(res['message']);
        this.tofollow1 = res['tofollow1']
        this.tofollow2 = res['tofollow2']
        console.log(res['message']);
        this.hideSpinner()
        this.isLoadingHidden = true;
        this.get_allfwpolicies()
        //alert('SUCCESS !!');
      });
      console.log(this.parsedheading);
      }
    else{
      this.toastr.error("Something wrong with your source,destination and service selection");
      //this.stat="Something wrong with your source,destination and service selection";
    }
  }
    if (iswhat=='netobj'){
      const formData = new FormData();
      formData.append('firewallname', this.myallfirewallpolicies.value);
      formData.append('typeoffile', iswhat);
      formData.append('file', this.fileDatanetobj);
      var json_arr_parsedheading = JSON.stringify(this.parsedheadingnetobj);
      formData.append('header_row', json_arr_parsedheading);
      this.isLoadingHidden = false;
      this.spinnertext="Uploading... Please wait.. It may take some time"
      this.showSpinner()
      this.httpClient.post('http://127.0.0.1:5000/todo/api/upload', formData)
      .subscribe(res=> {
        this.statnetobj = res['message']
        //console.log(res['message']);
        this.toastr.success(res['message']);
        this.isLoadingHidden = true;
        this.tofollow1 = res['tofollow1']
        this.tofollow2 = res['tofollow2']
        this.hideSpinner()
        //alert('SUCCESS !!');
      });
    }
    if (iswhat=='services'){
      const formData = new FormData();
      formData.append('firewallname', this.myallfirewallpolicies.value);
      formData.append('typeoffile', iswhat);
      formData.append('file', this.fileDatanetobj);
      console.log(this.typeofservice)
      formData.append('typeofservice', this.typeofservice.value);
      var json_arr_parsedheading = JSON.stringify(this.parsedheadingnetobj);
      formData.append('header_row', json_arr_parsedheading);
      this.isLoadingHidden = false;
      this.spinnertext="Uploading... Please wait.. It may take some time"
      this.showSpinner()
      this.httpClient.post('http://127.0.0.1:5000/todo/api/upload', formData)
      .subscribe(res=> {
        this.statnetobj = res['message']
        this.toastr.success(res['message']);
        console.log(res['message']);
        this.isLoadingHidden = true;
        this.tofollow1 = res['tofollow1']
        this.tofollow2 = res['tofollow2']
        this.hideSpinner()
        //alert('SUCCESS !!');
      });

    }
    if ((iswhat!='rules') && (iswhat!='netobj') && (iswhat!='services')) {
      this.stat='something is wrong';
      this.statnetobj='something is wrong';
    }

  }



  /** ============================= Left pane =============================*/

  /**Search section: Search Nodes */
  SearchNode(){
    this.deflimit='10000'
    this.testvalue="https"
    //this.searchnodeurl="http://127.0.0.1:5000/todo/api/check/"+this.nodesearch.value
    //this.searchnodeurl="http://127.0.0.1:5000/todo/api/check/"+this.nodesearch.value
    this.searchnodeurl="http://127.0.0.1:5000/todo/api/search";
    const submitdata = new FormData();
    submitdata.append('searchnode', this.nodesearch.value);
    this.isLoadingHidden = false;
    this.spinnertext='Fetching details...'
    this.showSpinner()
    this.httpClient.post(this.searchnodeurl,submitdata).subscribe((datafromURL)=>{
    this.datarefresh=datafromURL;
    this.hideSpinner()
    //this.httpClient.get(this.searchnodeurl).subscribe((datafromURL)=>{
      this.isLoadingHidden = true;
    this.redraw(datafromURL,this.nodeprop)
  });
  }

  /**Search section: Search Realtionship */
  SearchRel() {
    //$("#nodeprop").empty();
    //this.redraw(this.relsearch.value,this.rellimit.value,this.nodeprop)
    //this.deflimit='300'
    //this.testvalue="https"
    this.isLoadingHidden = false;
    this.spinnertext='Fetching details...'
    this.showSpinner()
    this.searchurl="http://127.0.0.1:5000/todo/api/search/"+this.relsearch.value+"/"+this.rellimit.value;
    //this.searchurl="http://127.0.0.1:5000/todo/api/search/"+this.testvalue+"/"+this.deflimit;
    this.httpClient.get(this.searchurl).subscribe((datafromURL)=>{
      this.datarefresh=datafromURL;
      this.isLoadingHidden = true;
      this.hideSpinner()
      this.redraw(datafromURL,this.nodeprop)
      console.log(this.datarefresh)
    });
  }

  /**Search section: Search Path */
  SearchPath() {
    this.searchurl="http://127.0.0.1:5000/todo/api/searchpath";
    const submitdata = new FormData();
    submitdata.append('pathsource', this.path_src.value);
    submitdata.append('pathdest', this.path_dest.value);
    //submitdata.append('pathrel', this.path_rel.value);
    this.isLoadingHidden = false;
    this.httpClient.post(this.searchurl,submitdata).subscribe((datafromURL)=>{
    this.datarefresh=datafromURL;
    //this.httpClient.get(this.searchnodeurl).subscribe((datafromURL)=>{
      this.isLoadingHidden = true;
    this.redraw(datafromURL,this.nodeprop)
    });
  }


  /** DefaultRules section */
  DefaultRules(value){
    const submitdata = new FormData();
    submitdata.append('defaultquery', value);
    this.searchurl="http://127.0.0.1:5000/todo/api/defaultrules";
    this.isLoadingHidden = false;
    this.httpClient.post(this.searchurl,submitdata).subscribe((datafromURL)=>{
    this.datarefresh=datafromURL;
    //this.httpClient.get(this.searchnodeurl).subscribe((datafromURL)=>{
      this.isLoadingHidden = true;
    this.redraw(datafromURL,this.nodeprop)
  });

  // Insecureprotocols(){
    // this.searchurl="http://127.0.0.1:5000/todo/api/insecureproto"
    // this.httpClient.get(this.searchurl).subscribe((datafromURL)=>{
    //   this.datarefresh=datafromURL;
    //   this.redraw(datafromURL,this.nodeprop)
    // });
  }

  /**Custom query section */
  CustQuery(){
    this.searchurl="http://127.0.0.1:5000/todo/api/custquery";
    const submitdata = new FormData();
    submitdata.append('custquery', this.cust_query.value);
    this.isLoadingHidden = false;
    this.httpClient.post(this.searchurl,submitdata).subscribe((datafromURL)=>{
    this.datarefresh=datafromURL;
    this.isLoadingHidden = true;
    //this.httpClient.get(this.searchnodeurl).subscribe((datafromURL)=>{
    this.redraw(datafromURL,this.nodeprop)
  });
  this.tofollow1="";
  this.tofollow2="";
  }

   /** To create a new group */
   CreateGroup(){
    this.creategroupurl="http://127.0.0.1:5000/todo/api/creategroup";
    const submitdata = new FormData();
    submitdata.append('groupips', this.groupips.value);
    submitdata.append('groupname', this.groupname.value);
    submitdata.append('groupcolor', this.groupcolor.value);
    this.isLoadingHidden = false;
    if (this.groupips.value!=''){
    this.httpClient.post(this.creategroupurl,submitdata).subscribe((datafromURL)=>{
      this.isLoadingHidden = true;
      //console.log(datafromURL)
    });}
  }

  /** To get all relationships and fill the Get all relationships chips */
  get_allrels(){
    //this.baseUrl = "http://127.0.0.1:5000/todo/api"
    this.isLoadingHidden = false;
    this.httpClient.get("http://127.0.0.1:5000/todo/api" + '/allrels').subscribe((res)=>{
        this.allrels=res[0]; //allrels is used to display all the relationships in the html template
        this.message=res[1]
        this.isLoadingHidden = true;
    });
    //this.redraw()
  }

   /** After clicking on a relationship chip, to display the graph */
   get_rels(valu){
    this.deflimit='50'
    this.searchurl="http://127.0.0.1:5000/todo/api/search/"+valu.toElement.innerText+"/"+this.deflimit;
    this.isLoadingHidden = false;
    console.log(this.isLoadingHidden)
    this.httpClient.get(this.searchurl).subscribe((datafromURL)=>{
      this.datarefresh=datafromURL;
      console.log(this.datarefresh)
      this.isLoadingHidden = true;
      console.log(this.isLoadingHidden)
      //this.nodeprop.length=0
      this.redraw(datafromURL,this.nodeprop)
    });
    // this.redraw(this.searchurl,this.nodeprop)
    //this.redraw(valu.target.value,this.deflimit,this.nodeprop)
    //console.log("va");
    //this.redraw()
  }

 /** ========================================= Drawer3: Table =========================================*/

  /** To get the contents for the dropdown for Firewallname:policy name in drawer3 */
  get_allfwpolicies(){
    // this.allfwpoliciesarray.length=0
    this.FwPoliciesoptions.length=0
    //this.baseUrl = "http://127.0.0.1:5000/todo/api"
    this.isLoadingHidden = false;
    this.httpClient.get("http://127.0.0.1:5000/todo/api/getallfwpolicies").subscribe((res)=>{
      console.log("res")
      console.log(res)
      this.FwPoliciesoptions.length=0
        this.FwPoliciesoptions=res[1]
        this.pokemonGroups=res[0];
        this.isLoadingHidden = true;
    });
    //this.redraw()
  }

  /** To calculate risk */
  recalculateRisk(){
    const submitdata = new FormData();
    submitdata.append('db_name', this.currentDB);
    submitdata.append('table_name', this.currentTABLE);
    this.spinner.show()
    this.spinnertext="Updating risk score... Please wait.."
    this.showSpinner()
    this.httpClient.post('http://127.0.0.1:5000/todo/api/calculaterisk',submitdata).subscribe((res)=>{
    if(res['status']=='success') {
    this.toastr.success(res['message'])
  }
  if(res['status']=='error') {
    this.toastr.error(res['message'])
  }
  this.hideSpinner()
    });

  }

  /** After clicking on an option from dropdown, to get all the table content */
  get_fwrules(groupname,policyname){

    this.currentDB = groupname
    this.currentTABLE = policyname
    this.retrieveriskconfig()
    this.retrieveinsecureprotoconfig()


    this.getfwrulesurl = "http://127.0.0.1:5000/todo/api/getfwrules";
    // var policyforrules = "default"
    const submitdata = new FormData();
    submitdata.append('dbname', groupname);
    submitdata.append('tablename', policyname);
    this.httpClient.post(this.getfwrulesurl,submitdata).subscribe((datafromURL:PeriodicElement[])=>{
        this.ELEMENT_DATA = datafromURL
        this.dataSource.data =this.ELEMENT_DATA;
        this.table.renderRows();
        this.isLoadingHidden = true;
    });

  }

  /** Filter table*/
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    // console.log("reached isselectedAll")


    // console.log(this.selection.selected)
    // console.log(this.selection.selected["No"])
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;

  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** To display graph of the selected row from the table  */
  selectedrowdisplay(){
    this.rowarray.length =0 ;
    this.selection.selected.forEach(element => {
      this.rowarray.push(element['No'])
    });
    this.getfwrulesurl = "http://127.0.0.1:5000/todo/api/getselectedrules";
    const formData = new FormData();
    formData.append('firewallname', this.currentDB);
    formData.append('policyname', this.currentTABLE);
    var rowjsonarray = JSON.stringify(this.rowarray);
    formData.append('selectedruleno', rowjsonarray);
    this.isLoadingHidden = false;
    this.httpClient.post(this.getfwrulesurl,formData).subscribe((datafromURL)=>{
      if(datafromURL==null){
        this.toastr.error("Error: No data returned from the server");
        //this.message="Error: No data returned from the server"

      }
      if(datafromURL['status']=="error"){
        this.toastr.error(datafromURL['message']);
      }
      if(datafromURL['status']=="success"){
        console.log(datafromURL)
        this.toastr.success(datafromURL['message']);
        this.redraw(datafromURL['data'],this.nodeprop)
      }
      this.isLoadingHidden = true;
        // this.dataSource.data =this.ELEMENT_DATA;
        //this.dataSource.data =datafromURL;
        //this.table.renderRows();
    });
  }

  displayelements(element){
    element.forEach(ele => {
      this.displayprop.push(ele)
    });

  }


/** ========================================= Graph: Visualization =========================================*/
redraw(datafromURL,nodeprop){
  // to show Graph status
  this.noofNodes = datafromURL.nodes.length;
  this.noofEdges = datafromURL.edges.length;

  this.displayprop.length = 0 // resetting the Properties pane
  this.options.length = 0 // resetting the Edges properties pane

  // console.log data from the server; by default fwpolicies are retrieved when application loads for first time
  console.log(datafromURL)

  // to display relationship properties in the right pane
  nodeprop.length=0;
  let y=1;
  // for (let i of datafromURL.edges) {
  //   var obj={}
  //   obj['id']=i['data']['name']
  //   obj['nodeprop']=i['data']['No.']+": "+"("+i['data']['source']+")"+"--"+"("+i['data']['service']+")"+"-->"+"("+i['data']['target']+")"
  //   nodeprop.push(obj)
  //   y=y+1;
  // }

  // to filter and zoom to focus on nodes
  let yy=1;
  let nodeslist=[]
  for (let i of datafromURL.edges) {
    nodeslist.push(i['data']['source'])
    nodeslist.push(i['data']['target'])
    yy=yy+1;
}
  // to remove duplicates in the nodeslist
  nodeslist = nodeslist.filter((a, b) => nodeslist.indexOf(a) === b)


  this.Nodesoptions.length=0;
  nodeslist.forEach(element => {
    this.Nodesoptions.push(element)
  });


  this.myControlNodes.patchValue("")

  //Visualization part
  var cy =  cytoscape({
    container: document.getElementById('cy'),
    start: function(){
      console.log("i am from start function")
    },
    //   layout: {
    //   name: this.lay,
    //   animate: false,
    //   avoidOverlap: true,
    // },
    ready: function(){
      var api = this.expandCollapse({
        layoutBy: {
          // name: 'cola',
          name: 'cose-bilkent',
          // name: 'fcose',
          randomize: false,
          // nodeDimensionsIncludeLabels: false,
          nodeDimensionsIncludeLabels: true,
          fisheye: true,
          // // animate: true,
          // animate: 'end',
          animate: false,
          // nodeRepulsion: 10000,
          // // animationDuration: 1000,
          avoidOverlap: true,
          // Initial cooling factor for incremental layout
          initialEnergyOnIncremental: 1.5,
          // Called on `layoutready`
          ready: async () => {
          // ready: async function () {
            console.log("this is from ready function")
          },
          // Called on `layoutstop`
          stop: function () {
            console.log("this is from Stop function")
            updateedgesprop()
          },
        },
        // ready: function () {this.isLoadingHidden=false;console.log(this.isLoadingHidden) },
        // fisheye: true,
        animate: false,
        // undoable: false
      });

      api.collapseAll();




    },
    style: [
      {
        selector: 'node',
        css: {
          'content': 'data(id)',
          'background-color': function(data){ //return the color is the node has the color, if not return grey color(#a2a3a2)
            if (data.data().color){return data.data().color}
            else{return '#a2a3a2'}
          },
          'background-image':function(data){
            if (data.data().isgrp=="true"){
              var url="../assets/group.svg";return url
            }

            if (data.data().isgrp!="true"){
                if (data.id().startsWith("Host") || data.id().startsWith("ws") || data.id().startsWith("host")){
                  // data.style({"shape": "round-rectangle",'background-image':function(){var url="../assets/host.svg";return url}})
                  var url="../assets/host.svg";return url
                }
                // if (data.id().startsWith("net") || data.id().startsWith("Net")){
                //   data.style({"shape": "round-rectangle",'background-image':function(){var url="../assets/network.svg";return url}})
                // }
                if (data.id().startsWith("net") || data.id().startsWith("Net") ||  data.data().Mask!="NA"){
                  // data.style({"shape": "round-rectangle",'background-image':function(){var url="../assets/network.svg";return url}})
                  var url="../assets/network.svg";return url
                }
                if (data.id().startsWith("domain") || data.id().startsWith("srv")){
                  // data.style({"shape": "round-rectangle",'background-image':function(){var url="../assets/webserver.svg";return url}})
                  var url="../assets/webserver.svg";return url
                }
                if (data.id().includes("DC") || data.id().includes("AD_MUN")){
                  // data.style({"shape": "round-rectangle",'background-image':function(){var url="../assets/dc.svg";return url}})
                  var url="../assets/dc.svg";return url
                }
                if (data.id().includes("SIP")){
                  // data.style({"shape": "round-rectangle",'background-image':function(){var url="../assets/sip.svg";return url}})
                  var url="../assets/sip.svg";return url
                }
                else{
                  var url="../assets/questionmark.svg";return url
                }
            }
          },
          'font-family': 'Georgia',
          'font-size': '0.5em',
          'width': '25',
          'height': '25',
          'text-wrap': 'wrap',
          'text-valign': 'top',
        'text-halign': 'center',
        "shape": "round-rectangle"
          //'text-valign': 'center',
          //'compound-sizing-wrt-labels': 'exclude'
        }
      },
      {
        selector: 'node:parent',
        css: {
          'background-opacity': 0.333,
          'background-color': 'data(color)',
        }
      },
      {
        selector:'edge.highlighted',
        css:{
          'curve-style': 'bezier',
          'target-arrow-shape': 'triangle',
          'width': 10,
          'line-color': '#4286f4',
          'target-arrow-color': '#78797a'
        }
      },

      {
        selector: 'edge',
        css: {
          'label': 'data(service)',
          'font-size': '0.5em',
          //'font-family': 'sans-serif',
          'font-family': 'Roboto',
          'color': 'black',
          'text-outline-color': 'blue',
          'width': 0.5,
          'opacity': 0.33,
          'line-color': '#615943',
          'curve-style': 'bezier',
          'target-arrow-shape': 'triangle',
          'target-arrow-color': '#3d3d3d',
          "edge-text-rotation": "autorotate",
          'text-outline-width': 0.1,
          //'text-outline-color': '#222'
        }
      }
    ],

    elements: datafromURL,
  });

  /**
   * cytoscape
   * cytoscape expand-collapese
   * cytoscape viewutilities -> to zoom to an element
   * Cytoscape Coseblinket ->reevaluate
   */


  var api_outer_viewutilities = cy.viewUtilities({
    node: {
      highlighted: {
        'border-color': '#0B9BCD',  //blue
        'border-width': 3
      },
      highlighted2: {
        'border-color': '#04F06A',  //green
        'border-width': 3
      },
      highlighted3: {
        'border-color': '#F5E663',   //yellow
        'border-width': 3
      },
      highlighted4: {
        'border-color': '#BF0603',    //red
        'border-width': 3
      },
      selected: {
        'border-color': 'black',
        'border-width': 3,
        'background-color': 'lightgrey'
      }

    },
    edge: {
      highlighted: {
        'line-color': '#0B9BCD',    //blue
        'width' : 3
      },
      highlighted2: {
        'line-color': '#04F06A',   //green
        'width' : 3
      },
      highlighted3: {
        'line-color': '#ffff00',    //yellow
        // 'line-color': '#F5E663',    //yellow
        'width' : 3
      },
      highlighted4: {
        'line-color': '#BF0603',    //red
        'width' : 3
      },
      selected: {
        // 'line-color': '#ffff00',
        'line-color': 'black',
        'width' : 3
      }
    },
    setVisibilityOnHide: false, // whether to set visibility on hide/show
    setDisplayOnHide: true, // whether to set display on hide/show
    zoomAnimationDuration: 1500, //default duration for zoom animation speed
    neighbor: function(node){
        return node.closedNeighborhood();
    },
    neighborSelectTime: 1000
});

  function updateedgesprop(){
    var items = document.getElementsByName('zoomtoedges');
    console.log(items.length)

    for (var i=0;i<items.length;i++){
      // console.log(items[i])
      items[i].addEventListener("click",cbChange,false)
    }
  }
  function cbChange(event){
    console.log(event.target.id);
    api_outer_viewutilities.disableMarqueeZoom();
    api_outer_viewutilities.removeHighlights();
    // var text = $('#DynamicValueAssignedHere').find('input[id="selectednodevalue"]').val();
    var text = event.target.id
    var selectedEles = cy.$id(""+text+"") //the format should be like this !!!
    console.log("Zoom to below element");
    console.log(text)
    var args = {eles: selectedEles, option: "highlighted3"};
    api_outer_viewutilities.highlight(args)
    // console.log(selectedEles);
    api_outer_viewutilities.zoomToSelected(selectedEles);
  //            ^^^^
  }


  for (let i of cy.edges()) {
      var obj={}
      obj['id']=i.data().id
      obj['nodeprop']=i.data()['No.']+": "+"("+i.data().source+")"+"--"+"("+i.data().service+")"+"-->"+"("+i.data().target+")"
      // obj['nodeprop']=i['data']['No.']+": "+"("+i['data']['source']+")"+"--"+"("+i['data']['service']+")"+"-->"+"("+i['data']['target']+")"
      nodeprop.push(obj)
      y=y+1;
    };
  // Update the nodeprop properties
  this.options.length=0
  nodeprop.forEach(element => {
    this.options.push(element)
  });
  // console.log(this.options)
  this.myControl.patchValue(":")

  // Cytoscape functions
  /** Toolbar: Download button */
  document.getElementById("download").addEventListener("click", function () {
    var png64 = cy.png();
    var data=png64
    var filename="networkImage_download.png"
    var pom = document.createElement('a');
    pom.setAttribute('href', data);
    pom.setAttribute('download', filename);
    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
  });/** Toolbar: End of Download button */

    /** Toolbar: ExpandAll button */
  document.getElementById("expandall").addEventListener("click", function () {
    // var api = cy.expandCollapse('get')
    //   this.collapseall()
    var api_collapse=cy.expandCollapse('get')
    api_collapse.expandAll();
  });

  /** Toolbar: CollapseAll button */
  document.getElementById("collapseall").addEventListener("click", function () {
    // var api = cy.expandCollapse('get')
    //   this.collapseall()
    var api_collapse=cy.expandCollapse('get')
    api_collapse.collapseAll();
  });

  /** Toolbar: MarqueeZoom button */
  document.getElementById("mZ").addEventListener("click", function () {
    api_outer_viewutilities.enableMarqueeZoom();
    // if( document.getElementById('layout').checked){
    //     layout.run();
    // }
  });

  /** Toolbar: Zoom to selected node filtered dropdown  */
  document.getElementById("zoomtoselectnodes").addEventListener("click", function () {
    api_outer_viewutilities.disableMarqueeZoom();
    var text = $('#DynamicValueAssignedHere').find('input[id="selectednodevalue"]').val();
    console.log(text)
    var selectedEles = cy.$id(""+text+"") //the format should be like this !!!
    console.log("Zoom to below element");
    console.log(selectedEles);
    api_outer_viewutilities.zoomToSelected(selectedEles);
});

  // On clicking, change the focus
  cy.$('node').on('click', function (e) {
    this.colortest ="yellow"
    // this.displayprop.push("yoyo")
    var ele = e.target; // target node
    var descendants = ele.descendants() // Get all compound descendant (i.e. children, children's children, etc.) nodes of each node in the collection.
    var sel_nodes = ele.neighborhood().nodes() // neighborhood nodes
    var sel_edges = ele.neighborhood().edges() // neighborhood edges

    // change opacity of edges to 1, if it is a neighbor node
    cy.edges().forEach(element => {
      for(let element1 of sel_edges) {
            if(element.id()==element1.id()){
                element.style({ 'opacity': 1})
                break
              }
        element.style({ 'opacity': 0.1}) // change opacity of nodes, if it is a neighbor node
      }
    });

    // change opacity of nodes to 1, if it is a neighbor node
    cy.nodes().forEach(element => {
      for(let element1 of sel_nodes) {
            if(element.id()==element1.id()){
                element.style({ 'opacity': 1})
                element.parent().style({ 'opacity': 0.8}) // change opacity of parent node to 0.8, adjustment for compound node
                element.parent().parent().style({ 'opacity': 0.8}) // change opacity of parent to parent nodes to 0.8, if it is a neighbor node // TODO
                // ele.style({ 'opacity': 1})
                break
              }
        element.style({ 'opacity': 0.1}) // change opacity of nodes to 0.1, if it is not a neighbor node
      }

    });

    ele.style({ 'opacity': 1}) // some adjustments
    ele.parent().style({ 'opacity': 0.7}) // some adjustments
    });

  // On clicking anywhere in the graph changing the opacity to normal
  cy.on('click', function (e) {
    var ele = e.target;
    if (ele === cy){
      cy.nodes().style({ 'opacity': 1});
      cy.edges().style({ 'opacity': 0.5});
    }
    api_outer_viewutilities.removeHighlights();
  });


  //on mouseover events
  cy.$('node').on('mouseover', function (elem) {
    try {
    var a =elem.target
    var makeDiv = function(text){
      var div = document.createElement('div');
      div.id = "tipping_setup"
      div.setAttribute("style", "font-size:1em;border: 1px solid #6d8191;border-radius: 5px;background-color: rgba(240, 238, 238, 0.3);");
      /* border: solid lightblue 0.5px; */
      //div.attr('style,'{'background-color': black});
      //div.classList.add('popp');
      div.innerHTML = ""
      for (const [key, value] of Object.entries(text)) {
        // if(key!='parent' && key!='color' && key!='IPv6 address' && key!='Mask 6' && key!='NAT Properties' && key!='Name'){
        if(key=='id'){
        div.innerHTML = div.innerHTML+key.toString()+" : "+value.toString()+"<br />"
      }
        if(key=='IPAddress'){
          div.innerHTML = div.innerHTML+key.toString()+" : "+value.toString()+"<br />"
        }
        if(key=='Mask'){
          div.innerHTML = div.innerHTML+key.toString()+" : "+value.toString()+"<br />"
        }
        if(key=='Comments'){
          div.innerHTML = div.innerHTML+key.toString()+" : "+value.toString()+"<br />"
        }

      }
      //div.innerHTML = text;
      //document.getElementById('cy').appendChild( div );
      //document.body.appendChild( div );
      document.getElementById('cy').appendChild( div );
      return div;
    };

    var popperA = a.popper({
        content: function(){ return makeDiv(a.data()); }
      });

    var updateA = function(){
      popperA.scheduleUpdate();
    };

    cy.on('position', updateA);
    cy.on('pan zoom resize', updateA);
  }
  catch{
    console.log("some error in mouseover function")
  }
});

  //on tapping edges


  // cy.on('tap', 'edge', function(elem){
  cy.on('tap', 'edge', elem => {  // this MUST be an arrow function, otherwise cy will messup the "this" keyword
    this.displayprop.length=0
    api_outer_viewutilities.removeHighlights();

  // cy.$('edge').on('click', function (elem) {
    console.log("edge tap")

    for (const [key, value] of Object.entries(elem.target.data())) {

      if ((key!='originalEnds') &&  (!key.startsWith("highlighted"))){
        var obj = {};
        obj['keyvalue'] = key;
        obj["valuevalue"] = value;
        this.displayprop.push(obj)
      }
    }
    console.log(this.displayprop)


    var args = {eles: elem.target, option: "highlighted3"};
    api_outer_viewutilities.highlight(args)

    //this.displayelements(nietos)


    // // console.log(elem.target.data())
    // elem.target.forEach(element => {
    //   console.log(element)
    //   var obj = {};
    //   obj["name"] = element.data('name');
    //   nietos.push(obj)
    // });


      // this.displayprop.push(nietos)
      // this.displayprop.push('yooyoyoyo2')
      // console.log(this.displayprop)


    // this.displayprop.push(b)
    // console.log(elem.target.data()['name'])
    // this.displayprop.push(elem.target)
    // console.log(this.displayprop)
    // // console.log(elem.target.data().name)
    // console.log(elem.target.data())
});

  //on MouseOut function
  cy.$('node').on('mouseout', function () {
    try{

    var todelete = document.getElementById('tipping_setup')
    todelete.parentNode.removeChild(todelete);
  }
  catch{
    console.log("some error in mouse out")
  }
  });

  // cy.$('edge').on('click', function (e) {
  //   console.log(e)
  //   console.log("edge clicked")
  // });

  cy.nodes().on("expandcollapse.afterexpand", y => {
    var nodeprop2=[]
    console.log(y)
    for (let i of cy.edges()) {
      var obj={}
      obj['id']=i.data().id
      obj['nodeprop']=i.data()['No.']+": "+"("+i.data().source+")"+"--"+"("+i.data().service+")"+"-->"+"("+i.data().target+")"
      // obj['nodeprop']=i['data']['No.']+": "+"("+i['data']['source']+")"+"--"+"("+i['data']['service']+")"+"-->"+"("+i['data']['target']+")"
      nodeprop2.push(obj)
      y=y+1;
    };
  // Update the nodeprop properties
  this.options.length=0
  nodeprop2.forEach(element => {
    this.options.push(element)
  });
  // console.log(this.options)
  this.myControl.patchValue(":")


    // updateedgesprop()
     })


  cy.fit()
  cy.resize()
  console.log("this is redraw")


}



/** ========================================= Graph: GraphHeirarchy =========================================*/
redraw_grp(datafromURL,nodeprop){


  this.noofNodes = datafromURL.nodes.length;
  this.noofEdges = datafromURL.edges.length;



  nodeprop.length=0;

  let y=1;
  for (let i of datafromURL.edges) {
    nodeprop.push(i['data']['No.']+": "+"("+i['data']['source']+")"+"--"+"("+i['data']['service']+")"+"-->"+"("+i['data']['target']+")")
    y=y+1;
}
  //console.log(nodeprop)
  var cy =  cytoscape({
    container: document.getElementById('cy'),
      layout: {
      name: "dagre",
      rankDir: "LR",
      nodeDimensionsIncludeLabels: true,
      //name: 'expandCollapse',
      //name: 'cola',
      //name: 'cise',
      //name: 'klay',
      //name: 'dagre',
      animate: false,
      avoidOverlap: true,
      // padding: 30,
    },
    ready: function(){
      var api = this.expandCollapse({
        layoutBy: {
          //name: 'cola',
          name: null,
          //animate: "end",
          animate: false,
          randomize: false,
          fit: true
        },
        fisheye: true,
        animate: false,
        //animationDuration: 1000,
        undoable: false
      });

      api.collapseAll();
    },

    style: [
      {
        selector: 'node',
        css: {
          'content': 'data(id)',
          'label': 'data(label)',
          'background-color': 'data(color)',
          'background-image':function(data){
            if (data.data().isgrp=="true"){
              var url="../assets/group.svg";return url
            }
              if (data.data().isgrp!="true"){
                  if (data.id().startsWith("Host") || data.id().startsWith("ws") || data.id().startsWith("host")){
                    // data.style({"shape": "round-rectangle",'background-image':function(){var url="../assets/host.svg";return url}})
                    var url="../assets/host.svg";return url
                  }
                  // if (data.id().startsWith("net") || data.id().startsWith("Net")){
                  //   data.style({"shape": "round-rectangle",'background-image':function(){var url="../assets/network.svg";return url}})
                  // }
                  if (data.id().startsWith("net") || data.id().startsWith("Net") ||  data.data().Mask!="NA"){
                    // data.style({"shape": "round-rectangle",'background-image':function(){var url="../assets/network.svg";return url}})
                    var url="../assets/network.svg";return url
                  }
                  if (data.id().startsWith("domain") || data.id().startsWith("srv")){
                    // data.style({"shape": "round-rectangle",'background-image':function(){var url="../assets/webserver.svg";return url}})
                    var url="../assets/webserver.svg";return url
                  }
                  if (data.id().includes("DC") || data.id().includes("AD_MUN")){
                    // data.style({"shape": "round-rectangle",'background-image':function(){var url="../assets/dc.svg";return url}})
                    var url="../assets/dc.svg";return url
                  }
                  if (data.id().includes("SIP")){
                    // data.style({"shape": "round-rectangle",'background-image':function(){var url="../assets/sip.svg";return url}})
                    var url="../assets/sip.svg";return url
                  }
              }

            // var url="../assets/host.svg";return url

          },
          //'background-image':function(){var url="https://image.flaticon.com/icons/svg/1829/1829008.svg";return url},
          //'background-image':function(){console.log(data(id));var url="../assets/server.svg";return url},
            //if ('data(id)'=='Host_154.59.121.183'){var url="../assets/server.svg";return url}},
          //'background-color': function(){var color = randomColor();var col="rgb("+color.values['rgb']['0']+","+color.values['rgb']['1']+","+color.values['rgb']['2']+")";return col;},
          'font-family': 'Georgia',
          'font-size': '0.5em',
          'width': '25',
          'height': '25',
          'text-wrap': 'wrap',
          'text-valign': 'top',
        'text-halign': 'center',
        "shape": "round-rectangle"
          //'text-valign': 'center',
          //'compound-sizing-wrt-labels': 'exclude'
        }
      },
      {
        selector: 'node:parent',
        css: {
          'background-opacity': 0.333,
          'background-color': 'data(color)',
        }
      },
      {
        selector:'edge.highlighted',
        css:{
          'curve-style': 'bezier',
          'target-arrow-shape': 'triangle',
          'width': 10,
          'line-color': '#4286f4',
          'target-arrow-color': '#78797a'
        }
      },

      {
        selector: 'edge',
        css: {
          'label': 'data(service)',
          'font-size': '0.5em',
          //'font-family': 'sans-serif',
          'font-family': 'Roboto',
          'color': 'black',
          'text-outline-color': 'blue',
          'width': 0.5,
          'opacity': 0.5,
          'line-color': '#615943',
          'curve-style': 'bezier',
          'target-arrow-shape': 'triangle',
          'target-arrow-color': '#3d3d3d',
          "edge-text-rotation": "autorotate",
          'text-outline-width': 0.1,
          //'text-outline-color': '#222'
        }
      }
    ],

  elements: datafromURL,
});



var layout = cy.layout({
  name: this.lay,
  avoidOverlap: true,
});


  var doubleClickDelayMs = 350;
  var previousTapStamp;
  cy.on('tap', function(e) {
    var currentTapStamp = e.timeStamp;
    var msFromLastTap = currentTapStamp - previousTapStamp;

    if (msFromLastTap < doubleClickDelayMs) {
      e.target.trigger('doubleTap', e);
    }
    previousTapStamp = currentTapStamp;
  });

  cy.$('node').on('doubleTap', function(e, originalTapEvent) {
    //alert('doubleTap');
    var ele = e.target;
    console.log(originalTapEvent);




    // api.expand(ele)
    // var a =true
    // if (a == 'false') {
    //   api.collapse(ele)
    //   a = true;
    // } else if (a == true) {
    //   api.expand(ele)
    //   a = false;
    // }
  });



  //On clicking, change the focus
  cy.$('node').on('click', function (e) {
    this.colortest ="yellow"
    var ele = e.target;


    var descendants = ele.descendants()


    var sel_nodes = ele.neighborhood().nodes() //neighborhood nodes
    var sel_edges = ele.neighborhood().edges() //neighborhood edges





    cy.edges().forEach(element => {
      for(let element1 of sel_edges) {
            if(element.id()==element1.id()){
                element.style({ 'opacity': 1})
                break
              }
        element.style({ 'opacity': 0.1})
      }
    });
    cy.nodes().forEach(element => {
      for(let element1 of sel_nodes) {
            if(element.id()==element1.id()){
                element.style({ 'opacity': 1})
                element.parent().style({ 'opacity': 0.8})
                element.parent().parent().style({ 'opacity': 0.8})
                ele.style({ 'opacity': 1})
                break
              }
        element.style({ 'opacity': 0.1})
      }
      // for(let element1 of descendants) {
      //   if(element.id()==element1.id()){
      //     element.style({ 'opacity': 1})
      //     break
      //   }
      // }
    });



    ele.style({ 'opacity': 1})
    ele.parent().style({ 'opacity': 0.7})


    // ele.descendants().style({ 'opacity': 1})
});


//On clicking anywhere in the graph changing the opacity to normal
  cy.on('click', function (e) {
    var ele = e.target;


    if (ele === cy){
      //console.log(ele)
      //ele.connectedEdges().style({ 'line-color': '#615943','width': 0.5 });
      cy.nodes().style({ 'opacity': 1});
      cy.edges().style({ 'opacity': 0.5});
    }


});

//Update the nodeprop properties
  this.options.length=0
  nodeprop.forEach(element => {
    this.options.push(element)
  });


  this.myControl.patchValue(":")



//on mouseover events
  cy.$('node').on('mouseover', function (elem) {
    try{
    var a =elem.target
    //console.log(a)
    var makeDiv = function(text){

      // console.log(text)
      var div = document.createElement('div');
      div.id = "tipping_setup"
      div.setAttribute("style", "font-size:1em;border: 1px solid #6d8191;border-radius: 5px;background-color: rgba(240, 238, 238, 0.3);");

      /* border: solid lightblue 0.5px; */

      //div.attr('style,'{'background-color': black});
      //div.classList.add('popp');
      div.innerHTML = ""
      for (const [key, value] of Object.entries(text)) {
        if(key!='parent' && key!='color' && key!='IPv6 address' && key!='Mask 6' && key!='NAT Properties' && key!='Name'){
        div.innerHTML = div.innerHTML+key.toString()+" : "+value.toString()+"<br />"
      }
      }
      //div.innerHTML = text;
      //document.getElementById('cy').appendChild( div );
      //document.body.appendChild( div );
      document.getElementById('cy').appendChild( div );
      return div;
    };

    var popperA = a.popper({
        content: function(){ return makeDiv(a.data()); }
      });

    var updateA = function(){
      popperA.scheduleUpdate();
    };

    cy.on('position', updateA);
    cy.on('pan zoom resize', updateA);
  }
  catch{
    console.log("some error in mouseover function")
  }
});

//on MouseOut function
  cy.$('node').on('mouseout', function () {
    try{
    var todelete = document.getElementById('tipping_setup')
    todelete.parentNode.removeChild(todelete);
  }
  catch{
    console.log("some error in mouse out")
  }
  });



  var api = cy.expandCollapse('get')
  this.collapseall()



cy.fit()
cy.resize()

// console.log(this.isLoadingHidden)

} //redraw_grp function close



/** Example trail function below */
// <b id="collapseAll" (click)="collapseall()" style="cursor: pointer;color: darkred">Collapse all</b>
collapseall() {
  console.log("collapse all called")
  // api.collapseAll();
  // layout.run();
  // this.ELEMENT_DATA = [
  //   {position: 1, name: 'Hydrogenddddddddd ddddd dd dddd dddddddddddd ddddddd ddddddddddddd d dddddd', weight: 1.0079, symbol: 'H'},
  //   {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  //   {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'}
  // ];
  // this.dataSource.data =this.ELEMENT_DATA;
  // this.table.renderRows();
  // var todelete = document.getElementById('rulestable')
  //     todelete.parentNode.removeChild(todelete);
  //this.dataSource.data = this.ELEMENT_DATA;

    // this.myService.doSomething().subscribe((this.ELEMENT_DATA: MyDataType[]) => {
    //   this.dataSource.data = this.ELEMENT_DATA;
    // }

  //this.changeDetectorRefs.detectChanges();
}

} //AppComponent close
