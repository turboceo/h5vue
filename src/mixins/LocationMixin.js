let solutionO1Promise = () =>
  new Promise((resolve) => {
    let geolocation = new BMap.Geolocation()
    // 开启SDK辅助定位
    geolocation.enableSDKLocation()
    geolocation.getCurrentPosition(
      function (res) {
        let { lng, lat } = res.point
        const geo = new BMap.Geocoder()
        geo.getLocation(new BMap.Point(lng, lat), (res) => {
          resolve(res)
        })
      },
      { enableHighAccuracy: true }
    )
  })

let LocationMixin = {
  methods: {
    handlePosition (x, y) {
      var newpoint = new BMap.Point(x, y)
      var convertor = new BMap.Convertor()
      var pointArr = []
      pointArr.push(newpoint)

      return new Promise((resolve, reject) => {
        // 转换坐标
        convertor.translate(pointArr, 1, 5, function (point) {
          let poi = point.points[0]
          let promise01 = solutionO1Promise(poi)
          Promise.all([
            promise01
          ])
            .then((ret) => {
              let [ret1] = ret
              console.log('log ret::')
              console.log(JSON.stringify(ret))
              console.log('log ret1::')
              console.log(JSON.stringify(ret1))
              // if (!ret1) {
              //     let address = ret[0].address
              //     console.log(`address: ${address}`)
              //     resolve(address)
              //     return
              // }
              let address = ''
              // 增加判断，避免surroundingPois列表为空导致报错的场景
              if (ret1 && ret1.surroundingPois && ret1.surroundingPois.length === 0) {
                address = ret1.address
              } else {
                address = ret1.surroundingPois[0].address || ret1.surroundingPois[0].title
              }
              resolve(address)
            })
            .catch((err) => {
              console.log('Log Baidu Get Location Error:')
              console.log(err)
            })
        })
      })
    },

    getLocationViaHtml5 () {
      let vm = this
      let errMsg = '请开启手机的定位权限'

      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          console.log('===> 不支持navigator.geolocation')
          reject(errMsg)
          return
        }

        navigator.geolocation.getCurrentPosition(
          function (position) {
            // 得到html5定位结果
            var x = position.coords.longitude
            var y = position.coords.latitude
            let pos = [x, y]
            // 由于html5定位的结果是国际标准gps，所以需要转为百度坐标系，from=1，to = 5;
            vm.handlePosition.apply(vm, pos).then(resolve).catch(reject)
          },
          function (e) {
            console.log('===> 支持navigator.geolocation, 错误信息:')
            vm.form.location = '测试地址'
            reject(e.message)
          }
        )
      })
    }
  }
}

export default LocationMixin
