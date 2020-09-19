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

class EquipSet {
    constructor(clothes,face,neck,arm,back,leg) {
        this.clothes = clothes;
        this.face = face;
        this.neck = neck;
        this.arm = arm;
        this.back = back;
        this.leg = leg;
        this.equips = [clothes,face,neck,arm,back,leg];
		this.status = new EquipEffect();
		this.get_status();
    }

    calculation_attr(attr_name,newer) {
		newer = parseFloat(newer);
		if (attr_name.endsWith("攻撃")) {
			this.status["攻撃属性"] = attr_name;
			return true;
		}
		if (attr_name.endsWith("人こうげき")) {
			let older = this.status["その他"]["攻撃人数"];
			let max = Math.max(parseInt(older),parseInt(attr_name));
			this.status["その他"]["攻撃人数"] = max;
			return true;
		}
		if (attr_name.startsWith("+")) {
			this.status["状態異常付加"][attr_name] = true;
			return true;
		}
		if (attr_name.endsWith("たいせい")) {
			if (attr_name == "全属性たいせい") {
				for (const property_name in this.status["属性耐性"]) {
					const older = parseInt(this.status["属性耐性"][property_name]);
					this.status["属性耐性"][property_name] = Math.min(older + newer, 9); 
				}
				return true;
			} else if (attr_name == "全状態異常たいせい") {
				for (const property_name in this.status["状態異常耐性"]) {
					const older = parseInt(this.status["状態異常耐性"][property_name]);
					this.status["状態異常耐性"][property_name] = Math.min(older + newer, 9);
				}
				return true;
			} else if (this.status["属性耐性"].hasOwnProperty(attr_name)) {
				const older = parseInt(this.status["属性耐性"][attr_name]);
				this.status["属性耐性"][attr_name] = Math.min(older + newer, 9);
				return true;
			} else if (this.status["状態異常耐性"].hasOwnProperty(attr_name)) {
				const older = parseInt(this.status["状態異常耐性"][attr_name]);
				this.status["状態異常耐性"][attr_name] = Math.min(older + newer, 9);
				return true;
			}
		}
		if (attr_name.startsWith("対")) {
			const older = parseFloat(this.status["対タイプ等"][attr_name])
			if (attr_name == "対霊") {
				this.status["対タイプ等"][attr_name] = Math.max(older,newer);
			} else {
				this.status["対タイプ等"][attr_name] = older + newer;
			}
			return true;
		}
		if (attr_name.endsWith("属性") || ["とくぎ","こうげき"].includes(attr_name)) {
			const older = parseFloat(this.status["ダメージ倍増"][attr_name]);
			this.status["ダメージ倍増"][attr_name] = older + newer;
			return true;
		}
		if (attr_name.endsWith("ターゲット")) {
			this.status["ターゲット"][attr_name] = true;
			return true;
		}
		if (attr_name.endsWith("ボディ")) {
			this.status["状態異常付加ボディ"][attr_name] = true;
			return true;
		}
		if (attr_name.endsWith("ガード")) {
			const older = parseInt(this.status["タイプガード"][attr_name]);
			this.status["タイプガード"][attr_name] = Math.min(older + newer, 50);
			return true;
		}
		if (this.status["基本ステータス"].hasOwnProperty(attr_name)) {
			const older = parseInt(this.status["基本ステータス"][attr_name]);
			this.status["基本ステータス"][attr_name] = older + newer;
			return true;
		}
		if (this.status["最大値優先"].hasOwnProperty(attr_name)) {
			const older = parseFloat(this.status["最大値優先"][attr_name]);
			this.status["最大値優先"][attr_name] = Math.max(older,newer);
			return true;
		}
		if (this.status["真偽値"].hasOwnProperty(attr_name)) {
			this.status["真偽値"][attr_name] = true;
			return true;
		}
		if (attr_name == "ゆうわく") {
			const older = parseInt(this.status["その他"]["ゆうわく"]);
			this.status["その他"]["ゆうわく"] = Math.min(older + newer, 30);
			return true;
		}
		if (attr_name == "こうげき数") {
			const older = parseInt(this.status["その他"]["こうげき数"]);
			this.status["その他"]["こうげき数"] = older + 1;
			return true;
		}
		if (attr_name == "きょうふ") {
			const older = parseInt(this.status["その他"]["きょうふ"]);
			this.status["その他"]["きょうふ"] = Math.min(older + newer, 30);
			return true;
		}
		if (attr_name == "ふうかく") {
			const older = parseInt(this.status["その他"]["ふうかく"]);
			this.status["その他"]["ふうかく"] = Math.min(older + newer, 9);
			return true;
		}
		if (attr_name == "HP自動回復") {
			const older = parseInt(this.status["その他"]["HP自動回復"]);
			this.status["その他"]["HP自動回復"] = Math.min(older + newer, 30);
			return true;
		}
		if (attr_name == "回復効果") {
			const older = parseFloat(this.status["その他"]["回復効果"]);
			this.status["その他"]["回復効果"] = Math.min(older * newer, 10.0);
			return true;
		}
		if (attr_name == "HP吸収") {
			const older = parseInt(this.status["その他"]["HP吸収"]);
			this.status["その他"]["HP吸収"] = older + newer;
			return true;
		}
		if (attr_name == "さいだいHP") {
			const older = parseInt(this.status["その他"]["さいだいHP"]);
			this.status["その他"]["さいだいHP"] = Math.min(older + newer, 1000);
			return true;
		}
		if (attr_name == "AP自動回復") {
			const older = parseInt(this.status["その他"]["AP自動回復"]);
			this.status["その他"]["AP自動回復"] = Math.min(older + newer, 10);
			return true;
		}
		if (attr_name == "AP節約") {
			const older = parseInt(this.status["その他"]["AP節約"]);
			this.status["その他"]["AP節約"] = Math.floor(older * newer * 0.01);
			return true;
		}
		if (attr_name == "さいだいAP") {
			const older = parseInt(this.status["その他"]["さいだいAP"]);
			this.status["その他"]["さいだいAP"] = older + newer;
			return true;
		}
		if (attr_name == "加速") {
			const older = parseInt(this.status["その他"]["加速"]);
			this.status["その他"]["加速"] = older + 1;
			return true;
		}
		if (attr_name == "経験値") {
			const older = parseFloat(this.status["その他"]["経験値"]);
			this.status["その他"]["経験値"] = Math.min(older + newer, 2.0);
			return true;
		}
		if (attr_name == "ゴールド") {
			const older = parseFloat(this.status["その他"]["ゴールド"]);
			this.status["その他"]["ゴールド"] = Math.min(older + newer, 3.0);
			return true;
		}
		if (attr_name == "おたから") {
			const older = parseFloat(this.status["その他"]["おたから"]);
			this.status["その他"]["おたから"] = Math.min(older + newer, 4.0);
			return true;
		}
		if (attr_name == "レア") {
			const older = parseFloat(this.status["その他"]["レア"]);
			this.status["その他"]["レア"] = Math.min(older + newer, 9.0);
			return true;
		}
		if (attr_name == "激レア") {
			const older = parseFloat(this.status["その他"]["激レア"]);
			this.status["その他"]["激レア"] = Math.min(older + newer, 19.0);
			return true;
		}
		if (attr_name == "ほかく") {
			const older = parseFloat(this.status["その他"]["ほかく"]);
			this.status["その他"]["ほかく"] = Math.min(older + newer, 10.0);
			return true;
		}
		if (attr_name == "にげる") {
			const older = parseInt(this.status["その他"]["にげる"]);
			this.status["その他"]["にげる"] = Math.min(older + newer, 100);
			return true;
		}
		if (attr_name == "まぼろし") {
			const older = parseInt(this.status["その他"]["まぼろし"]);
			this.status["その他"]["まぼろし"] = Math.min(older + newer, 100);
			return true;
		}
		return false;
    }
    
    get_status() {
		this.equips.forEach(equip => {
			for (const attr_name in equip) {
				const result = this.calculation_attr(attr_name,equip[attr_name]);
			}
		});
	}
}

const data = {
	"ふく": {
		"でんせつのよろい": {
			"オート防御": true,
			"ぼうぎょりょく": "19"
		},
		"あらし": {
			"風たいせい": "3",
			"ぼうぎょりょく": "22"
		},
		"あんこく": {
			"闇たいせい": "3",
			"ぼうぎょりょく": "22"
		},
		"かざん": {
			"火たいせい": "3",
			"ぼうぎょりょく": "22"
		},
		"かみなり": {
			"電気たいせい": "3",
			"ぼうぎょりょく": "22"
		},
		"せんこう": {
			"光たいせい": "3",
			"ぼうぎょりょく": "22"
		},
		"だいち": {
			"土たいせい": "3",
			"ぼうぎょりょく": "22"
		},
		"たき": {
			"水たいせい": "3",
			"ぼうぎょりょく": "22"
        }
    },
    "かお": {
		"でんせつのかぶと": {
			"AP節約": "95%",
			"光たいせい": "2"
		},
		"あおいめがね": {
			"水たいせい": "1"
		},
		"あかぶちメガネ": {
			"火たいせい": "1"
		},
		"きいろいめがね": {
			"電気たいせい": "1"
		},
		"しかくいめがね": {
			"マヒたいせい": "1"
		},
		"すいちゅうメガネ": {
			"水たいせい": "1",
			"水びたしたいせい": "2"
        }
    },
    "くび": {
		"でんせつのくびかざり": {
			"全状態異常たいせい": "+2",
			"HP吸収": "15%"
		},
		"ハートのチョーカー": {
			"さいだいHP": "4",
			"ぼうぎょりょく": "5"
		},
		"まほうのチョーカー": {
			"AP自動回復": "1"
		},
		"スパイクチョーカー": {
			"毒ボディ": true
		},
		"バラのチョーカー": {
			"トゲトゲ": true
		},
		"ゴスロリチョーカー": {
			"闇たいせい": "2",
			"さいだいAP": "4"
        }
    },
    "うで": {
		"でんせつのこて": {
			"闇たいせい": "1",
			"こうげきりょく": "25"
		},
		"かぜのうでわ": {
			"風攻撃": true,
			"+かぜっぴき": true
		},
		"こおりのうでわ": {
			"氷攻撃": true,
			"+しもやけ": true
		},
		"ちからのうでわ": {
			"こうげきりょく": "4"
		},
		"つちのうでわ": {
			"土攻撃": true,
			"+どろだらけ": true
        }
    },
    "せなか": {
		"でんせつのぶき": {
			"こうげきりょく": "20"
		},
		"かぜのマント": {
			"風たいせい": "2"
		},
		"こおりのマント": {
			"氷たいせい": "2"
		},
		"つちのマント": {
			"土たいせい": "2"
		},
		"でんきのマント": {
			"電気たいせい": "2"
        }
    },
    "あし": {
		"でんせつのブーツ": {
			"すばやさ": "18",
			"加速": true
		},
		"クリスマスブーツ": {
			"AP自動回復": "1"
		},
		"ひかりのブーツ": {
			"光たいせい": "1",
			"かいひりつ": "2%"
		},
		"みずのブーツ": {
			"水たいせい": "1",
			"かいひりつ": "2%"
		},
		"いやしのブーツ": {
			"HP自動回復": "8%",
			"すばやさ": "3"
        }
    }
}

const get_input = () => {
	const condition = new EquipEffect();
	for (const element of document.getElementsByTagName("input")) {
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
	console.log(condition);
}

const button = document.getElementById("confirm-button");
button.addEventListener("click", () => {
	get_input();
});

fetch("https://coolwind0202.github.io/denpa-equipment/data.json").then(
    res => {
		console.log(res);
    }
)

/*
const condition = new EquipEffect();
condition["攻撃属性"] = "土攻撃";
condition["その他"]["AP自動回復"] = 1;
condition["その他"]["加速"] = 1;
condition["真偽値"]["オート防御"] = true;

let i = 0;
let e;
for (const clothes in data["ふく"]) {
	for (const face in data["かお"]) {
		for (const neck in data["くび"]) {
			for (const arm in data["うで"]) {
				for (const back in data["せなか"]) {
					for (const leg in data["あし"]) {
						e = new EquipSet(
							data["ふく"][clothes],
							data["かお"][face],
							data["くび"][neck],
							data["うで"][arm],
							data["せなか"][back],
							data["あし"][leg]
						);
						if (e.status.judge_condition(condition)) {
							console.log(e);
						}
						i++;
					}
				}
			}
		}
		
	}
}
*/
// console.log(e);
//e.status.judge_condition(condition);
