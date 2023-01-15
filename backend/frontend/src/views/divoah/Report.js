/* eslint-disable eqeqeq */
import React, { useState, useEffect } from "react";

import { Link, withRouter, Redirect } from "react-router-dom";
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
} from "reactstrap";
import axios from "axios";
import history from "history.js";
import { toast } from "react-toastify";
import { isAuthenticated } from "auth";
import Select from "components/general/Select/AnimatedSelect";

const Report = ({ match }) => {
	const { user } = isAuthenticated();
	const [data, setData] = useState({
		name: "",
		lastname: "",
		personalnumber: "",
		cellphone: "",
		pikod: "",
		typevent: "0",
		resevent: "0",
		yn: "",
		selneshek: "0",
		whap: "0",
		amlahtype: "",
		rekemtype: "0",
		mazavrekem: "0",
		dwork: "0",
		mataftype: "0",
		apitype: "0",
		mholaztype: "0",
		status: "0",
		// mhalztype:"0",
		pirot: "",
		datevent: "",
		mikom: "",
		nifga: "",

		error: false,
		successmsg: false,
		loading: false,
		redirectToReferrer: false,
	});

	const [gdods, setGdods] = useState([]);
	const [hativas, setHativas] = useState([]);
	const [ogdas, setOgdas] = useState([]);
	const [pikods, setPikods] = useState([]);

	const [mkabazs, setMkabazs] = useState([]);
	const [magads, setMagads] = useState([]);
	const [magadals, setMagadals] = useState([]);

	const getMagadals = async () => {
		await axios
			.get(`http://localhost:8000/api/magadal`)
			.then((response) => {
				setMagadals(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const getMagads = async (magadalid) => {
		let tempmagadalsmagads = [];
		if (magadalid != undefined) {
			await axios
				.get(`http://localhost:8000/api/magad/magadsbymagadal/${magadalid}`)
				.then((response) => {
					for (let j = 0; j < response.data.length; j++)
						tempmagadalsmagads.push(response.data[j]);
				})
				.catch((error) => {
					console.log(error);
				});
			setMagads(tempmagadalsmagads);
		}
	};

	const getMkabazs = async (magadid) => {
		let tempmagadmkabazs = [];
		if (magadid != undefined) {
			await axios
				.get(`http://localhost:8000/api/mkabaz/mkabazsbymagad/${magadid}`)
				.then((response) => {
					for (let j = 0; j < response.data.length; j++)
						tempmagadmkabazs.push(response.data[j]);
				})
				.catch((error) => {
					console.log(error);
				});
			setMkabazs(tempmagadmkabazs);
		}
	};

	const loadPikods = async () => {
		await axios
			.get("http://localhost:8000/api/pikod")
			.then((response) => {
				setPikods(response.data);
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
	};

	function handleChange(evt) {
		const value = evt.target.value;
		setData({ ...data, [evt.target.name]: value });
	}

	function handleChange2(selectedOption, name) {
		if (!(selectedOption.value == "בחר"))
			setData({ ...data, [name]: selectedOption.value });
		else {
			let tempdata = { ...data };
			delete tempdata[name];
			setData(tempdata);
		}
	}

	const clickSubmit = (event) => {
		CheckSignUpForm(event);
	};

	const CheckSignUpForm = (event) => {
		event.preventDefault();
		var flag = true;
		var ErrorReason = "";

		if (data.name == "") {
			flag = false;
			ErrorReason += " שם ריק \n";
		}
		if (data.lastname == "") {
			flag = false;
			ErrorReason += " שם משפחה ריק \n";
		}
		if (data.personalnumber == "") {
			flag = false;
			ErrorReason += " מס אישי ריק \n";
		}
		if (data.cellphone == "") {
			flag = false;
			ErrorReason += " טלפון ריק \n";
		}

		// if (
		//   document.getElementById("pikod").options[
		//     document.getElementById("pikod").selectedIndex
		//   ].value == "0"
		// ) {
		//   flag = false;
		//   ErrorReason += " פיקוד ריק \n";
		// }
		// if (
		//   document.getElementById("ogda").options[
		//     document.getElementById("ogda").selectedIndex
		//   ].value == "0"
		// ) {
		//   flag = false;
		//   ErrorReason += " אוגדה ריק \n";
		// }
		// if (
		//   document.getElementById("hativa").options[
		//     document.getElementById("hativa").selectedIndex
		//   ].value == "0"
		// ) {
		//   flag = false;
		//   ErrorReason += " חטיבה ריק \n";
		// }
		// if (
		//   document.getElementById("gdod").options[
		//     document.getElementById("gdod").selectedIndex
		//   ].value == "0"
		// ) {
		//   flag = false;
		//   ErrorReason += " גדוד ריק \n";
		// }

		if (
			document.getElementById("seltype").options[
				document.getElementById("seltype").selectedIndex
			].value == "בחר"
		) {
			flag = false;
			ErrorReason += " סוג אירוע ריק \n";
		}

		if (
			data.typevent === "1" ||
			data.typevent === "2" ||
			data.typevent === "3" ||
			data.typevent === "4"
		) {
			if (
				document.getElementById("res").options[
					document.getElementById("res").selectedIndex
				].value == "0"
			) {
				flag = false;
				ErrorReason += "סיבת האירוע ריקה \n";
			}
			if (
				!document.getElementById("YES").checked &&
				!document.getElementById("NO").checked
			) {
				flag = false;
				ErrorReason += " ,אם נגרם נזק לכלי ריק \n";
			}
			if (
				!document.getElementById("delt").checked &&
				!document.getElementById("notDelt").checked
			) {
				flag = false;
				ErrorReason += " ,    סטטוס ריק\n";
			}
		}
		if (data.typevent === "5") {
			if (
				document.getElementById("neshek").options[
					document.getElementById("neshek").selectedIndex
				].value == "0"
			) {
				flag = false;
				ErrorReason += "סוג הנשק ריק \n";
			}
			if (
				!document.getElementById("YES").checked &&
				!document.getElementById("NO").checked
			) {
				flag = false;
				ErrorReason += " ,אם נגרם נזק ריק \n";
			}
			if (
				!document.getElementById("delt").checked &&
				!document.getElementById("notDelt").checked
			) {
				flag = false;
				ErrorReason += " סטטוס ריק   \n";
			}

			if (
				document.getElementById("what").options[
					document.getElementById("what").selectedIndex
				].value == "0"
			) {
				flag = false;
				ErrorReason += " מה התרחש באירוע ריק \n";
			}
		}
		if (data.typevent === "6") {
			if (
				document.getElementById("when").options[
					document.getElementById("when").selectedIndex
				].value == "0"
			) {
				flag = false;
				ErrorReason += "מתי הנפגע ריק \n";
			}
			if (data.amlah == "") {
				flag = false;
				ErrorReason += " סוג האמלח ריק \n";
			}
		}
		if (data.typevent === "7") {
			if (
				document.getElementById("mataf").options[
					document.getElementById("mataf").selectedIndex
				].value == "0"
			) {
				flag = false;
				ErrorReason += "סוג מטף ריק \n";
			}
			if (
				document.getElementById("rekem").options[
					document.getElementById("rekem").selectedIndex
				].value == "0"
			) {
				flag = false;
				ErrorReason += " סוג הרק'ם ריק \n";
			}
			if (
				document.getElementById("mazav").options[
					document.getElementById("mazav").selectedIndex
				].value == "0"
			) {
				flag = false;
				ErrorReason += "מצב הרק'ם ריק \n";
			}
			if (
				document.getElementById("dwork").options[
					document.getElementById("dwork").selectedIndex
				].value == "0"
			) {
				flag = false;
				ErrorReason += " האם בוצע במהלך עבודה ריק  \n";
			}
			if (
				!document.getElementById("YES").checked &&
				!document.getElementById("NO").checked
			) {
				flag = false;
				ErrorReason += " ,אם בפירוק / הרכבה ריק \n";
			}
		}
		if (data.typevent === "8") {
			if (
				document.getElementById("apidmia").options[
					document.getElementById("apidmia").selectedIndex
				].value == "0"
			) {
				flag = false;
				ErrorReason += "סוג אפידמיה ריק \n";
			}
		}
		if (data.typevent === "9") {
			if (
				document.getElementById("mholaz").options[
					document.getElementById("mholaz").selectedIndex
				].value == "0"
			) {
				flag = false;
				ErrorReason += "סוג הכלי המחולץ ריק \n";
			}
			// if (
			//   document.getElementById("mhalz").options[
			//     document.getElementById("mhalz").selectedIndex
			//   ].value == "0"
			// ) {
			//   flag = false;
			//   ErrorReason += "סוג הכלי המחלץ ריק \n";
			// }
		}
		if (data.pirot == "") {
			flag = false;
			ErrorReason += "  פירוט האירוע ריק \n";
		}
		if (data.mikom == "") {
			flag = false;
			ErrorReason += " ,מיקום ריק \n";
		}

		if (!data.datevent) {
			flag = false;
			ErrorReason += " ,תאריך ריק \n";
		}
		if (data.nifga == "") {
			flag = false;
			ErrorReason += "כמות הנפגעים ריקה \n";
		}

		if (flag == true) {
			SendFormData(event);
		} else {
			toast.error(ErrorReason);
		}
	};
	const SendFormData = (event) => {
		event.preventDefault();
		setData({
			...data,
			loading: true,
			successmsg: false,
			error: false,
			NavigateToReferrer: false,
		});
		const requestData = {
			name: data.name,
			lastname: data.lastname,
			personalnumber: data.personalnumber,
			cellphone: data.cellphone,
			pikod: data.pikod,
			// ogda:data.ogda,
			// hativa:data.hativa,
			// gdod:data.gdod,
			typevent: data.typevent,
			resevent: data.resevent,
			magadal: data.magadal,
			// magad:data.magad,
			// mkabaz:data.mkabaz,
			yn: data.yn,
			status:
				data.dt /* //?if there is no need for the status button ==> data.dt != undefined || null ? data.dt : "0",*/,
			selneshek: data.selneshek,
			whap: data.whap,
			amlahtype: data.amlahtype,
			rekemtype: data.rekemtype,
			mazavrekem: data.mazavrekem,
			dwork: data.dwork,
			mataftype: data.mataftype,
			apitype: data.apitype,
			mholaztype: data.mholaztype,
			// mhalztype: data.mhalztype,
			pirot: data.pirot,
			datevent: data.datevent,
			mikom: data.mikom,
			nifga: data.nifga,
		};
		console.log("In the SendFormData Func");
		console.log(requestData.status);

		console.groupCollapsed("Axios");

		axios
			.post(`http://localhost:8000/report/add`, requestData)
			.then((res) => {
				console.groupCollapsed("Axios then");
				console.log(res);
				setData({ ...data, loading: false, error: false, successmsg: true });
				toast.success(` הדיווח נשלח בהצלחה`);
				history.push(`/dash`);
				console.log(res.data);
				console.groupEnd();
			})
			.catch((error) => {
				console.groupCollapsed("Axios catch error");
				console.log(error);
				toast.error("שגיאה בשליחת הדיווח");
				setData({
					...data,
					errortype: error.response.data.error,
					loading: false,
					error: true,
				});
				console.groupEnd();
			});
		console.groupEnd();
	};

	const initWithUserData = () => {
		setData({
			...data,
			name: user.name,
			lastname: user.lastname,
			personalnumber: user.personalnumber,
		});
		loadPikods();
		getMagadals();
	};

	useEffect(() => {
		initWithUserData();
	}, []);

	useEffect(() => {
		setOgdas([]);
		loadOgdas(data.pikod);
	}, [data.pikod]);

	useEffect(() => {
		setHativas([]);
		loadHativas(data.ogda);
	}, [data.ogda]);

	useEffect(() => {
		setGdods([]);
		loadGdods(data.hativa);
	}, [data.hativa]);

	useEffect(() => {
		setMagads([]);
		getMagads(data.magadal);
	}, [data.magadal]);

	useEffect(() => {
		setMkabazs([]);
		getMkabazs(data.magad);
	}, [data.magad]);

	return (
		<div>
			<Container className="mt--8 pb-5">
				<Row className="justify-content-center">
					<Col
						lg="20"
						md="7"
					>
						<Card className="shadow border-0">
							<CardBody className="px-lg-5 py-lg-5">
								<div className="text-center text-muted mb-4">
									<big>שליחת דיווח</big>
								</div>
								<div className="text-center text-muted mb-4">
									<small>פרטי מדווח</small>
								</div>
								<Form role="form">
									<FormGroup dir="rtl">
										<Input
											placeholder="שם פרטי"
											name="name"
											type="text"
											value={data.name}
											onChange={handleChange}
										/>
									</FormGroup>

									<FormGroup dir="rtl">
										<Input
											placeholder="שם משפחה"
											name="lastname"
											type="text"
											value={data.lastname}
											onChange={handleChange}
										/>
									</FormGroup>

									<FormGroup
										className="mb-3"
										dir="rtl"
									>
										<Input
											placeholder="מספר אישי"
											name="personalnumber"
											type="string"
											maxlength="7"
											value={data.personalnumber}
											onChange={handleChange}
										/>
									</FormGroup>

									<FormGroup
										className="mb-3"
										dir="rtl"
									>
										<Input
											placeholder="טלפון נייד"
											name="cellphone"
											type="tel"
											maxlength="10"
											value={data.cellphone}
											onChange={handleChange}
										/>
									</FormGroup>

									<div className="text-center text-muted mb-4">
										<small>פרטי יחידה מדווחת</small>
									</div>

									<Row style={{ paddingTop: "2px" }}>
										{!data.ogda ? (
											<Col
												style={{
													justifyContent: "right",
													alignContent: "right",
													textAlign: "right",
												}}
											>
												<h6>פיקוד</h6>
												<Select
													data={pikods}
													handleChange2={handleChange2}
													name={"pikod"}
													val={data.pikod ? data.pikod : undefined}
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
													data={pikods}
													handleChange2={handleChange2}
													name={"pikod"}
													val={data.pikod ? data.pikod : undefined}
													isDisabled={true}
												/>
											</Col>
										)}

										<>
											{data.pikod && !data.hativa ? (
												<Col
													style={{
														justifyContent: "right",
														alignContent: "right",
														textAlign: "right",
													}}
												>
													<h6>אוגדה</h6>
													<Select
														data={ogdas}
														handleChange2={handleChange2}
														name={"ogda"}
														val={data.ogda ? data.ogda : undefined}
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
														data={ogdas}
														handleChange2={handleChange2}
														name={"ogda"}
														val={data.ogda ? data.ogda : undefined}
														isDisabled={true}
													/>
												</Col>
											)}
										</>

										<>
											{data.ogda && !data.gdod ? (
												<Col
													style={{
														justifyContent: "right",
														alignContent: "right",
														textAlign: "right",
													}}
												>
													<h6>חטיבה</h6>
													<Select
														data={hativas}
														handleChange2={handleChange2}
														name={"hativa"}
														val={data.hativa ? data.hativa : undefined}
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
														data={hativas}
														handleChange2={handleChange2}
														name={"hativa"}
														val={data.hativa ? data.hativa : undefined}
														isDisabled={true}
													/>
												</Col>
											)}
										</>

										<>
											{data.hativa ? (
												<Col
													style={{
														justifyContent: "right",
														alignContent: "right",
														textAlign: "right",
													}}
												>
													<h6>גדוד</h6>
													<Select
														data={gdods}
														handleChange2={handleChange2}
														name={"gdod"}
														val={data.gdod ? data.gdod : undefined}
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
														data={gdods}
														handleChange2={handleChange2}
														name={"gdod"}
														val={data.gdod ? data.gdod : undefined}
														isDisabled={true}
													/>
												</Col>
											)}
										</>
									</Row>

									<div
										className="text-center text-muted mb-4"
										style={{ paddingTop: "20px" }}
									>
										<small>פרטי אירוע</small>
									</div>

									<div style={{ textAlign: "right", paddingTop: "10px" }}>
										סוג אירוע
									</div>
									<FormGroup>
										<Input
											placeholder="סוג אירוע"
											type="select"
											name="typevent"
											value={data.typevent}
											onChange={handleChange}
											id="seltype"
										>
											<option value={"בחר"}>בחר</option>
											<option value={"1"}>תאונת כלי רכב</option>
											<option value={"2"}>התהפכות</option>
											<option value={"3"}>הנתקות גלגל</option>
											<option value={"4"}>שריפה</option>
											<option value={"5"}>אירועי נשק / תחמושת</option>
											<option value={"6"}>תאונת עבודה אנשי טנ"א</option>
											<option value={"7"}>פריקת מטפים</option>
											<option value={"8"}>אפידמיה</option>
											<option value={"9"}>חילוץ</option>
											<option value={"10"}>נזק לתשתיות אחזקה / הח"י</option>
											<option value={"11"}>אי קיום שגרת אחזקה</option>
											<option value={"12"}>אחר</option>
										</Input>
									</FormGroup>

									{/* תאונת כלי רכב, שריפה, הנתקות גלגל,התהפכות */}

									{(data.typevent === "1" ||
										data.typevent === "2" ||
										data.typevent === "3" ||
										data.typevent === "4") && (
										<>
											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												סיבת האירוע
											</div>
											<FormGroup>
												<Input
													type="select"
													name="resevent"
													value={data.resevent}
													onChange={handleChange}
													id="res"
												>
													<option value={"0"}>בחר</option>
													<option value={"1"}>תאונה</option>
													<option value={"2"}>כשל טכני</option>
													<option value={"3"}>טעות אנוש</option>
													<option value={"4"}>לא ידוע</option>
												</Input>
											</FormGroup>

											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												סוג הכלי
											</div>
											<Row>
												{!data.magad ? (
													<Col
														style={{
															justifyContent: "right",
															alignContent: "right",
															textAlign: "right",
														}}
													>
														<h6>מאגד על</h6>
														<Select
															data={magadals}
															handleChange2={handleChange2}
															name={"magadal"}
															val={data.magadal ? data.magadal : undefined}
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
														<h6>מאגד על</h6>
														<Select
															data={magadals}
															handleChange2={handleChange2}
															name={"magadal"}
															val={data.magadal ? data.magadal : undefined}
															isDisabled={true}
														/>
													</Col>
												)}

												{data.magadal && !data.mkabaz ? (
													<Col
														style={{
															justifyContent: "right",
															alignContent: "right",
															textAlign: "right",
														}}
													>
														<h6>מאגד</h6>
														<Select
															data={magads}
															handleChange2={handleChange2}
															name={"magad"}
															val={data.magad ? data.magad : undefined}
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
														<h6>מאגד</h6>
														<Select
															data={magads}
															handleChange2={handleChange2}
															name={"magad"}
															val={data.magad ? data.magad : undefined}
															isDisabled={true}
														/>
													</Col>
												)}

												{data.magad && !data.makat ? (
													<Col
														style={{
															justifyContent: "right",
															alignContent: "right",
															textAlign: "right",
														}}
													>
														<h6>מקבץ</h6>
														<Select
															data={mkabazs}
															handleChange2={handleChange2}
															name={"mkabaz"}
															val={data.mkabaz ? data.mkabaz : undefined}
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
														<h6>מקבץ</h6>
														<Select
															data={mkabazs}
															handleChange2={handleChange2}
															name={"mkabaz"}
															val={data.mkabaz ? data.mkabaz : undefined}
															isDisabled={true}
														/>
													</Col>
												)}
											</Row>

											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												האם נגרם נזק לכלי
											</div>
											<div style={{ textAlign: "right" }}>
												<FormGroup
													check
													inline
												>
													<div
														style={{ textAlign: "right", paddingTop: "10px" }}
													>
														<Input
															type="radio"
															name="yn"
															value={true}
															onChange={handleChange}
															id="YES"
														/>
														כן
													</div>
												</FormGroup>

												<FormGroup
													check
													inline
												>
													<div
														style={{ textAlign: "right", paddingTop: "10px" }}
													>
														<Input
															type="radio"
															id="NO"
															name="yn"
															value={false}
															onChange={handleChange}
														/>
														לא
													</div>
												</FormGroup>
											</div>
											{/* //* ------------------ status checker ----------------------- */}
											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												סטטוס
											</div>
											<div style={{ textAlign: "right" }}>
												<FormGroup
													check
													inline
												>
													<div
														style={{ textAlign: "right", paddingTop: "10px" }}
													>
														<Input
															type="radio"
															name="dt"
															value="1"
															onChange={handleChange}
															id="delt"
														/>
														סגור
													</div>
												</FormGroup>

												<FormGroup
													check
													inline
												>
													<div
														style={{ textAlign: "right", paddingTop: "10px" }}
													>
														<Input
															type="radio"
															id="notDelt"
															name="dt"
															value="0"
															onChange={handleChange}
														/>
														בטיפול
													</div>
												</FormGroup>
											</div>
										</>
									)}

									{/* //* אירוע נשק */}

									{data.typevent === "5" && (
										<>
											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												סוג הנשק
											</div>
											<FormGroup>
												<Input
													type="select"
													name="selneshek"
													value={data.selneshek}
													onChange={handleChange}
													id="neshek"
												>
													<option value={"0"}>בחר</option>
												</Input>
											</FormGroup>

											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												האם נגרם נזק לנשק
											</div>

											<div style={{ textAlign: "right" }}>
												<FormGroup
													check
													inline
												>
													<div
														style={{ textAlign: "right", paddingTop: "10px" }}
													>
														<Input
															type="radio"
															name="yn"
															value={true}
															onChange={handleChange}
															id="YES"
														/>
														כן
													</div>
												</FormGroup>

												<FormGroup
													check
													inline
												>
													<div
														style={{ textAlign: "right", paddingTop: "10px" }}
													>
														<Input
															type="radio"
															id="NO"
															name="yn"
															value={false}
															onChange={handleChange}
														/>
														לא
													</div>
												</FormGroup>

												{/* //* ------------------ status checker ----------------------- */}
												<div style={{ textAlign: "right", paddingTop: "10px" }}>
													סטטוס
												</div>
												<div style={{ textAlign: "right" }}>
													<FormGroup
														check
														inline
													>
														<div
															style={{ textAlign: "right", paddingTop: "10px" }}
														>
															<Input
																type="radio"
																name="dt"
																value="1"
																onChange={handleChange}
																id="delt"
															/>
															סגור
														</div>
													</FormGroup>

													<FormGroup
														check
														inline
													>
														<div
															style={{ textAlign: "right", paddingTop: "10px" }}
														>
															<Input
																type="radio"
																id="notDelt"
																name="dt"
																value="0"
																onChange={handleChange}
															/>
															בטיפול
														</div>
													</FormGroup>
												</div>
											</div>

											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												מה התרחש באירוע
											</div>
											<FormGroup>
												<Input
													type="select"
													name="whap"
													value={data.whap}
													onChange={handleChange}
													id="what"
												>
													<option value={"0"}>בחר</option>
													<option value={"1"}>פיצוץ נשק</option>
													<option value={"2"}>פיצוץ תחמושת</option>
													<option value={"3"}>פליטת כדור</option>
													<option value={"4"}>גרימת נזק לנשק</option>
													<option value={"5"}>אחר</option>
												</Input>
											</FormGroup>
										</>
									)}

									{/*  תאונת עבודה אנשי טנ"א */}

									{data.typevent === "6" && (
										<>
											<p
												style={{
													textAlign: "right",
													color: "red",
													fontSize: "10px",
												}}
											>
												{" "}
												*תאונת עבודה - כל אירוע בו קיים ימי מחלה (מיום מחלה אחד
												ומעלה)
											</p>

											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												מתי נפגע
											</div>
											<FormGroup>
												<Input
													type="select"
													name="wnifga"
													value={data.wnifga}
													onChange={handleChange}
													id="when"
												>
													<option value={"0"}>בחר</option>
													<option value={"1"}>במהלך פעילות אחזקתית</option>
													<option value={"2"}>במהלך פעילות שגרתית</option>
													<option value={"3"}>תרגיל</option>
													<option value={"4"}>פעילות מבצעית</option>
													<option value={"5"}>אחר</option>
												</Input>
											</FormGroup>

											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												ממה נפגע
											</div>
											<FormGroup>
												<Input
													type="text"
													name="amlahtype"
													value={data.amlahtype}
													onChange={handleChange}
													id="amlah"
												></Input>
											</FormGroup>
										</>
									)}

									{/* פריקת מטפים*/}

									{data.typevent === "7" && (
										<>
											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												סוג המטף
											</div>
											<FormGroup>
												<Input
													type="select"
													name="mataftype"
													value={data.mataftype}
													onChange={handleChange}
													id="mataf"
												>
													<option value={"0"}>בחר</option>
												</Input>
											</FormGroup>

											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												סוג הרק"ם
											</div>
											<FormGroup>
												<Input
													type="select"
													name="rekemtype"
													value={data.rekemtype}
													onChange={handleChange}
													id="rekem"
												>
													<option value={"0"}>בחר</option>
												</Input>
											</FormGroup>

											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												מצב הרק"ם במהלך הפריקה
											</div>
											<FormGroup>
												<Input
													type="select"
													name="mazavrekem"
													value={data.mazavrekem}
													onChange={handleChange}
													id="mazav"
												>
													<option value={"0"}>בחר</option>
													<option value={"1"}>סטטי</option>
													<option value={"2"}>בתנועה</option>
												</Input>
											</FormGroup>

											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												האם בוצע במהלך עבודה
											</div>
											<FormGroup>
												<Input
													type="select"
													name="dwork"
													value={data.dwork}
													onChange={handleChange}
													id="dwork"
												>
													<option value={"0"}>בחר</option>
													<option value={"1"}>אחזקתית טנ"א</option>
													<option value={"2"}>תקשוב</option>
												</Input>
											</FormGroup>

											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												במהלך פירוק / הרכבה
											</div>

											<div style={{ textAlign: "right" }}>
												<FormGroup
													check
													inline
												>
													<div
														style={{ textAlign: "right", paddingTop: "10px" }}
													>
														<Input
															type="radio"
															name="yn"
															value={true}
															onChange={handleChange}
															id="YES"
														/>
														כן
													</div>
												</FormGroup>

												<FormGroup
													check
													inline
												>
													<div
														style={{ textAlign: "right", paddingTop: "10px" }}
													>
														<Input
															type="radio"
															id="NO"
															name="yn"
															value={false}
															onChange={handleChange}
														/>
														לא
													</div>
												</FormGroup>
											</div>
										</>
									)}

									{/* אפידמיה */}

									{data.typevent === "8" && (
										<>
											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												סוג האפידמיה
											</div>
											<FormGroup>
												<Input
													type="select"
													name="apitype"
													value={data.apitype}
													onChange={handleChange}
													id="apidmia"
												>
													<option value={"0"}>בחר</option>
													<option value={"1"}>תפעולית</option>
													<option value={"2"}>אחזקתית</option>
												</Input>
											</FormGroup>
										</>
									)}

									{/* חילוץ */}

									{data.typevent === "9" && (
										<>
											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												סוג הכלי המחולץ
											</div>
											<FormGroup>
												<Input
													type="select"
													name="mholaztype"
													value={data.mholaztype}
													onChange={handleChange}
													id="mholaz"
												>
													<option value={"0"}>בחר</option>
												</Input>
											</FormGroup>
											{/* <div style={{ textAlign: "right", paddingTop: "10px" }}>
                    סוג הכלי המחלץ
                  </div>
                 <FormGroup>
                    <Input
                      type="select"
                      name="mhalztype"
                      value={data.mhalztype}
                      onChange={handleChange}
                      id="mhalz"
                    >
                      <option value={"0"}>בחר</option>
                    </Input>
                  </FormGroup>
 */}
										</>
									)}

									<FormGroup dir="rtl">
										<Input
											placeholder="פירוט האירוע"
											name="pirot"
											type="textarea"
											value={data.pirot}
											onChange={handleChange}
										/>
									</FormGroup>

									<div style={{ textAlign: "right", paddingTop: "10px" }}>
										תאריך אירוע
									</div>
									<FormGroup dir="rtl">
										<Input
											placeholder="תאריך אירוע"
											name="datevent"
											type="datetime-local"
											value={data.datevent}
											onChange={handleChange}
										/>
									</FormGroup>

									<FormGroup dir="rtl">
										<Input
											placeholder="מיקום האירוע"
											name="mikom"
											type="string"
											value={data.mikom}
											onChange={handleChange}
										/>
									</FormGroup>

									<FormGroup dir="rtl">
										<Input
											placeholder="כמה נפגעים היו באירוע"
											name="nifga"
											type="number"
											value={data.nifga}
											onChange={handleChange}
										/>
									</FormGroup>
									{/* 
                   {data.nifga > "0" && (
                    <>
                      <div style={{ textAlign: "right", paddingTop: "10px" }}>
                        מצב הנפגע
                      </div>
                      <FormGroup>
                        <Input
                          type="select"
                          name="mazavnifga"
                          value={data.mazavnifga}
                          onChange={handleChange}
                          id="mazav"
                        >
                          <option value={"0"}>בחר</option>
                          <option value={"1"}>קל</option>
                          <option value={"2"}>בינוני</option>
                          <option value={"3"}>קשה</option>
                          <option value={"4"}>נהרג</option>
                        </Input>
                      </FormGroup>

                      <FormGroup dir="rtl">
                    <Input
                      placeholder="מיקום הפגיעה בגוף"
                      name="mikompgia"
                      type="string"
                      value={data.mikompgia}
                      onChange={handleChange}
                    />
                  </FormGroup> 
                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>
                  <button
                //    onClick={clickSubmit} 
                   className="btn btn-primary">
                      +
                 </button>
                 </div>
                  </>
                  )} */}

									<div className="text-center">
										<button
											onClick={clickSubmit}
											className="btn-new-blue"
										>
											שליחה
										</button>
									</div>
								</Form>
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default withRouter(Report);
