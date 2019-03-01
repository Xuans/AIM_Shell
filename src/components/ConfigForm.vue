<template>
    <div class="config-form-ctn">
        <div style="text-align:right;">
            <el-button size="mini" icon="el-icon-plus" circle v-on:click="add"></el-button>
        </div>
        <el-collapse accordion>
            <el-collapse-item v-for="(item) in data" :key="item.uid">
                <template slot="title" class="config-list-header">
                    <div class="form-line">
                        <label class="form-name" :for="item.name">{{item.label}}</label>
                        <div class="form-toollit">
                            <el-button size="mini" icon="el-icon-delete" circle
                                       v-on:click="()=>{del(item.uid)}"></el-button>
                        </div>
                    </div>
                </template>
                <div>
                    <el-form label-width="80px" v-if="item.component==='input'">
                        <el-form-item label="名称">
                            <el-input v-model="item.name" :readonly="true"></el-input>
                        </el-form-item>
                        <el-form-item label="别名">
                            <el-input v-model="item.alais"></el-input>
                        </el-form-item>
                        <el-form-item label="中文名">
                            <el-input v-model="item.label"></el-input>
                        </el-form-item>
                        <el-form-item label="值">
                            <el-input v-model="item.value"></el-input>
                        </el-form-item>
                        <el-form-item label="长度">
                            <el-input v-model="item.length"></el-input>
                        </el-form-item>
                    </el-form>
                    <el-form v-else-if="item.component==='select'">
                        <el-form-item label="名称">
                            <el-input v-model="item.name" :readonly="true"></el-input>
                        </el-form-item>
                        <el-form-item label="别名">
                            <el-input v-model="item.alais"></el-input>
                        </el-form-item>
                        <el-form-item label="中文名">
                            <el-input v-model="item.label"></el-input>
                        </el-form-item>
                        <el-form-item label="值">
                            <el-input v-model="item.value"></el-input>
                        </el-form-item>
                        <el-collapse accordion>
                            <el-collapse-item v-for="(option) in item.options" :key="option.value">
                                <template slot="title" class="config-list-header">
                                    <div class="form-line">
                                        <label class="form-name">{{option.label}}</label>
                                        <div class="form-toollit">
                                            <el-button
                                                    size="mini"
                                                    icon="el-icon-delete"
                                                    circle
                                                    v-on:click="()=>{delOption(item.uid,option.value)}"
                                            ></el-button>
                                        </div>
                                    </div>
                                </template>
                                <div>
                                    <el-form label-width="80px">
                                        <el-form-item label="值">
                                            <el-input v-model="option.value"></el-input>
                                        </el-form-item>
                                        <el-form-item label="描述">
                                            <el-input v-model="option.label"></el-input>
                                        </el-form-item>
                                    </el-form>
                                </div>
                            </el-collapse-item>
                        </el-collapse>
                    </el-form>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
	import uid from "uid";

	let cursor = 0;

	export default {
		name: "ConfigForm",
		props: {
			data: Array
		},
		data: function () {
			return {
				list: [""]
			};
		},
		methods: {
			add() {
				const acc = ++cursor;
				this.data.push({
					label: "中文名" + acc,
					name: "EN_NAME" + acc,
					uid: uid(48),
					component: "input",
					value: ""
				});
			},
			del(uid) {
				const idx = this.data.findIndex(e => e.uid === uid);

				this.data.splice(idx, 1);
			},
			delOption(uid, value) {
			}
		}
	};
</script>
<style lang="less">
    .config-form-ctn {
        .form-line {
            width: 100%;

            > .form-name {
                font-weight: 600;

                &::after {
                    content: attr(for);
                    color: #aaa;
                    padding: 0.5em;
                }
            }
            > .form-toollit {
                float: right;

                > .el-button {
                    border: none;
                }
            }
        }
    }
</style>



