self.addEventListener("message", e => {
	/* 処理内容 */
	return true;
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
