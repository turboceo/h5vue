const MOVIE_EXT_RE = /\.(?:avi|wmv|mpg|mpeg|mov|rm|ram|swf|flv|mp4)/
let toArray = arr => arr.map((file) => file.url).join(',') || ''

export let itemAdapter = (item) => {
    let evidVidList = []
    let evidPicList = []

    // 现场图片
    item.fileList.forEach(item => {
        debugger
        if (MOVIE_EXT_RE.test(item.name)) {
            evidVidList.push(item)
            return
        }
        evidPicList.push(item)
    })

    return {
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
};

export const fakeList = [
    {
        "id": "1626396762396311554",
        "companyCode": "T0201",
        "riskLeve": "C",
        "riskCata": "公司管理",
        "ruleDocu": "1",
        "ruleCont": "17.船舶航行的最小富余水深没有明确内容。",
        "briefCont": "最小富余水深",
        "prioritis": "业务级",
        "ranking": "2",
        "respFor": "1626938686270230529",
        "highRank": 2,
        "model": 2,
        "showForm": true,
        "remark": "ajax",
        "fileList": [
            {
                "name": "461d5b779691c9181d66454578da54f6.jpg",
                "url": "http://39.104.179.27:9000/pyzltest/2023/03/30/67a514c24d45478bb0af73b952882bb4.jpg",
                "uid": 1680178929065,
                "status": "success"
            },
            {
                "name": "testvideo.mp4",
                "url": "http://39.104.179.27:9000/pyzltest/2023/03/30/0c3f7dcaed1b4555b64ddf2e2fbaaf14.mp4",
                "uid": 1680178951979,
                "status": "success"
            }
        ]
    },
    {
        "id": "1626396797070622721",
        "companyCode": "T0201",
        "riskLeve": "A",
        "riskCata": "公司管理",
        "ruleDocu": "2",
        "ruleCont": "6.危险货物道路运输运单，未携带或与运输的货物等信息不相符。",
        "briefCont": "危货单货不符",
        "prioritis": "业务级",
        "ranking": "2",
        "respFor": "1626938686270230529",
        "highRank": 2,
        "model": 2,
        "showForm": true,
        "remark": "",
        "fileList": [
            {
                "name": "test-video-02.mp4",
                "url": "http://39.104.179.27:9000/pyzltest/2023/03/30/131fefd349e2445484db816f6ada4b4e.mp4",
                "uid": 1680179017310,
                "status": "success"
            }
        ]
    }
]