export default [
	{
		"start": "1",
		"data": {
			"1": {
				"id": "1",
				"name": "编译交易脚本",
				"scriptId": "caf41eaf",
				"ip": "192.168.1.2",
				"port": "22",
				
				bounds: [120, 40, 180, 40],
				"target": {
					"0": "4",
					"1": "2"
				}
			},
			"2": {
				"id": "2",
				"name": "打包项目",
				"scriptId": "ahawerw",
				"ip": "192.168.1.2",
				"port": "22",
				bounds: [20, 120, 180, 40],
				"params": {
					"output": "f:/log/script.log"
				},
				"target": {
					"0": "4",
					"1": "3"
				},
				"input":[]
			},
			"3": {
				"id": "3",
				"name": "部署项目",
				"scriptId": "afagaf",
				"ip": "192.168.1.122",
				"port": "22",
				bounds: [320, 250, 180, 40],
				"params": {
					"output": "f:/log/script.log"
				},
				"target": {}
			},
			"4": {
				"id": "4",
				"name": "脚本执行出错",
				"scriptId": "dsaf123sd",
				"ip": "192.168.1.3",
				"port": "2212",
				bounds: [20, 250, 180, 40],
				"params": {
					"output": "f:/log/script.log",
					"type": "1"
				}
			}
		}
	},
	{
		"data": {
			"1": {
				"id": "1",
				"name": "Git拉取",
				"params": {},
				"bounds": [303, 54, 180, 40],
				"target": {
					"0": "6",
					"1": "2"
				}
			},
			"2": {
				"id": "2",
				"name": "文件编译",
				"params": {},
				"bounds": [451, 137, 180, 40],
				"target": {
					"0": "8",
					"1": "3"
				}
			},
			"3": {
				"id": "3",
				"name": "FTP上传",
				"params": {},
				"bounds": [596, 223, 180, 40],
				"target": {
					"0": "9",
					"1": "4"
				}
			},
			"4": {
				"id": "4",
				"name": "文件部署",
				"params": {},
				"bounds": [738, 302, 180, 40],
				"target": {
					"0": "11",
					"1": "5"
				}
			},
			"5": {
				"id": "5",
				"name": "执行SQL",
				"params": {},
				"bounds": [888, 388, 180, 40],
				"target": {
					"1": "10"
				}
			},
			"6": {
				"id": "6",
				"name": "通知管理员",
				"params": {},
				"bounds": [201, 138, 180, 40],
				"target": {
					"1": "7"
				}
			},
			"7": {
				"id": "7",
				"name": "生成日志",
				"params": {},
				"bounds": [70, 222, 180, 40],
				"target": {}
			},
			"8": {
				"id": "8",
				"name": "生成日志",
				"params": {},
				"bounds": [349, 225, 180, 40],
				"target": {}
			},
			"9": {
				"id": "9",
				"name": "通知管理员",
				"params": {},
				"bounds": [460, 307, 180, 40],
				"target": {
					"0": "12"
				}
			},
			"10": {
				"id": "10",
				"name": "回滚数据库",
				"params": {},
				"bounds": [760, 484, 180, 40],
				"target": {}
			},
			"11": {
				"id": "11",
				"name": "通知管理员",
				"params": {},
				"bounds": [609, 396, 180, 40],
				"target": {}
			},
			"12": {
				"id": "12",
				"name": "上报异常",
				"params": {},
				"bounds": [357, 398, 180, 40],
				"target": {}
			}
		},
		"start": "2"
	},
	
	{
		"data": {
			"1": {
				"id": "1",
				"name": "编译交易脚本",
				"scriptId": "caf41eaf",
				"ip": "192.168.1.2",
				"port": "22",
				"params": {
					"output": "f:/log/script.log"
				},
				"bounds": [120, 40, 180, 40],
				"target": {
					"0": "4",
					"1": "2"
				}
			},
			"2": {
				"id": "2",
				"name": "打包项目",
				"scriptId": "ahawerw",
				"ip": "192.168.1.2",
				"port": "22",
				"bounds": [20, 120, 180, 40],
				"params": {
					"output": "f:/log/script.log"
				},
				"target": {
					"0": "4",
					"1": "3"
				}
			},
			"3": {
				"id": "3",
				"name": "部署项目",
				"scriptId": "afagaf",
				"ip": "192.168.1.122",
				"port": "22",
				"bounds": [413, 187, 180, 40],
				"params": {
					"output": "f:/log/script.log"
				},
				"target": {
					"0": "9"
				}
			},
			"4": {
				"id": "4",
				"name": "脚本执行出错",
				"scriptId": "dsaf123sd",
				"ip": "192.168.1.3",
				"port": "2212",
				"bounds": [20, 250, 180, 40],
				"params": {
					"output": "f:/log/script.log",
					"type": "1"
				},
				"target": {
					"1": "5"
				}
			},
			"5": {
				"id": "5",
				"name": "321",
				"params": {},
				"bounds": [72, 448, 180, 40],
				"target": {
					"1": "10"
				}
			},
			"6": {
				"id": "6",
				"name": "321",
				"params": {},
				"bounds": [614, 356, 180, 40],
				"target": {
					"0": "7",
					"1": "8"
				}
			},
			"7": {
				"id": "7",
				"name": "321",
				"params": {},
				"bounds": [38, 609, 180, 40],
				"target": {
					"1": "11"
				}
			},
			"8": {
				"id": "8",
				"name": "分类测试",
				"params": {},
				"bounds": [802, 461, 180, 40],
				"target": {
					"0": 12,
					"1": 16
				}
			},
			"9": {
				"id": "9",
				"name": "分类测试",
				"params": {},
				"bounds": [536, 284, 180, 40],
				"target": {
					"1": "6"
				}
			},
			"10": {
				"id": "10",
				"name": "分类测试",
				"params": {},
				"bounds": [412, 738, 180, 40],
				"target": {}
			},
			"11": {
				"id": "11",
				"name": "分类测试",
				"params": {},
				"bounds": [92, 793, 180, 40],
				"target": {}
			},
			"12": {
				"id": 12,
				"name": "编译交易脚本",
				"scriptId": "caf41eaf",
				"ip": "192.168.1.2",
				"port": "22",
				"params": {
					"output": "f:/log/script.log"
				},
				"bounds": [632, 838.6, 180, 40],
				"target": {
					"0": 15,
					"1": 13
				}
			},
			"13": {
				"id": 13,
				"name": "打包项目",
				"scriptId": "ahawerw",
				"ip": "192.168.1.2",
				"port": "22",
				"bounds": [532, 918.6, 180, 40],
				"params": {
					"output": "f:/log/script.log"
				},
				"target": {
					"0": 15,
					"1": 14
				}
			},
			"14": {
				"id": 14,
				"name": "部署项目",
				"scriptId": "afagaf",
				"ip": "192.168.1.122",
				"port": "22",
				"bounds": [832, 1048.6, 180, 40],
				"params": {
					"output": "f:/log/script.log"
				},
				"target": {}
			},
			"15": {
				"id": 15,
				"name": "脚本执行出错",
				"scriptId": "dsaf123sd",
				"ip": "192.168.1.3",
				"port": "2212",
				"bounds": [532, 1048.6, 180, 40],
				"params": {
					"output": "f:/log/script.log",
					"type": "1"
				},
				"target": {}
			},
			"16": {
				"id": 16,
				"name": "编译交易脚本",
				"scriptId": "caf41eaf",
				"ip": "192.168.1.2",
				"port": "22",
				"params": {
					"output": "f:/log/script.log"
				},
				"bounds": [1169.4, 179, 180, 40],
				"target": {
					"0": 19,
					"1": 17
				}
			},
			"17": {
				"id": 17,
				"name": "打包项目",
				"scriptId": "ahawerw",
				"ip": "192.168.1.2",
				"port": "22",
				"bounds": [1069.4, 259, 180, 40],
				"params": {
					"output": "f:/log/script.log"
				},
				"target": {
					"0": 19,
					"1": 18
				}
			},
			"18": {
				"id": 18,
				"name": "部署项目",
				"scriptId": "afagaf",
				"ip": "192.168.1.122",
				"port": "22",
				"bounds": [1369.4, 389, 180, 40],
				"params": {
					"output": "f:/log/script.log"
				},
				"target": {
					"1": 24
				}
			},
			"19": {
				"id": 19,
				"name": "脚本执行出错",
				"scriptId": "dsaf123sd",
				"ip": "192.168.1.3",
				"port": "2212",
				"bounds": [1069.4, 389, 180, 40],
				"params": {
					"output": "f:/log/script.log",
					"type": "1"
				},
				"target": {
					"0": 20
				}
			},
			"20": {
				"id": 20,
				"name": "编译交易脚本",
				"scriptId": "caf41eaf",
				"ip": "192.168.1.2",
				"port": "22",
				"params": {
					"output": "f:/log/script.log"
				},
				"bounds": [1211.4, 492, 180, 40],
				"target": {
					"0": 23,
					"1": 21
				}
			},
			"21": {
				"id": 21,
				"name": "打包项目",
				"scriptId": "ahawerw",
				"ip": "192.168.1.2",
				"port": "22",
				"bounds": [1111.4, 572, 180, 40],
				"params": {
					"output": "f:/log/script.log"
				},
				"target": {
					"0": 23,
					"1": 22
				}
			},
			"22": {
				"id": 22,
				"name": "部署项目",
				"scriptId": "afagaf",
				"ip": "192.168.1.122",
				"port": "22",
				"bounds": [1411.4, 702, 180, 40],
				"params": {
					"output": "f:/log/script.log"
				},
				"target": {}
			},
			"23": {
				"id": 23,
				"name": "脚本执行出错",
				"scriptId": "dsaf123sd",
				"ip": "192.168.1.3",
				"port": "2212",
				"bounds": [1111.4, 702, 180, 40],
				"params": {
					"output": "f:/log/script.log",
					"type": "1"
				},
				"target": {}
			},
			"24": {
				"id": 24,
				"name": "编译交易脚本",
				"scriptId": "caf41eaf",
				"ip": "192.168.1.2",
				"port": "22",
				"params": {
					"output": "f:/log/script.log"
				},
				"bounds": [1582.4, 458, 180, 40],
				"target": {
					"0": 27,
					"1": 25
				}
			},
			"25": {
				"id": 25,
				"name": "打包项目",
				"scriptId": "ahawerw",
				"ip": "192.168.1.2",
				"port": "22",
				"bounds": [1482.4, 538, 180, 40],
				"params": {
					"output": "f:/log/script.log"
				},
				"target": {
					"0": 27,
					"1": 26
				}
			},
			"26": {
				"id": 26,
				"name": "部署项目",
				"scriptId": "afagaf",
				"ip": "192.168.1.122",
				"port": "22",
				"bounds": [1782.4, 668, 180, 40],
				"params": {
					"output": "f:/log/script.log"
				},
				"target": {}
			},
			"27": {
				"id": 27,
				"name": "脚本执行出错",
				"scriptId": "dsaf123sd",
				"ip": "192.168.1.3",
				"port": "2212",
				"bounds": [1482.4, 668, 180, 40],
				"params": {
					"output": "f:/log/script.log",
					"type": "1"
				},
				"target": {}
			}
		},
		"start": "1"
	},
	
]