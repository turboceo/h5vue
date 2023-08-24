<template>
    <div class="check">
        <div class="check--inner" :class="{ 'has--error': errorMsg }">
            <van-notice-bar v-show="show.notication" left-icon="info-o" class="notification-bar">
                {{ errorMsg }}
            </van-notice-bar>

            <!-- 卡片 -->
            <CardBox title="运单信息" type="simple" :show-toggler="false">
                <!-- 检查地点 -->
                <!-- <van-field v-model="form.location" center clearable required label="检查地点" placeholder="请选择" readonly>
                    <template #button>
                        <van-button :loading="loading.getLocation" @click="debounceActionHandler('getLocation')"
                            size="small" type="info" icon="location">获取定位</van-button>
                    </template>
                </van-field> -->

                <!-- 车牌号 -->
                <van-field readonly :value="form.vehiNo" center required label="车牌号" placeholder="请选择车牌号"
                    @click-input="show.vehiNoList = true">
                    <template #button>
                        <van-uploader :before-read="beforeRead" :after-read="afterRead">
                            <van-button icon="photograph" size="small" type="info">拍照识别</van-button>
                        </van-uploader>
                    </template>
                </van-field>

                <!-- 其它信息 -->
                <div class="extra-info" v-show="showExtraInfo">
                    <van-divider dashed>其它信息</van-divider>
                    <!-- 挂车号 -->
                    <van-field readonly :value="form.trailerNo" center disabled label="挂车号" placeholder=""></van-field>
                    <!-- 承运商 -->
                    <van-field v-model="form.splName" center disabled label="承运商" placeholder="">
                    </van-field>
                    <!-- 客户 -->
                    <van-field v-model="form.client" center disabled label="客户" placeholder="">
                    </van-field>
                </div>

                <template v-if="$route.query.type === 'sgs'">
                    <div class="tab-bar">
                        <div class="tab-item" :class="{ 'is--current': sgsType === 1 }"
                            @click="debounceActionHandler('changeSgsType', 1)">巡检</div>
                        <div class="tab-item" :class="{ 'is--current': sgsType === 2 }"
                            @click="debounceActionHandler('changeSgsType', 2)">系统影像分析</div>
                    </div>

                    <Card1Panel :sgs-type="sgsType" :sgs-form="sgsForm"></Card1Panel>
                </template>

                <!-- 操作栏 -->
                <div class="fixed--bottom flex justify-center check--action" style="z-index: 2">
                    <van-button :disabled="disabled.doCheck" style="width: 80%;" :loading="loading.doCheck"
                        @click="debounceActionHandler('doCheck')" type="info" loading-type="spinner" loading-text="正在处理..."
                        block>进行检查</van-button>
                </div>
            </CardBox>

            <!-- 运单列表 -->
            <van-action-sheet v-model="show.deliNoList" title="选择运单">
                <ul class="dropdown--list is--static p-15">
                    <li class="dropdown--item" v-for="(item, $index) in deliList" :key="$index">
                        <van-checkbox v-model="item.checked" shape="square" @change="handleDeliNoRowCheck"></van-checkbox>
                        <div class="dropdown--item__info">
                            <p>车牌号:{{ item.truckNo }}</p>
                            <p>货品名: {{ item.cargoName }}</p>
                            <p>提货点: {{ item.unloadAt }}</p>
                        </div>
                    </li>
                </ul>
            </van-action-sheet>

            <!-- 车牌号抽屉 -->
            <DrawerSearch v-model="show.vehiNoList">
                <CarSearchPanel @confirm="handleCarNoSelect" @close="show.vehiNoList = false"></CarSearchPanel>
            </DrawerSearch>
        </div>
    </div>
</template>
  
<script>
import { listWaybill } from "@/api/system/waybill";
import { uploadFile } from "@/api/system/oss";
import { carOcr } from "@/api/carOcr";
import CardBox from 'components/CardBox/IndexView'
import LocationMixin from '@/mixins/LocationMixin'
import DebounceMixin from '@/mixins/DebounceMixin'

import { loadScript } from '@/utils/index'

import compose from 'koa-compose'

export default {
    name: "CheckPage",

    mixins: [LocationMixin, DebounceMixin],

    components: {
        CardBox,
        CarSearchPanel: () => import(/* webpackChunkName: "car-search--panel" */ './CarSearchPanel/index.vue'),
        Card1Panel: () => import(/* webpackChunkName: "card1--panel" */ './Card1Panel/index.vue'),
    },

    data() {
        return {
            disabled: {
                doCheck: false
            },
            showExtraInfo: false,
            errorMsg: "",

            loading: {
                getLocation: false,
                doCheck: false,
            },

            form: {
                location: "",
                vehiNo: "",
                trailerNo: "",
                deliNo: "",
                splName: "",
                client: "",
                isChecking: false,
            },

            show: {
                notication: false,
                deliNoList: false,
                vehiNoList: false,
                // vehiNoList: true,
            },

            deliList: [],

            sgsType: 1,

            sgsForm: {
                // ++++++++ 基础信息 +++++
                dsMonitoring: 1,

                analysisTime: 0,

                // SD卡状态
                sdState: 2,

                // 防御性Item Id
                defensiveDrivingRules: '',
                // 防御性驾驶附件
                defensiveDrivingRulesFile: [],
                // 酒精测试附件
                alcoholFile: [],
                // 酒精测试数字
                alcoholNumber: '0',
                // 酒精测试结果
                alcoholResult: '',


                // 是否按照规定路线行驶，1 是 2否
                onLine: 1,

                // 实际路线
                relyLine: '',

                // GPS附件
                gpsFile: [],

                // 毒品测试
                narcotics: '',
                // 毒品测试结果
                narcoticsResult: '',
                // 毒品测试附件
                narcoticsFiles: [],

                // 是否超速，1是 2否
                speedingOver: 2,
                // 超速比率
                speedingProportion: '',
                // 车速测定附件
                speedingFiles: [],
            },
        };
    },

    methods: {
        /**
         * 动作处理器
         */
        actionHandler(action, options = {}) {
            /**
             * Action策略
             */
            let actionStrategies = {
                doCheck(options) {
                    this.doAction('doCheck')
                },

                getLocation(options) {
                    this.doAction('getLocation', 'location')
                },

                /**
                 * 更改SGS巡检类型
                 * @param {Number} type SGS巡检类型
                 */
                changeSgsType(type) {
                    this.sgsType = type
                    this.show.deliNoList = false
                    this.deliList = []
                }
            }

            // 动作策略
            let actionStrategy = actionStrategies && actionStrategies[action];
            actionStrategy && actionStrategy.call(this, options);
        },

        // ++++++++++++++++++ 文件上传相关功能 ++++++++++++++
        beforeRead(file) {
            if (file.type === "image/jpeg" || file.type === "image/png") {
                return true;
            }
            this.$toast("请上传 jpg/png 格式的图片");
            return false;
        },

        async afterRead(file) {
            //文件读取完成后的回调函数
            try {
                this.$toast("正在识别,请稍等...");
                let ocrReulst = await this.handleCarOcr(file.file, "车牌号识别失败");
                this.form.vehiNo = ocrReulst;
            } catch (err) {
                this.$toast(err);
            }
        },

        // ++++++++++++++++++ 文件上传相关功能 ++++++++++++++
        /**
         * 处理车牌号面板确认操作
         * @param {Object} item 
         */
        handleCarNoSelect(item) {
            this.form.vehiNo = item.vehiNo
        },

        /**
         * 处理车牌号识别
         * @param {File} file 文件上传对象
         * @param {String} errorMsg 错误信息
         */
        handleCarOcr(file, errorMsg) {
            return new Promise((resolve, reject) => {
                let fd = new window.FormData();
                fd.append("file", file, file.name);
                uploadFile(fd)
                    .then((ossResponse) => {
                        let carImageUrl = ossResponse.data.url;
                        let fd2 = new window.FormData();
                        fd2.append("carImageUrl", carImageUrl);
                        carOcr(fd2)
                            .then((ocrResponse) => {
                                if (ocrResponse.code === 200) {
                                    resolve(ocrResponse.data);
                                }
                                reject(errorMsg);
                            })
                            .catch(() => reject(errorMsg));
                    })
                    .catch(() => reject(errorMsg));
            });
        },


        /**
         * 处理运单号选择
         * @param {Boolean} checked 是否选中
         */
        handleDeliNoRowCheck(checked) {
            if (!checked) return
            let checkedItem = this.deliList.find((item) => item.checked);
            if (!checkedItem) return;
            this.show.deliNoList = false;
            // 承运商
            this.form.splName = checkedItem.carrierName;
            // 客户
            this.form.client = checkedItem.codriName;
            // 挂车号
            this.form.trailerNo = checkedItem.trailerNo;
            this.showExtraInfo = true
            this.disabled.doCheck = true
            this.errorMsg = "即将进入填写检查项页面...";
            this.show.notication = true;
            let pushToSelectPage = () => {
                let { type } = this.$route.query
                let { deliNo } = checkedItem
                if (type === 'sgs') {
                    let d = this.sgsForm
                    localStorage.setItem('sgsForm', JSON.stringify(d))
                }
                this.$router.push({
                    name: "select",
                    // 路由参数
                    query: {
                        deliNo,
                        type
                    },
                });
            }
            let t = setTimeout(() => {
                t && clearTimeout(t);
                pushToSelectPage();
            }, 2000);
        },

        doAction(action, prop, label) {
            let actionStrategies = {
                /**
                 * 获取检查地点
                 */
                getLocation: async function (attr) {
                    try {
                        let address = await this.getLocationViaHtml5()
                        this.loading.getLocation = false;
                        this.form[attr] = address
                    } catch (err) {
                        console.log('log getLocation err:')
                        console.log(err)
                        // alert('获取检查地点异常')
                    }
                },

                /**
                 * 进行检查
                 */
                doCheck: async function () {
                    // 当前处理中，就立即返回
                    if (this.loading.doCheck) return;

                    let m1 = async (ctx, next) => {
                        let f = ctx.form;
                        if (f.location === "") {
                            this.errorMsg = "请选择检查地点";
                            this.show.notication = true;
                            return;
                        }
                        await next()
                    }

                    let m2 = async (ctx, next) => {
                        let f = ctx.form;
                        if (f.vehiNo === "") {
                            this.errorMsg = "请选择车牌号";
                            this.show.notication = true;
                            return;
                        }
                        await next()
                    }

                    let m3 = async (ctx, next) => {
                        let { type } = ctx.$route.query
                        let sgsForm = ctx.sgsForm
                        if (type === 'sgs' && this.sgsType === 1) {
                            if (sgsForm.defensiveDrivingRules === '') {
                                this.errorMsg = '请选择防御性驾驶细则';
                                this.show.notication = true;
                                return
                            }

                            if (sgsForm.defensiveDrivingRulesFile.length === 0) {
                                this.errorMsg = '请上传防御性驾驶附件';
                                this.show.notication = true;
                                return
                            }

                            if (sgsForm.alcoholResult === '') {
                                this.errorMsg = '请输入酒精测试结果';
                                this.show.notication = true;
                                return
                            }

                            if (sgsForm.alcoholFile.length === 0) {
                                this.errorMsg = '请上传酒精测试附件';
                                this.show.notication = true;
                                return
                            }

                            if (sgsForm.onLine === 2 && sgsForm.relyLine === '') {
                                this.errorMsg = '请输入实际路线';
                                this.show.notication = true;
                                return
                            }

                            if (sgsForm.gpsFile.length === 0) {
                                this.errorMsg = '请上传GPS附件';
                                this.show.notication = true;
                                return
                            }

                            if (sgsForm.narcoticsResult === '') {
                                this.errorMsg = '请输入毒品测试结果';
                                this.show.notication = true;
                                return
                            }

                            if (sgsForm.narcoticsFiles.length === 0) {
                                this.errorMsg = '请上传毒品测试附件';
                                this.show.notication = true;
                                return
                            }

                            if (sgsForm.speedingOver === 1 && sgsForm.speedingProportion === '') {
                                this.errorMsg = '请输入超速比率';
                                this.show.notication = true;
                                return
                            }

                            if (sgsForm.speedingFiles.length === 0) {
                                this.errorMsg = '请上传车速测定附件';
                                this.show.notication = true;
                                return
                            }
                            await next()
                            return
                        }
                        await next()
                    }

                    let m4 = async (ctx, next) => {
                        let { type } = ctx.$route.query
                        let sgsForm = ctx.sgsForm
                        if (type === 'sgs' && this.sgsType === 2) {
                            if (sgsForm.defensiveDrivingRules === '') {
                                this.errorMsg = '请选择防御性驾驶细则';
                                this.show.notication = true;
                                return
                            }
                            if (sgsForm.defensiveDrivingRulesFile.length === 0) {
                                this.errorMsg = '请上传防御性驾驶附件';
                                this.show.notication = true;
                                return
                            }
                            await next()
                            return
                        }
                        await next()
                    }

                    // Reset State Middleware
                    let resetStateMiddleware = async (ctx, next) => {
                        this.errorMsg = "";
                        this.show.notication = false;
                        await next()
                    }

                    let runMiddleware = compose([
                        // m1,
                        m2,
                        // m3,
                        // m4,
                        resetStateMiddleware
                    ]);


                    // 表单验证

                    try {
                        await runMiddleware(this)
                        console.log(`Run Middleware::))`)
                        if (this.errorMsg) return
                        this.loading.doCheck = true;
                        try {
                            let vehiNo = this.form.vehiNo;
                            let res = await listWaybill({
                                // 车牌号
                                truckNo: vehiNo,
                            });
                            this.loading.doCheck = false;

                            if (res.rows.length === 0) {
                                this.$toast("暂无对应车号的运单数据");
                                return;
                            }
                            this.show.deliNoList = true;
                            this.deliList = res.rows;
                        } catch (error) {
                            debugger;
                            this.loading.doCheck = false;
                        }
                    } catch (err) {
                        console.log("middleware error...");
                        console.log(err);
                    }
                },
            };
            let func = actionStrategies && actionStrategies[action];
            // 执行策略
            func && func.call(this, prop, label);
        }
    },

    created() {
        /**
         * 获取微信签名
         */
        // getWxConfig().then(res => {
        //     debugger
        //     console.log(res)
        // }).catch((err) => {
        //     console.log('Get weixin error:')
        // })
        // 加载百度定位脚本
        // this.hasLoadBaiduMapScript = false
        // if (this.hasLoadBaiduMapScript) return
        // loadScript('https://api.map.baidu.com/getscript?v=2.0&ak=7r7MktFQ3ohj2knZab6UkFY4QhzM1DnI&services=&t=20230104104957')
        //     .then(() => {
        //         this.hasLoadBaiduMapScript = true
        //         // 获取用户地理位置
        //         this.doAction("getLocation", "location");
        //     })

        this.showExtraInfo = true
    },
};
</script>
  
<style lang="scss" scoped>
$dropdown-bg: #f7f8fa;

.check {
    &--inner {
        padding: 15px;

        &.has--error {
            padding-top: 50px;
        }
    }
}

.dropdown--overlay {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
}

.dropdown--item {
    display: flex;
    padding: 5px 10px;
    background: $dropdown-bg;
    color: #323233;
    border-radius: 99px;

    border-radius: 5px;
    margin-bottom: 10px;

    &__info {
        flex: 1;
        margin-left: 10px;
        font-size: 15px;

        p {
            margin: 4px;
        }

        p:nth-child(1) {
            font-size: 20px;
        }
    }
}

// 通知栏
.notification-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
}

.deli--container {
    background: white;
}

.check--action {
    padding-top: 15px;
    padding-bottom: 15px;
}

.table-row {
    position: relative;

    &::after {
        position: absolute;
        content: "";
        height: 1px;
        background: #d5d5d5;
        width: 100%;
        top: 100%;
    }

    &.is-head::after {
        width: calc(100% - 60px);
        left: 60px;
        height: 2px;
    }

    span {
        // background: #fff;
        height: 35px;
        flex: 1;

        &.header-cell {
            font-weight: 500;
        }

        &.checkbox-cell {
            flex: 0 0 60px;
        }

        display: flex;
        justify-content: center;
        align-items: center;

        color: #151515;
        font-weight: 350;

        &.is--important {
            color: #be0004;
        }

        &.hidden {
            visibility: hidden;
        }

        @at-root .w100 & {
            flex: 0 0 100px;
        }
    }
}

// Tab Bar
.tab {
    &-bar {
        display: flex;
        align-items: flex-end;
        background: whitesmoke;
        padding: 10px;
        margin-top: 20px;
    }

    &-item {
        padding: 10px 20px;
        color: #151515;
        background: #fefefe;
        margin-right: 10px;
        border-radius: 5px;

        &.is--current {
            background: #8d9faf;
            color: #fefefe;
            padding: 12px 24px;
        }
    }
}
</style>
  