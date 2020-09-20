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


self.addEventListener("message", e => {
	/* 処理内容 */
	const [raw_data, condition] = e.data;

	let resolves = [];
	let len_resolves = 0;
	let i = 0;
	for (const clothes in raw_data["ふく"]) {
		for (const face in raw_data["かお"]) {
			for (const neck in raw_data["くび"]) {
				for (const arm in raw_data["うで"]) {
					for (const back in raw_data["せなか"]) {
						for (const leg in raw_data["あし"]) {
							let e = new EquipSet(
								raw_data["ふく"][clothes],
								raw_data["かお"][face],
								raw_data["くび"][neck],
								raw_data["うで"][arm],
								raw_data["せなか"][back],
								raw_data["あし"][leg]
							);
							if (i > 1000) {
								self.postMessage("1000回の繰り返しを終了しました。")
								return;
							}
							if (e.status.judge_condition(condition)) {
								resolves.push(e);
								len_resolves++;
								if (len_resolves >= 100) {
									self.postMessage(resolves);
				    					return;
								}
			    				}
			    				i++;
						}
					}
				}
			}

		}
	}
	self.postMessage("全組み合わせを探索しました。")

	});
