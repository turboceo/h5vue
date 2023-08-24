// import { formatDate } from "@/utils/index";
import { addRealMonitor } from "@/api/system/realMonitor";
import { addDependencyMonitor } from '@/api/system/dependencyMonitor'
import { addSgsMonitor } from '@/api/system/sgsMonitor'

const MOVIE_EXT_RE = /\.(?:avi|wmv|mpg|mpeg|mov|rm|ram|swf|flv|mp4)/
let toArray = arr => arr.map((file) => file.url).join(',') || ''

export let checkItemAdapter = (item) => {
    let evidVidList = []
    let evidPicList = []

    // 现场图片
    item.fileList.forEach(item => {
        if (MOVIE_EXT_RE.test(item.name)) {
            evidVidList.push(item)
            return
        }
        evidPicList.push(item)
    })

    let ret = {
        // // 发现违规时间
        // inspdstartTime: Date.now(),
        // 本次检查结果
        // 1正常 2异常
        concls: item.model === 2 ? 2 : 1,
        // 百规id
        tranroleId: item.id,
        // 记录内容描述
        inspdMemo: item.remark || '',
        // 现场图片
        evidPic: toArray(evidPicList),
        evidVid: toArray(evidVidList),
        // 所在地点
        locaPlace: '',
    };

    return ret;
};

// let checkItemAdapter = (item) => {
//     return {
//         // 本次检查结果
//         concls: item.model,
//         // 发现违规时间
//         inspdstartTime: formatDate(Date.now()),
//         // 百规id
//         tranroleId: item.id,
//         // 记录内容描述
//         inspdMemo: item.remark || "",
//         // 现场图片
//         evidPic: item.fileList.map((file) => file.url).join(",") || "",
//         // 所在地点
//         locaPlace: "",
//     };
// };

let sendStrategies = {
    real: function (list) {
        let tmsRealMoniterDetailsList = list.map(checkItemAdapter)
        let data = {
            // 运单Id
            waybillId: this.deliNo,
            // 结果列表
            tmsRealMoniterDetailsList
        };
        return addRealMonitor(data)
    },

    dep: function (list) {
        let moniterDetails = list.map(checkItemAdapter)
        let data = {
            // 运单Id
            waybillId: this.deliNo,
            // 结果列表
            moniterDetails
        };
        return addDependencyMonitor(data)
    },

    sgs: function (list) {
        let adapter = item => {
            item.analysisTime = Math.floor(+item.analysisTime)
            Object.keys(item).forEach(key => {
                let val = item[key]
                if (Array.isArray(val)) {
                    item[key] = val.map(item => {
                        debugger
                        return item.url
                    }).join(',')
                }
            })
            return item
        }

        let tmsSgsMoniterDetails = list.map(checkItemAdapter)
        let sgsForm = JSON.parse(localStorage.getItem('sgsForm'))
        let ret = adapter(sgsForm)
        let data = Object.assign({}, {
            // 运单Id
            waybillId: this.deliNo,
            // 结果列表
            tmsSgsMoniterDetails
        }, ret);
        return addSgsMonitor(data)
    }
}

let SubmitMixin = {
    methods: {
        handleSubmit(list = []) {
            let type = this.__checkType__
            let func = sendStrategies && sendStrategies[type]
            return func && func.call(this, list)
        },
    },
};

export default SubmitMixin;

