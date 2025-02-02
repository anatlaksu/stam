/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
import React, { useMemo, useState, useEffect } from "react";
import {
	useTable,
	useSortBy,
	useGlobalFilter,
	useFilters,
	usePagination,
} from "react-table";
import {
	Button,
	Card,
	CardHeader,
	Container,
	CardBody,
	FormGroup,
	Form,
	Input,
	InputGroupAddon,
	InputGroupText,
	InputGroup,
	Row,
	Col,
	Collapse,
} from "reactstrap";
import { withRouter, Redirect, Link } from "react-router-dom";
import { COLUMNSSUM } from "./ColumnsSum";
import { GlobalFilter } from "./GlobalFilter";
import CarDataFormModal from "views/divoah/CarDataFormModal";
import CarDataFormModalView from "views/divoah/CarDataFormModalView";
import axios from "axios";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { isAuthenticated } from "auth";
import history from "history.js";
import { toast } from "react-toastify";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const SortingTableHamal = ({ match }) => {
	const columns = useMemo(() => COLUMNSSUM, []);
	const { user } = isAuthenticated();
	const [data, setData] = useState([]);

	const [originaldata, setOriginaldata] = useState([])
	
	const [isError, setIsError] = useState(false);
	const [over30, setover30] = useState(false);
	
	//* the difference between the date the report was created and the date the incident happened
	const [diff, setDiff] = useState([]);
	//* check if the report was created for more than 30 days
	const [expired, setExpired] = useState([]);
	//*cardata form modal
	const [iscardataformopen, setIscardataformopen] = useState(false);
	const [cardataidformodal, setCardataidformodal] = useState(undefined);
	//* view modal
	const [isviewmodalopen, setisviewmodalopen] = useState(false);
	const [viewmodalid, setViewmodalid] = useState(undefined);

	const [gdodsop, setGdodsop] = useState([]);
	const [hativasop, setHativasop] = useState([]);
	const [ogdasop, setOgdasop] = useState([]);
	const [pikodsop, setPikodsop] = useState([]);

	const [gdods, setGdods] = useState([]);
	const [hativas, setHativas] = useState([]);
	const [ogdas, setOgdas] = useState([]);
	const [pikods, setPikods] = useState([]);

	const [gdodsrep, setGdodsrep] = useState([]);
	const [hativasrep, setHativasrep] = useState([]);
	const [ogdasrep, setOgdasrep] = useState([]);
	const [pikodsrep, setPikodsrep] = useState([]);

	  //excel download
	  const XLSX = require('xlsx')

	const [reportDB, setReportDB] = useState([]);
	// const [reportDBPikod, setReportDBPikod] = useState([]);
//* get gdod
//* set gdod fillter
const [gdodsfillter, setGdodsfillter] = useState([]);

	const [date, setDate] = useState([]);
	const [tyevent, setTyevent] = useState([]);
	const [dataunit, setDataunit] = useState([]);
	const [sinono, setSinono] = useState([]);

	const [collapseOpen, setcollapseOpen] = React.useState(false);
	const toggleCollapse = () => {
		setcollapseOpen(!collapseOpen);
	};

		const loadPikods = async () => {
		await axios
			.get("http://localhost:8000/api/pikod")
			.then((response) => {
				setPikods(response.data);
				// setPikodsrep(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const loadOgdas = async (pikodids) => {
		let temppikodids = pikodids;
		if (temppikodids != undefined && !temppikodids.isArray) {
			temppikodids = [pikodids];
		}
		let temppikodsogdas = [];
		if (temppikodids != undefined && temppikodids.length > 0) {
			for (let i = 0; i < temppikodids.length; i++) {
				await axios
					.post("http://localhost:8000/api/ogda/ogdasbypikodid", {
						pikod: temppikodids[i],
					})
					.then((response) => {
						for (let j = 0; j < response.data.length; j++)
							temppikodsogdas.push(response.data[j]);
					})
					.catch((error) => {
						console.log(error);
					});
			}
		}
		setOgdas(temppikodsogdas);
		// setOgdasrep(temppikodsogdas);
	};

	const loadHativas = async (ogdaids) => {
		let tempogdaids = ogdaids;
		if (tempogdaids != undefined && !tempogdaids.isArray) {
			tempogdaids = [ogdaids];
		}
		let tempogdashativas = [];
		if (tempogdaids != undefined && tempogdaids.length > 0) {
			for (let i = 0; i < tempogdaids.length; i++) {
				await axios
					.post("http://localhost:8000/api/hativa/hativasbyogdaid", {
						ogda: tempogdaids[i],
					})
					.then((response) => {
						for (let j = 0; j < response.data.length; j++)
							tempogdashativas.push(response.data[j]);
					})
					.catch((error) => {
						console.log(error);
					});
			}
		}
		setHativas(tempogdashativas);
		// setHativasrep(tempogdashativas)
	};

	const loadGdods = async (hativaids) => {
		let temphativaids = hativaids;
		if (temphativaids != undefined && !temphativaids.isArray) {
			temphativaids = [hativaids];
		}
		let temphativasgdods = [];
		if (temphativaids != undefined && temphativaids.length > 0) {
			for (let i = 0; i < temphativaids.length; i++) {
				await axios
					.post("http://localhost:8000/api/gdod/gdodsbyhativaid", {
						hativa: temphativaids[i],
					})
					.then((response) => {
						for (let j = 0; j < response.data.length; j++)
							temphativasgdods.push(response.data[j]);
					})
					.catch((error) => {
						console.log(error);
					});
			}
		}
		setGdods(temphativasgdods);
		// setGdodsrep(temphativasgdods);
	};


	const loadpikodsrep = async () => {
		await axios
			.get("http://localhost:8000/api/pikod")
			.then((response) => {
				setPikodsrep(response.data);
				console.log(response.data);
				// setPikodsrep(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const loadogdasrep = async () => {
		await axios
			.get("http://localhost:8000/api/ogda")
			.then((response) => {
				setOgdasrep(response.data);
				console.log(response.data);
				// setPikodsrep(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const loadhativasrep = async () => {
		await axios
			.get("http://localhost:8000/api/hativa")
			.then((response) => {
				setHativasrep(response.data);
				console.log(response.data);
				// setPikodsrep(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const loadgdodsrep = async () => {
		await axios
			.get("http://localhost:8000/api/gdod")
			.then((response) => {
				setGdodsrep(response.data);
				console.log(response.data);
				// setPikodsrep(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	// ! alternative is to enter the timestamp to the database and then call it like we do with the other columns
	// * ------ geting only on loading the difference btween the dates --------------------------------

	// useEffect(() => {
	// 	console.log(user.personalnumber);
	// 	if (user.role == "0") {
	// 		history.push(`/historeport`);
	// 	}
	// 	// console.log(data.length);
	// 	// * ------ making the dates subtractable --------------------------------
	// 	//* created at:
	// 	const creatArray = data.map((item, index) => {
	// 		return new Date(data[index].createdAt);
	// 	});
	// 	//* the date the incident happened:
	// 	const dateArray = data.map((item, index) => {
	// 		return new Date(data[index].datevent);
	// 	});
	// 	//* today:
	// 	const today = new Date();

	// 	// * ---------- makeing sure that there are not any problems --------------------------------
	// 	try {
	// 		setDiff(
	// 			creatArray.map((item, index) => {
	// 				//* ~~ == Math.floor
	// 				return ~~(
	// 					(creatArray[index].getTime() - dateArray[index].getTime()) /
	// 					86400000
	// 				);
	// 			})
	// 		);
	// 		// console.log(diff);
	// 		// todo: maybe to reload the page if error
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// 	try {
	// 		setExpired(
	// 			creatArray.map((item, index) => {
	// 				let sum = ~~(
	// 					(today.getTime() - creatArray[index].getTime()) /
	// 					86400000
	// 				);
	// 				// console.log(`today is ${today}`);
	// 				// console.log(creatArray[index]);
	// 				// console.log(`${sum > 30} at ${index}`);
	// 				return sum > 30;
	// 			})
	// 		);
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// 	// console.log(expired);
	// }, [data]);

	function addSelect(op) {
		let pvals = op.map ((p)=>p.value)
		if (!pvals.includes("select")) {
			op.unshift({value: "select",label: "בחר"})
		}
	}

	function setoptions(pk) {
		const temp = []
		if (pk.length != 0) {
			temp.push({value: "בחר",label: "בחר"})
		}
		pk.map((item)=>{
			let val = item._id;
			let lab = item.name;
			temp.push({ value: val, label: lab });
		})

		console.log(pk);

		switch (true) {
			case pk == pikods:
				setPikodsop(temp);
				break;
			case pk == ogdas:
				setOgdasop(temp);
				break;
			case pk == hativas:
				setHativasop(temp);
				break;
			case pk == gdods:
				setGdodsop(temp);
				break;
		
			default:
				break;
		}

		// setPikodsop(temp);
		// setOgdasop(
		// 	og.map((item, index) => {
		// 		let val = og[index]._id;
		// 		let lab = og[index].name;
		// 		return { value: val, label: lab };
		// 	})
		// );
		// setHativasop(
		// 	ht.map((item, index) => {
		// 		let val = ht[index]._id;
		// 		let lab = ht[index].name;
		// 		return { value: val, label: lab };
		// 	})
		// );
		// setGdodsop(
		// 	gd.map((item, index) => {
		// 		let val = gd[index]._id;
		// 		let lab = gd[index].name;
		// 		return { value: val, label: lab };
		// 	})
		// );
// addSelect(pk)
// addSelect(og)
// addSelect(ht)
// addSelect(gd)
	}




	function handleChange(evt) {
		const value = evt.target.value;
		console.log(evt.target.value);
		console.log(evt.target.name);
		setDate({ ...date, [evt.target.name]: value });
		console.log(date);
		console.log(new Date(date.fromdate).setHours(0, 0, 0, 0));
		console.log(date.todate);
	}

	function handleChange2(evt) {
		const value = evt.target.value;
		console.log(evt.target.value);
		console.log(evt.target.name);
		setTyevent({ ...tyevent, [evt.target.name]: value });
		console.log(tyevent.typevent);
		console.log(isNaN(tyevent.typevent));
	}
	function handleChange4(evt) {
		const value = evt.target.value;
		console.log(evt.target.value);
		console.log(evt.target.name);
		setSinono({ ...sinono, [evt.target.name]: value });
		console.log(sinono.typesinono);
		console.log(isNaN(sinono.typesinono));
	}


	// function handleChange3(evt) {
	// 	const value = evt.target.value;
	// 	console.log(evt.target.value);
	// 	console.log(evt.target.name);
	// 	setDataunit({ ...dataunit, [evt.target.name]: value });
	// 	console.log(dataunit.pikod);
	// }

	// function handleChange3(selectedOption, name) {
	// 	// console.log(selectedOption.value);
	// 	if (!(selectedOption.value == "בחר")) {
	// 		// console.log(selectedOption);
	// 		setDataunit({ ...dataunit, [name]: selectedOption.value });
	// 	} else {
	// 		let tempdata = { ...dataunit };
	// 		delete tempdata[name];
	// 		setDataunit(tempdata);
	// 	}
	// }

	function handleChange3(selectedOption, name) {
		console.log(selectedOption.value);
		console.log(name.name);
		if (!(selectedOption.value == "בחר")) {
			// let tempvalues = [];
			// let tempnames = [];
			// for (let i = 0; i < selectedOption.length; i++) {
			// 	tempvalues.push(selectedOption[i].value);
			// 	tempnames.push(selectedOption[i].label);
			// }
			// console.log(tempvalues);
			// console.log(tempnames);
			// console.log(name.name);
			// if (tempvalues.length > 0) {
				
				setDataunit({ ...dataunit, [name.name]: selectedOption.value });
				console.log(dataunit);


			// console.log(data);
			// console.log(data.pikod);
			// console.log(data.ogda);
			// console.log(data.hativa);
			// console.log(data.pikod.map((item,index) => {

			// }));
		//  else {
		// 	let tempfilter = { ...dataunit };
		// 	delete tempfilter[name];
		// 	setDataunit(tempfilter);
		// 	console.log(tempfilter);
		// }
	} 			 else {
		// console.log(name.name);
		if (name.name == "gdod") {
			addSelect(gdodsop)
			delete dataunit.gdod;
			setDataunit({ ...dataunit });
		}
		if (name.name == "hativa") {
			addSelect(hativasop)
			delete dataunit.hativa;
			setDataunit({ ...dataunit });
		}
		if (name.name == "ogda") {
			addSelect(ogdasop)
			delete dataunit.ogda;
			setDataunit({ ...dataunit });
		}	
		if (name.name == "pikod") {
			addSelect(pikodsop)
			delete dataunit.pikod;
			setDataunit({ ...dataunit });
		}
	}}


	//* ------------ modal --------------------------------

	function Toggle(evt) {
		let index = +evt.currentTarget.id;
		// console.log(index);
		// console.log(expired[index]);
		if (!evt.currentTarget.value == "") {
			// if (over30 == true) {
			// 	if (user.role == "2") {
			// 		if (evt.currentTarget.value == "") {
			// 			setCardataidformodal(undefined);
			// 		} else {
			// 			setCardataidformodal(evt.currentTarget.value);
			// 		}
			// 		setIscardataformopen(!iscardataformopen);
			// 	} else {
			// 		toast.error("עברו שלושים ימים מאז שהדוח הוזן לא ניתן לערוך אותו");
			// 	}
			// } else {
				if (evt.currentTarget.value == "") {
					setCardataidformodal(undefined);
				} else {
					setCardataidformodal(evt.currentTarget.value);
				}
				setIscardataformopen(!iscardataformopen);
			// }
		} else {
			if (evt.currentTarget.value == "") {
				setCardataidformodal(undefined);
			} else {
				setCardataidformodal(evt.currentTarget.value);
			}
			setIscardataformopen(!iscardataformopen);
			// console.log(cardataidformodal);
		}
	}

	function ToggleForModal(evt) {
		setIscardataformopen(!iscardataformopen);
		window.location.reload();
	}

	//* ------------ modal view --------------------------------

	function ToggleView(evt) {
		if (evt.currentTarget.value == "") {
			setViewmodalid(undefined);
		} else {
			setViewmodalid(evt.currentTarget.value);
		}
		setisviewmodalopen(!isviewmodalopen);
		// console.log(cardataidformodal);
	}

	function ToggleForModalView(evt) {
		setisviewmodalopen(!isviewmodalopen);
		window.location.reload();
	}

	function getname(idnum, arr) {
		for (let i = 0; i < arr.length; i++) {
			if (arr[i]._id == idnum) return arr[i].name;
		}
	}

	function getnumday(date2){
		let difference = new Date().getTime() - new Date(date2).getTime();
		let TotalDays = Math.ceil((difference / (1000 * 3600 * 24))-1);
		return TotalDays;
	}

	const filteruse=()=>{
		let beforfilter=originaldata;
		let filter1=[]; //date filterwev                                                                                                                                                                               
		if(date.fromdate && date.todate){
			filter1=beforfilter.filter((el)=> new Date(el.datevent).setHours(0, 0, 0, 0) >=
			new Date(date.fromdate).setHours(0, 0, 0, 0) &&
		    new Date(el.datevent).setHours(0, 0, 0, 0) <=
			new Date(date.todate).setHours(0, 0, 0, 0));
		}else{
			filter1=beforfilter;
		}

		let filter2=[]; //type event filter
		if(tyevent.typevent== "בחר" || tyevent.typevent== undefined){
		  filter2=filter1;
		}else{
			filter2=filter1.filter((el)=>el.typevent === tyevent.typevent);
		}

		let filter3=[]; //pikod filter
		if(dataunit.pikod=="0" || !dataunit.pikod){
			filter3=filter2;
		}else{
			filter3=filter2.filter((el)=>el.pikodrep === dataunit.pikod);
		}

		let filter4=[]; //ogda filter
		if(dataunit.ogda=="0" || !dataunit.ogda){
			filter4=filter3;
		}else{
			filter4=filter3.filter((el)=>el.ogdarep === dataunit.ogda);
		}

		let filter5=[]; //hativa filter
		if(dataunit.hativa=="0" || !dataunit.hativa){
			filter5=filter4;
		}else{
			filter5=filter4.filter((el)=>el.hativarep === dataunit.hativa);
		}

		let filter6=[]; //gdod filter
		if(dataunit.gdod=="0" || !dataunit.gdod){
			filter6=filter5;
		}else{
			filter6=filter5.filter((el)=>el.gdodrep === dataunit.gdod);
		}

		let filter7=[];//sinono filter
		if(sinono.typesinono=="בחר" || !sinono.typesinono){
			filter7=filter6;
		}else{
			if(sinono.typesinono=="1"){
				filter7=filter6.filter((el)=>el.resevent === "4")
			}
			if(sinono.typesinono=="2"){
				filter7=filter6.filter((el)=>el.datevent.substr(11, 5) === "00:00")
			}
			if(sinono.typesinono=="3"){
				filter7=filter6.filter((el)=>el.nifga === 2)
			}
			if(sinono.typesinono=="4"){
				for(let i=0;i<filter6.length;i++)
				{
					if(filter6[i].typevent ==="1" ||filter6[i].typevent ==="2" || filter6[i].typevent ==="3" ||filter6[i].typevent ==="4" || filter6[i].typevent ==="רקם" ){
						let a=0;
						let sum=0;
						while(a<filter6[i].arraymkabaz.length)
						{
							if(filter6[i].arraymkabaz[a].zadik == undefined){
								sum++;
							}
							a++;
						}
						if(sum>0){
							filter7.push(filter6[i]);
						}	
					}else if(filter6[i].typevent ==="7" ||filter6[i].typevent ==="9"){
						if(filter6[i].zadik === ""){
							filter7.push(filter6[i]);
						}
					}
				}
			}
		}

		console.log(filter7)
		setData(filter7);
		console.log(data);
	};

	function FixDataAndExportToExcel() {
		let tempdata_to_excel = [];
		for (let i = 0; i < data.length; i++) {
			tempdata_to_excel.push({ ...data[i] })
		}
	
		for (let i = 0; i < tempdata_to_excel.length; i++) {
		  tempdata_to_excel[i].pikodrep ? tempdata_to_excel[i].pikod_name = getname(tempdata_to_excel[i].pikodrep, pikodsrep) : tempdata_to_excel[i].pikod_name = " ";
		  tempdata_to_excel[i].ogdarep ? tempdata_to_excel[i].ogda_name = getname(tempdata_to_excel[i].ogdarep, ogdasrep) : tempdata_to_excel[i].ogda_name = " ";
		  tempdata_to_excel[i].hativarep ? tempdata_to_excel[i].hativa_name = getname(tempdata_to_excel[i].hativarep, hativasrep) : tempdata_to_excel[i].hativa_name = " ";
		  tempdata_to_excel[i].gdodrep ? tempdata_to_excel[i].gdod_name = getname(tempdata_to_excel[i].gdodrep, gdodsrep) : tempdata_to_excel[i].gdod_name = " ";
		  tempdata_to_excel[i].pirot ? tempdata_to_excel[i].pirot_event = tempdata_to_excel[i].pirot : tempdata_to_excel[i].pirot_event = " ";
		  tempdata_to_excel[i].typevent ? tempdata_to_excel[i].type_event = tempdata_to_excel[i].typevent : tempdata_to_excel[i].type_event = " ";

		//   tempdata_to_excel[i].latest_recalibration_date = tempdata_to_excel[i].latest_recalibration_date ? tempdata_to_excel[i].latest_recalibration_date.slice(0, 10).split("-").reverse().join("-") : null;
		//   tempdata_to_excel[i].expected_repair = tempdata_to_excel[i].expected_repair ? tempdata_to_excel[i].expected_repair.slice(0, 10).split("-").reverse().join("-") : null;
		tempdata_to_excel[i].event_date = tempdata_to_excel[i].datevent ? tempdata_to_excel[i].datevent.slice(0, 10).split("-").reverse().join("-") : null;	
		  tempdata_to_excel[i].updatedAt_data = tempdata_to_excel[i].updatedAt ? tempdata_to_excel[i].updatedAt.slice(0, 10).split("-").reverse().join("-") : null;
		}
	
		//export to excel -fix 
		for (let i = 0; i < tempdata_to_excel.length; i++) {
			//delete unwanted fields
			delete tempdata_to_excel[i]._id;
			delete tempdata_to_excel[i].pikodrep;
			delete tempdata_to_excel[i].ogdarep;
			delete tempdata_to_excel[i].hativarep;
			delete tempdata_to_excel[i].gdodrep;
			delete tempdata_to_excel[i].gdod;
			delete tempdata_to_excel[i].pirot;
			delete tempdata_to_excel[i].mikom;
			delete tempdata_to_excel[i].typevent;
			delete tempdata_to_excel[i].name;
			delete tempdata_to_excel[i].lastname;
			delete tempdata_to_excel[i].personalnumber;
			delete tempdata_to_excel[i].cellphone;
			delete tempdata_to_excel[i].mkabaz;
			delete tempdata_to_excel[i].arraymkabaz;
			delete tempdata_to_excel[i].zadik;
			delete tempdata_to_excel[i].resevent;
			delete tempdata_to_excel[i].yn;
			delete tempdata_to_excel[i].yndate;
			delete tempdata_to_excel[i].selneshek;
			delete tempdata_to_excel[i].whap;
			delete tempdata_to_excel[i].amlahtype;
			delete tempdata_to_excel[i].wnifga;
			delete tempdata_to_excel[i].rekemtype;
			delete tempdata_to_excel[i].mazavrekem;
			delete tempdata_to_excel[i].dwork;
			delete tempdata_to_excel[i].mataftype;
			delete tempdata_to_excel[i].mholaztype;
			delete tempdata_to_excel[i].lessons;
			delete tempdata_to_excel[i].totalWorkHours;
			delete tempdata_to_excel[i].totalCostWorkHours;
			delete tempdata_to_excel[i].damageCost;
			delete tempdata_to_excel[i].spareCost;
			delete tempdata_to_excel[i].nifga;
			delete tempdata_to_excel[i].hurtarray;
			delete tempdata_to_excel[i].apitype;
			delete tempdata_to_excel[i].__v;
			delete tempdata_to_excel[i].datevent;
			delete tempdata_to_excel[i].updatedAt;
			delete tempdata_to_excel[i].createdAt;
	  
			//add non-existing fields - 8
			if (!tempdata_to_excel[i].pikod_name) { tempdata_to_excel[i].pikod_name = " " }
			if (!tempdata_to_excel[i].gdod_name) { tempdata_to_excel[i].gdod_name = " " }
			if (!tempdata_to_excel[i].hativa_name) { tempdata_to_excel[i].hativa_name = " " }
			if (!tempdata_to_excel[i].ogda_name) { tempdata_to_excel[i].ogda_name = " " }
			if (!tempdata_to_excel[i].pirot_event) { tempdata_to_excel[i].pirot_event = " " }
			if (!tempdata_to_excel[i].event_date) { tempdata_to_excel[i].event_date = " " }
			if (!tempdata_to_excel[i].updatedAt_data) { tempdata_to_excel[i].updatedAt_data = " " }
			// ----------------------------- סוג אירוע --------------------------------------
			if (!tempdata_to_excel[i].type_event) { tempdata_to_excel[i].type_event = " " }
			if (tempdata_to_excel[i].type_event==="1") { tempdata_to_excel[i].type_event = "תאונת כלי רכב" }
			if (tempdata_to_excel[i].type_event==="2") { tempdata_to_excel[i].type_event = "התהפכות" }
			if (tempdata_to_excel[i].type_event==="3") { tempdata_to_excel[i].type_event = "הנתקות גלגל" }
			if (tempdata_to_excel[i].type_event==="4") { tempdata_to_excel[i].type_event = "שריפה" }
			if (tempdata_to_excel[i].type_event==="5") { tempdata_to_excel[i].type_event = 'אירוע נשו"ת' }
			if (tempdata_to_excel[i].type_event==="6") { tempdata_to_excel[i].type_event = 'תאונת עבודה אנשי טנ"א' }
			if (tempdata_to_excel[i].type_event==="7") { tempdata_to_excel[i].type_event = "פריקת מטפים" }
			if (tempdata_to_excel[i].type_event==="9") { tempdata_to_excel[i].type_event = "חילוץ" }
			if (tempdata_to_excel[i].type_event==="10") { tempdata_to_excel[i].type_event = 'נזק לתשתיות אחזקה / הח"י' }
			if (tempdata_to_excel[i].type_event==="11") { tempdata_to_excel[i].type_event = "אי קיום שגרת אחזקה" }
			if (tempdata_to_excel[i].type_event==="12") { tempdata_to_excel[i].type_event = "אחר" }
			if (tempdata_to_excel[i].type_event==="רקם") { tempdata_to_excel[i].type_event = 'רק"ם' }
		  }
	  
		console.log(tempdata_to_excel)
	
		let EXCEL_EXTENSION = '.xlsx';
		let worksheet = XLSX.WorkSheet;
		let sheetName = 'סיכום דיווחים';
	
		const headers = {
		  
		   type_event:'סוג אירוע',pirot_event:'פירוט אירוע',pikod_name:'פיקוד', ogda_name: 'אוגדה', hativa_name: 'חטיבה', gdod_name: 'גדוד',
		   updatedAt_data: 'תאריך דיווח',event_date:'תאריך אירוע'
		};
		tempdata_to_excel.unshift(headers); // if custom header, then make sure first row of data is custom header 
	
		worksheet = XLSX.utils.json_to_sheet(tempdata_to_excel, { skipHeader: true });
	
		const workbook = XLSX.utils.book_new();
		const fileName = 'סיכום דיווחים' + EXCEL_EXTENSION;
		XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
		XLSX.writeFile(workbook, fileName);
	
		window.location.reload();
	  }
	

	const loadReports = () => {
		user.role === "2"
			? axios
					.get(`http://localhost:8000/report/`)
					.then((response) => {
						const reports = response.data;
						reports.reverse();
						// console.log(reports);
						setData(reports);
						setOriginaldata(reports)
					})
					.catch((error) => {
						console.log(error);
						setIsError(true);
					})
			: axios
					.get(`http://localhost:8000/report/pikod/${user.pikod}`)
					.then((response) => {
						console.log(user.pikod);
						console.log(response.data);
						const reports = response.data;

						reports.reverse();
						setData(reports);
						setOriginaldata(reports)
					})
					.catch((error) => {
						console.log(error);
						setIsError(true);
					});
	};

	useEffect(() => {
		loadgdodsrep();
		loadhativasrep();
		loadogdasrep();
		loadpikodsrep();
		loadPikods();
		loadReports();
	}, []);

	useEffect(() => {
// loadReports();
filteruse();
	}, [date,dataunit,tyevent,sinono]);

	// useEffect (() => {
	// 			pikodsop.unshift({value: "select",label: "בחר"})
	// 	ogdasop.unshift({value: "select",label: "בחר"})
	// 	hativasop.unshift({value: "select",label: "בחר"})
	// 	gdodsop.unshift({value: "select",label: "בחר"})
	// },[])




	// useEffect(() => {
	// 	// console.log("check");
		
	// 	console.log(gdodsfillter);
	// 	console.log(gdodsop);
	// 	// console.log(gdodsop.map((op) => op.value ));
	// 	let gdodopvals = gdodsop.map((op) => op.value)
	// 	if (!gdodopvals.includes("select")) {
	// 		gdodsop.unshift({value: "select",label: "בחר"})

	// 	}
	// 	if (gdodsfillter.gdod != undefined || gdodsfillter.gdod != null) {
	// 		setData(data.filter((rep) =>gdodsfillter.gdod == rep.gdod))
	// 		if (data.length == 0) {
	// 			loadReports()
	// 		}
	// 	} else {
	// 		loadReports()
	// 	} if (gdodsfillter.gdod == "select") {
	// 		loadReports()
	// 	}

	// }, [gdodsfillter]);

	useEffect(() => {
		setOgdas([]);
		loadOgdas(dataunit.pikod);
	}, [dataunit.pikod]);

	useEffect(() => {
		setHativas([]);
		loadHativas(dataunit.ogda);
	}, [dataunit.ogda]);

	useEffect(() => {
		setGdods([]);
		loadGdods(dataunit.hativa);
	}, [dataunit.hativa]);

	useEffect(() => {
		console.log(dataunit);
		// console.log(pikods);
		// console.log(ogdas);
		// console.log(hativas);
		// console.log(gdods);
		// pikodsop.unshift({value: "select",label: "בחר"})
		// ogdasop.unshift({value: "select",label: "בחר"})
		// hativasop.unshift({value: "select",label: "בחר"})
		// gdodsop.unshift({value: "select",label: "בחר"})
		setoptions(pikods);
		setoptions(ogdas);
		setoptions(hativas);
		setoptions(gdods);


		// console.log(pikodsop);
	}, [gdods, hativas, ogdas, pikods]);

	// useEffect (() => {
	// 	pikodsop.unshift({value: "select",label: "בחר"})
	// },[dataunit])

	// useEffect(()=> {
	// 	console.log(pikodsop);
	// },[pikodsop])

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		footerGroups,

		page,
		prepareRow,
		canPreviousPage,
		canNextPage,
		pageOptions,
		pageCount,
		gotoPage,
		nextPage,
		previousPage,
		setPageSize,
		state: { pageIndex, pageSize, globalFilter },
		setGlobalFilter,
	} = useTable(
		{
			columns,
			data,
			initialState: { pageIndex: 0 },
		},

		useGlobalFilter,
		useFilters,
		useSortBy,
		usePagination
	);

	return (
		<>
			<Row>
				<div style={{ width: "100%", margin: "auto", textAlign: "right" }}>
					<Button
						onClick={toggleCollapse}
						style={{}}
					>
						סינון
					</Button>
					<Collapse isOpen={collapseOpen}>
						<Card style={{ background: "rgb(255, 255, 255)" }}>
							<Row style={{ margin: "0px" }}>
								<Col
									xs={12}
									md={8}
									style={{ textAlign: "right" }}
								>
									<Row>
										<Col
											xs={12}
											md={6}
										>
											<div style={{ textAlign: "right" }}>אירועים מתאריך</div>
											<Input
												placeholder="תאריך התחלה"
												type="date"
												name="fromdate"
												value={date.fromdate}
												onChange={handleChange}
											/>
										</Col>
										<Col
											xs={12}
											md={6}
										>
											<div style={{ textAlign: "right" }}>עד אירועים מתאריך</div>
											<Input
												placeholder="תאריך סיום"
												type="date"
												name="todate"
												value={date.todate}
												onChange={handleChange}
											/>
										</Col>
									</Row>
									
								</Col>
							</Row>
							<Row style={{ margin: "0px" }}>
								<Col
									xs={12}
									md={8}
									style={{ textAlign: "right" }}
								>
										<Row style={{ paddingTop: "2px" }}>
										{!dataunit.ogda ? (
											<Col
												style={{
													justifyContent: "right",
													alignContent: "right",
													textAlign: "right",
												}}
											>
												<h6>פיקוד</h6>
												<Select
												options={pikodsop}
													// dataunit={pikods}
													onChange={handleChange3}
													name={"pikod"}
													val={dataunit.pikod ? dataunit.pikod : undefined}
												/>
											</Col>
										) : (
											<Col
												style={{
													justifyContent: "right",
													alignContent: "right",
													textAlign: "right",
												}}
											>
												<h6>פיקוד</h6>
												<Select
												options={pikodsop}
													// dataunit={pikods}
													onChange={handleChange3}
													name={"pikod"}
													val={dataunit.pikod ? dataunit.pikod : undefined}
													isDisabled={true}
												/>
											</Col>
										)}

										<>
											{dataunit.pikod && !dataunit.hativa ? (
												<Col
													style={{
														justifyContent: "right",
														alignContent: "right",
														textAlign: "right",
													}}
												>
													<h6>אוגדה</h6>
													<Select
													options={ogdasop}
														// dataunit={ogdas}
														onChange={handleChange3}
														name={"ogda"}
														val={dataunit.ogda ? dataunit.ogda : undefined}
													/>
												</Col>
											) : (
												<Col
													style={{
														justifyContent: "right",
														alignContent: "right",
														textAlign: "right",
													}}
												>
													<h6>אוגדה</h6>
													<Select
													options={ogdasop}
														// dataunit={ogdas}
														onChange={handleChange3}
														name={"ogda"}
														val={dataunit.ogda ? dataunit.ogda : undefined}
														isDisabled={true}
													/>
												</Col>
											)}
										</>

										<>
											{dataunit.ogda && !dataunit.gdod ? (
												<Col
													style={{
														justifyContent: "right",
														alignContent: "right",
														textAlign: "right",
													}}
												>
													<h6>חטיבה</h6>
													<Select
													options={hativasop}
														// dataunit={hativas}
														onChange={handleChange3}
														name={"hativa"}
														val={dataunit.hativa ? dataunit.hativa : undefined}
													/>
												</Col>
											) : (
												<Col
													style={{
														justifyContent: "right",
														alignContent: "right",
														textAlign: "right",
													}}
												>
													<h6>חטיבה</h6>
													<Select
													options={hativasop}
														// dataunit={hativas}
														onChange={handleChange3}
														name={"hativa"}
														val={dataunit.hativa ? dataunit.hativa : undefined}
														isDisabled={true}
													/>
												</Col>
											)}
										</>

										<>
											{dataunit.hativa ? (
												<Col
													style={{
														justifyContent: "right",
														alignContent: "right",
														textAlign: "right",
													}}
												>
													<h6>גדוד</h6>
													<Select
													options={gdodsop}
														// dataunit={gdods}
														onChange={handleChange3}
														name={"gdod"}
														val={dataunit.gdod ? dataunit.gdod : undefined}
													/>
												</Col>
											) : (
												<Col
													style={{
														justifyContent: "right",
														alignContent: "right",
														textAlign: "right",
													}}
												>
													<h6>גדוד</h6>
													<Select
													options={gdodsop}
														// dataunit={gdods}
														onChange={handleChange3}
														name={"gdod"}
														val={dataunit.gdod ? dataunit.gdod : undefined}
														isDisabled={true}
													/>
												</Col>
											)}
										</>
									</Row>

								</Col>
							</Row>

{/* -------------------------------------------------- only for check units filter -------------------------------------*/}
                            {/* <Row style={{ margin: "0px" }}>
							<Col md={2}>
							<div style={{ textAlign: "right", paddingTop: "10px" }}>
								פיקוד
									</div>
										<Input
											type="select"
											name="pikod"
											value={dataunit.pikod}
											onChange={handleChange3}
										>
											<option value={"0"}>בחר</option>
											<option value={"63ad7546bdb0b1acb193b346"}>דרום</option>
											<option value={"63c55bebfb8c1544be100722"}>צפון</option>
										</Input>
							</Col>
							<Col md={2}>
							<div style={{ textAlign: "right", paddingTop: "10px" }}>
								אוגדה
									</div>
										<Input
											type="select"
											name="ogda"
											value={dataunit.ogda}
											onChange={handleChange3}
										>
											<option value={"0"}>בחר</option>
											<option value={"63c658a1fb8c1544be100728"}>1</option>
											<option value={"63c658edfb8c1544be10072c"}>2</option>
											<option value={"63c65949fb8c1544be10072f"}>3</option>
											<option value={"63c6596efb8c1544be100730"}>4</option>
										</Input>
							</Col>
							<Col md={2}>
							<div style={{ textAlign: "right", paddingTop: "10px" }}>
								חטיבה
									</div>
										<Input
											type="select"
											name="hativa"
											value={dataunit.hativa}
											onChange={handleChange3}
										>
											<option value={"0"}>בחר</option>
											<option value={"63c659e1fb8c1544be100732"}>11</option>
											<option value={"63c65a1efb8c1544be100735"}>12</option>
											<option value={"63c65a50fb8c1544be100739"}>21</option>
											<option value={"63c65a78fb8c1544be10073a"}>22</option>
											<option value={"63c65ab3fb8c1544be10073d"}>31</option>
											<option value={"63c65acffb8c1544be10073e"}>32</option>
										</Input>
							</Col>
							<Col md={2}>
							<div style={{ textAlign: "right", paddingTop: "10px" }}>
								גדוד
									</div>
										<Input
											type="select"
											name="gdod"
											value={dataunit.gdod}
											onChange={handleChange3}
										>
											<option value={"0"}>בחר</option>
											<option value={"63c66e93fb8c1544be100746"}>111</option>
											<option value={"63c66ecffb8c1544be100749"}>112</option>
											<option value={"63c66f3dfb8c1544be10074d"}>121</option>
											<option value={"63c66f6ffb8c1544be10074e"}>122</option>
											<option value={"63c6700cfb8c1544be100755"}>212</option>
											<option value={"63c673d9fb8c1544be10075f"}>311</option>
											<option value={"63c67409fb8c1544be100761"}>312</option>
										</Input>
							</Col>

							</Row> */}
{/* -------------------------------------------------- only for check units filter -------------------------------------*/}

							<Row style={{ margin: "0px" }}>
							<Col md={4}>
							<div style={{ textAlign: "right", paddingTop: "10px" }}>
										סוג אירוע
									</div>
										<Input
											placeholder="סוג אירוע"
											type="select"
											name="typevent"
											value={tyevent.typevent}
											onChange={handleChange2}
										>
											<option value={"בחר"}>בחר</option>
											<option value={"1"}>תאונת כלי רכב</option>
											<option value={"2"}>התהפכות</option>
											<option value={"3"}>הנתקות גלגל</option>
											<option value={"4"}>שריפה</option>
											<option value={"5"}>אירוע נשו"ת</option>
											<option value={"6"}>תאונת עבודה אנשי טנ"א</option>
											<option value={"7"}>פריקת מטפים</option>
											<option value={"9"}>חילוץ</option>
											<option value={"10"}>נזק לתשתיות אחזקה / הח"י</option>
											<option value={"11"}>אי קיום שגרת אחזקה</option>
											<option value={"12"}>אחר</option>
											<option value={"רקם"}>רק"ם</option>
										</Input>
							</Col>
							</Row>

							<Row style={{ margin: "0px" }}>
							<Col md={4}>
							<div style={{ textAlign: "right", paddingTop: "10px" }}>
							האם נדרש המשך טיפול בגלל
									</div>
										<Input
											placeholder="האם נדרש המשך טיפול בגלל"
											type="select"
											name="typesinono"
											value={sinono.typesinono}
											onChange={handleChange4}
										>
											<option value={"בחר"}>בחר</option>
											<option value={"1"}>סיבת אירוע חסרה</option>
											<option value={"2"}>שעת אירוע לא ידועה</option>
											<option value={"3"}>לא ידוע על נפגעים</option>
											<option value={"4"}>צ' לא ידוע</option>
										</Input>
							</Col>
							</Row>

						</Card>
					</Collapse>
				</div>
			</Row>

			{/* <div style={{ float: "right", paddingBottom: "5px" }}>
				<ReactHTMLTableToExcel
					id="test-table-xls-button"
					className="btn-green"
					table="table-to-xls"
					filename="קובץ - סיכום דיווחים"
					sheet="קובץ - סיכום דיווחים"
					buttonText="הורד כקובץ אקסל"
					style={{ float: "right" }}
				/>
			</div> */}

			<div style={{ float: 'right', paddingBottom: '5px' }}>
            <button className="btn-green" onClick={FixDataAndExportToExcel}>הורד כקובץ אקסל</button>
           </div>


			{/*//* ----- modals --------------------------------
				//? ++ unittype={props.unittype} unitid={props.unitid} */}
			<CarDataFormModal
				style={{
					minHeight: "100%",
					maxHeight: "100%",
					minWidth: "60%",
					maxWidth: "70%",
					justifyContent: "center",
					alignSelf: "center",
					direction: "rtl",
				}}
				isOpen={iscardataformopen}
				cardataid={cardataidformodal}
				Toggle={Toggle}
				ToggleForModal={ToggleForModal}
			/>
			<CarDataFormModalView
				style={{
					minHeight: "100%",
					maxHeight: "100%",
					minWidth: "60%",
					maxWidth: "70%",
					justifyContent: "center",
					alignSelf: "center",
					direction: "rtl",
				}}
				isOpen={isviewmodalopen}
				cardataid={viewmodalid}
				Toggle={ToggleView}
				ToggleForModal={ToggleForModalView}
			/>

			<GlobalFilter
				filter={globalFilter}
				setFilter={setGlobalFilter}
			/>
			<div
				className="table-responsive"
				style={{ overflow: "auto" }}
			>
				<table
					id="table-to-xls"
					{...getTableProps()}
				>
					<thead>
						{headerGroups.map((headerGroup) => (
							<tr {...headerGroup.getHeaderGroupProps()}>
								{headerGroup.headers.map((column) => (
									<th style={{ width: "12.5%" }}>
										<div
											{...column.getHeaderProps(column.getSortByToggleProps())}
										>
											{" "}
											{column.render("Header")}{" "}
										</div>
										<div>
											{column.canFilter ? column.render("Filter") : null}
										</div>
										<div>
											{column.isSorted
												? column.isSortedDesc
													? "🔽"
													: "⬆️"
												: ""}
										</div>
									</th>
								))}
								<th>עדכן</th>
								<th>צפייה</th>
							</tr>
						))}
					</thead>
					<tbody {...getTableBodyProps()}>
							{/* added an index so i could pull the diff for each row */}
							{page
							.map((row, index) => {
								prepareRow(row);
								return (
									<tr {...row.getRowProps()}>
										{row.cells.map((cell) => {
											if (
												cell.column.id != "typevent" &&
												cell.column.id != "pirot" &&
												cell.column.id != "createdAt" &&
												cell.column.id != "datevent" &&
												cell.column.id != "difftime" &&
												cell.column.id != "tipul"&&
												cell.column.id != "pikodrep"&&
												cell.column.id != "ogdarep"&&
												cell.column.id != "hativarep"&&
												cell.column.id != "gdodrep"
											) {
												return (
													<td {...cell.getCellProps()}>
														{cell.render("Cell")}
													</td>
												);
											} else {
												if (cell.column.id == "typevent") {
													if (cell.value == "1") return <td>תאונת כלי רכב</td>;
													if (cell.value == "2") return <td>התהפכות</td>;
													if (cell.value == "3") return <td>הנתקות גלגל</td>;
													if (cell.value == "4") return <td>שריפה</td>;
													if (cell.value == "5")
														return <td>אירוע נשו"ת</td>;
													if (cell.value == "6")
														return <td>תאונת עבודה אנשי טנ"א</td>;
													if (cell.value == "7") return <td>פריקת מטפים</td>;
													if (cell.value == "9") return <td>חילוץ</td>;
													if (cell.value == "10")
														return <td>נזק לתשתיות אחזקה / הח"י</td>;
													if (cell.value == "11")
														return <td>אי קיום שגרת אחזקה</td>;
													if (cell.value == "12") return <td>אחר</td>;
													if (cell.value == "רקם") return <td>רק"ם</td>;
												}
												if (cell.column.id == "pirot") {
													return (
														<td>
															<div
																style={{
																	width: "100%",
																	height: "60px",
																	margin: "0",
																	padding: "0",
																	overflow: "auto",
																}}
															>
																{cell.value}
															</div>
														</td>
													);
												}

												if (cell.column.id == "pikodrep") {
													return <td>{getname(cell.value,pikodsrep)}</td>;
												}
												if (cell.column.id == "ogdarep") {
													return <td>{getname(cell.value,ogdasrep)}</td>;
												}
												if (cell.column.id == "hativarep") {
													return <td>{getname(cell.value,hativasrep)}</td>;
												}
												if (cell.column.id == "gdodrep") {
													return <td>{getname(cell.value,gdodsrep)}</td>;
												}



												if (cell.column.id == "createdAt") {
													return (
														<td>
															{cell.value
																.slice(0, 10)
																.split("-")
																.reverse()
																.join("-")}
														</td>
													);
												}

												if (cell.column.id == "datevent") {
													return (
														<td>
															{cell.value
																.slice(0, 10)
																.split("-")
																.reverse()
																.join("-")}
														</td>
													);
												}

												// * ------------- added difftime --------------------------------

												if (cell.column.id == "difftime") {
													if(getnumday(row.original.datevent)>30)
													  return <td>30+</td>;
													  else{
														return <td>{getnumday(row.original.datevent)}</td>;

													  }
												}
												if (cell.column.id == "tipul") {
													const hour = row.original.datevent.substr(11, 5);
													if(row.original.typevent ==="1" ||row.original.typevent ==="2" || row.original.typevent ==="3" ||row.original.typevent ==="4" || row.original.typevent ==="רקם" ){
														let i=0;
														let sum=0;
														while(i<row.original.arraymkabaz.length)
														{
															if(row.original.arraymkabaz[i].zadik == undefined){
																sum++;
															}
															i++;
														}
														if(sum>0 && row.original.resevent === "4" &&
														row.original.nifga === 2 && hour === "00:00")
														  return <td>צ' לא ידוע, סיבת אירוע חסרה, לא ידוע על נפגעים, שעת אירוע לא ידועה</td>;
														  else {
															if(sum>0 && row.original.resevent === "4" &&
															row.original.nifga === 2)
															  return <td>צ' לא ידוע, סיבת אירוע חסרה, לא ידוע על נפגעים</td>;
															  else {
																if(sum>0 && row.original.resevent === "4" &&
																hour === "00:00")
																  return <td>צ' לא ידוע, סיבת אירוע חסרה, שעת אירוע לא ידועה</td>;
																  else {
																	if(row.original.resevent === "4" && row.original.nifga === 2 &&
																	hour === "00:00")
																	  return <td>סיבת אירוע חסרה, לא ידוע על נפגעים, שעת אירוע לא ידועה</td>;
																	  else {
																		if(sum>0 && row.original.nifga === 2 &&
																			hour === "00:00")
																		  return <td>צ' לא ידוע, לא ידוע על נפגעים, שעת אירוע לא ידועה</td>;
																		  else {
																			if(sum>0 && hour === "00:00")
																				  return <td>צ' לא ידוע, שעת אירוע לא ידועה</td>;
																				  else {
																					if(sum>0 && row.original.nifga === 2)
																						  return <td>צ' לא ידוע, לא ידוע על נפגעים</td>;
																						  else {
																							if(sum>0 && row.original.resevent === "4")
																							return <td>צ' לא ידוע, סיבת אירוע חסרה</td>;
																							else {
																								if(row.original.nifga === 2 && row.original.resevent === "4")
																								return <td>לא ידוע על נפגעים, סיבת אירוע חסרה</td>;
																								else {
																									if(hour === "00:00" && row.original.resevent === "4")
																									return <td>שעת אירוע לא ידועה, סיבת אירוע חסרה</td>;
																									else {
																										if(hour === "00:00" && row.original.nifga === 2)
																										return <td>שעת אירוע לא ידועה, לא ידוע על נפגעים</td>;
																										else {
																										  if (row.original.resevent === "4")
																											  return <td>סיבת אירוע חסרה</td>;
																										  else {
																											  if (row.original.nifga === 2)
																												  return <td>לא ידוע על נפגעים</td>;
																											  else {
																												  if(sum>0)
																														return <td>צ' לא ידוע</td>;
																												  else {
																													if(hour === "00:00")
																													return <td>שעת אירוע לא ידועה</td>;
																											  else return <td>לא</td>;

																												  }
																											  }
																										  }
																									  }
																									  }
																								  }
																							  }
																						  }
																						}
																				}
																				}
																	}
																}
															}
													}
													else
													if(row.original.typevent ==="7" ||row.original.typevent ==="9"){
														if(row.original.zadik === "" && row.original.nifga === 2 && hour === "00:00")
														   return <td>צ' לא ידוע, לא ידוע על נפגעים, שעת אירוע לא ידועה</td>;
														else{
															if(row.original.zadik === "" && row.original.nifga === 2)
															return <td>צ' לא ידוע, לא ידוע על נפגעים</td>;
														 else{
															if(row.original.zadik === "" && hour === "00:00")
															return <td>צ' לא ידוע, שעת אירועה לא ידועה</td>;
														 else{
															if(row.original.nifga === 2 && hour === "00:00")
															return <td>לא ידוע על נפגעים, שעת אירועה לא ידועה</td>;
														 else{
															 if(row.original.zadik === "")
															 return <td>צ' לא ידוע</td>;
															 else {
																 if (row.original.nifga === 2)
																	 return <td>לא ידוע על נפגעים</td>;
																 else {
																	if (hour === "00:00")
																	return <td>שעת אירוע לא ידועה</td>;
																else return <td>לא</td>;

																 }
															 }
														 }
														 }
														 }
														 }
													}else
													if (
														row.original.resevent === "4" &&
														row.original.nifga === 2 &&
														hour === "00:00"
													)
														return <td>סיבת אירוע חסרה, לא ידוע על נפגעים, שעת אירוע אינה ידועה</td>;
													else {
														if (
															row.original.resevent === "4" &&
															row.original.nifga === 2
														)
															return <td>סיבת אירוע חסרה, לא ידוע על נפגעים</td>;
														else{
															if (
																row.original.resevent === "4" &&
																hour === "00:00"
															)
																return <td>סיבת אירוע חסרה, שעת אירוע אינה ידועה</td>;
															else{
																if (
																	row.original.nifga === 2 &&
																	hour === "00:00"
																)
																	return <td>לא ידוע על נפגעים, שעת אירוע אינה ידועה</td>;
																else{
																if (row.original.resevent === "4")
																	return <td>סיבת אירוע חסרה</td>;
																else {
																	if (row.original.nifga === 2)
																		return <td>לא ידוע על נפגעים</td>;
																	else {
																		if (hour === "00:00")
																		return <td>שעת אירוע אינה ידועה</td>;
																	    else return <td>לא</td>;

																	}
																}
															}
														}
	
													}
													}
												}
											}
										})}
										{/*//* -------- update report --------------- */}
										{row.original.typevent != "רקם" ? (
											<td role="cell">
												{" "}
												<div
													style={{
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
													}}
												>
													{" "}
													{/* {console.log(row.original.typevent)} */}
													{/* <Link to={`/editreport/${row.original._id}`}> */}
													<Button
														id={row.index}
														value={row.original._id}
														onClick={Toggle}
													>
														עדכן
													</Button>
												</div>{" "}
											</td>
										) : (
											<td role="cell">
												{" "}
												<div
													style={{
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
													}}
												>
													{" "}
													{/* {console.log(row.original.typevent)} */}
													{/* <Link to={`/editreport/${row.original._id}`}> */}
													<Button
														id={row.index}
														value={row.original._id}
														onClick={Toggle}
													>
														עדכן
													</Button>
												</div>{" "}
											</td>
										)}
										{/* // ? row.original._id=user._id*/}
										{/*//* -------- view report --------------- */}
										{row.original.typevent != "רקם" ? (
											<td role="cell">
												{" "}
												<div
													style={{
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
													}}
												>
													{" "}
													{/* // ? <button
							className="btn-new-delete"
							onClick={() => UserDelete(row.original._id)}
							>
							צפייה
							</button> */}
													{/* <Link to={`/wachreport/${row.original._id}`}> */}
													<button
														value={row.original._id}
														onClick={ToggleView}
														className="btn-new"
													>
														צפייה
													</button>
												</div>
											</td>
										) : (
											<td role="cell">
												{" "}
												<div
													style={{
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
													}}
												>
													{" "}
													{/* // ? <button
							className="btn-new-delete"
							onClick={() => UserDelete(row.original._id)}
							>
							צפייה
							</button> */}
													{/* <Link to={`/wachreportrekem/${row.original._id}`}> */}
													<button
														value={row.original._id}
														onClick={ToggleView}
														className="btn-new"
													>
														צפייה
													</button>
												</div>
											</td>
										)}
									</tr>
								);
							})}
							</tbody>
				</table>
				<div className="pagination">
					<button
						onClick={() => previousPage()}
						disabled={!canPreviousPage}
					>
						{"<"}
					</button>{" "}
					<button
						onClick={() => nextPage()}
						disabled={!canNextPage}
					>
						{">"}
					</button>{" "}
					<span>
						עמוד{" "}
						<strong>
							{pageIndex + 1} מתוך {pageOptions.length}
						</strong>{" "}
					</span>
					<span>
						| חפש עמוד:{" "}
						<input
							type="number"
							defaultValue={pageIndex + 1}
							onChange={(e) => {
								const page = e.target.value ? Number(e.target.value) - 1 : 0;
								gotoPage(page);
							}}
							style={{ width: "100px", borderRadius: "10px" }}
						/>
					</span>{" "}
					<select
						style={{ borderRadius: "10px" }}
						value={pageSize}
						onChange={(e) => {
							setPageSize(Number(e.target.value));
						}}
					>
						{[10, 20, 30, 40, 50].map((pageSize) => (
							<option
								key={pageSize}
								value={pageSize}
							>
								הראה {pageSize}
							</option>
						))}
						<option key={data.length} value={data.length}>
							הראה הכל
						</option>
					</select>
				</div>
			</div>
		</>
	);
};
export default withRouter(SortingTableHamal);
