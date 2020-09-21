class EquipEffect {
	constructor() {
		this["基本ステータス"] = {
			"こうげきりょく": 0,
			"ぼうぎょりょく": 0,
			"すばやさ": 0,
			"かいひりつ": 0
		};
		this["攻撃属性"] = "無属性";
		this["状態異常付加"] = {
			"+毒":false, "+猛毒":false, "+マヒ":false, "+ねむり":false, "+突然死":false, "+やけど":false,
			"+しもやけ":false, "+かぜっぴき":false, "+どろだらけ":false, "+かんでん":false,
			"+みずびたし":false, "+ブラインド":false, "+呪い":false
		};
		this["属性耐性"] = {
			"火たいせい":0, "氷たいせい":0, "風たいせい":0, "土たいせい":0, "電気たいせい":0, 
			"水たいせい":0, "闇たいせい":0, "光たいせい":0
		};
		this["状態異常耐性"] = {
			"対突然死":0, "毒たいせい":0, "マヒたいせい":0, "ねむりたいせい":0, "やけどたいせい":0, "しもやけたいせい":0,
			"かぜっぴきたいせい":0, "どろだらけたいせい":0, "かんでんたいせい":0, "水びたしたいせい":0, "ブラインドたいせい":0,
			"呪いたいせい":0, "誘惑たいせい":0
		};
		this["対タイプ等"] = {
			"対竜":0, "対獣":0, "対魔":0, "対霊":0, "対虫":0, "対水生":0, "対植物":0, "対ぜん":0, "対あく":0
		};
		this["ダメージ倍増"] = {
			"こうげき":0, "とくぎ":0, "火属性":0, "氷属性":0, "風属性":0, "土属性":0, "電気属性":0,
			"水属性":0, "闇属性":0, "光属性":0
		};
		this["ターゲット"]  = {
			"ターゲット":false, "火ターゲット":false, "氷ターゲット":false, "風ターゲット":false, "土ターゲット":false,
			"電気ターゲット":false, "水ターゲット":false, "光ターゲット":false, "闇ターゲット":false
		},
		this["状態異常付加ボディ"] = {
			"毒ボディ":false, "猛毒ボディ":false, "やけどボディ":false, "みずボディ":false,
			"かぜボディ":false, "どろボディ":false, "感電ボディ":false, "霜焼けボディ":false, "のろいボディ":false
		};
		this["タイプガード"] = {
			"竜ガード":0, "獣ガード":0, "魔ガード":0, "霊ガード":0, "虫ガード":0, "水生ガード":0,
			"植物ガード":0, "ぜんガード":0, "あくガード":0
		};
		this["最大値優先"] = {
			"クリティカル":0, "ダメージ固定":0, "うけながし":0, "かばう": 0, "反射":0, "ゴースト化": 0
		};
		this["真偽値"] = {
			"逆ギレ":false, "硬化":false, "こんじょう":false, "こうふん":false, "シールド無視":false,
			"とくぎ数":false, "れんけい":false, "一撃必殺":false, "必中":false, "トゲトゲ":false,
			"カウンター":false, "オート防御":false, "アンテナダウン":false, "床ダメージ無":false,
			"浮遊":false, "攻撃おとし":false, "防御おとし":false, "素早さおとし": false, "回避おとし":false
		};
		this["その他"] = {
			"ゆうわく":0, "攻撃人数":1, "こうげき数":0, "きょうふ": 0, "ふうかく":0, "HP自動回復":0,
			"回復効果": 1.0, "HP吸収":0, "さいだいHP": 0, "AP自動回復":0, "AP節約": 1.0, "さいだいAP":0, 
			"加速":0, "経験値":1.0, "ゴールド":0, "おたから":0 ,"レア":0, "激レア":0, "ほかく":1.0, "にげる":0,"まぼろし":0
		};
	}

	judge_condition(condition) {
		/* 効果条件 condition に対し全ての項目を上回っているなら true を返却する。 */

		for (const category_name in condition) {
			if (category_name == "攻撃属性") {
				if (condition[category_name] != "無属性" && condition[category_name] != this[category_name]) {
					/*
					console.log(condition[category_name], this[category_name]);
					console.log("攻撃属性による終了")
					*/
					return false;
				}
			}
			const condition_category = condition[category_name];
			const this_category = this[category_name]

			for (const attr_name in condition_category) {
				if (attr_name == "AP節約") {
					if (condition_category[attr_name] < this_category[attr_name])  {
						/*console.log("AP節約による終了")*/
						return false;
					}
				} else if (attr_name == "ダメージ固定") {
					if (condition_category[attr_name] != this_category[attr_name]) {
						return false;
					}
				} else {
					if (condition_category[attr_name] > this_category[attr_name]) {
						/* 条件値より実際の値が低いので, false */
						/*console.log(`${attr_name}による終了`);*/
						return false;
					}
				}
			}
		}
		return true;
	}
}

let raw_data = null;
fetch("https://coolwind0202.github.io/denpa-equipment/data.json")
	.then(res => res.json())
	.then(data => {
		raw_data = data;
	});

const get_input = () => {
	const condition = new EquipEffect();
	const input_items = [];
	for (const element of document.getElementsByTagName("input")) {
		if (element.defaultValue !== element.value) input_items.push(element.id);
		if (element.type != "radio" && element.type != "checkbox") {
			for (const category_name in condition) {
				for (const property_name in condition[category_name]) {
					if (property_name == element.id) {
						if (element.value) {
							condition[category_name][property_name] = parseFloat(element.value);
						}
					}
				}
			}
		} else if (element.type == "checkbox") {
			for (const category_name in condition) {
				for (const property_name in condition[category_name]) {
					if (property_name == element.id) {
						condition[category_name][property_name] = element.checked;
					}
				}
			}
		} else if (element.type == "radio") {
			if (element.checked) {
				console.log(element);
				if (element.name == "攻撃属性") {
					condition["攻撃属性"] = element.id;
				} else if (element.name == "複数人攻撃") {
					condition["その他"]["攻撃人数"] = parseInt(element.id);
				}
			}
		}
	}
	return condition, input_items;
}

const reflect_output = (data) => {
	const table = document.getElementsByTagName("table")[0];
	const trs = document.getElementsByTagName("tr");
	let node_number = 0; /* 見出し行と通常行の区別のための数値 */
	for (const tr of trs) {
		node_number++;
		if (node_number === 1) continue;
		tr.parentNode.removeChild(tr);
	}

	/* tableの子要素に追加する処理 */
	for (const row of data) {
		const tr = document.createElement("tr");
		for (const part of row.equips) {
			const td = document.createElement("td");
			td.innerHTML = part.name;
			tr.appendChild(td);
		}
		table.appendChild(tr);
	}		
}

const button = document.getElementById("confirm-button");
let now_searching_flag = false;

button.addEventListener("click", () => {
	const [condition, input_items] = get_input();
	/* 指定効果を一切持っていない装備はraw_dataから除外して新しい連想配列を作成する処理 */

	if (raw_data === null) {
		alert("検索を行うための装備データのロードが完了していないため、検索できません。");
		return;
	}

	if (now_searching_flag) {
		alert("現在検索を行っているため、新規に検索を開始できません。");
		return;
	}
	
	let worker = new Worker("worker.js"); /* ボトルネックの処理なので、Web Workerに切り出した */

	worker.addEventListener("message", e => {
		const [response_type, data] = e.data;
		if (response_type == "progress") {
			console.log(data);
		} else if (response_type == "result") {
			reflect_output(data);
		}
		now_searching_flag = false;
	});

	worker.postMessage([raw_data, condition, input_items]);
	now_searching_flag = true;
});
