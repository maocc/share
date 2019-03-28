(function ($, BMap) {
    window.wzMap= {
        createMap: createMap,
        createCar: createCar,
        createStation:createStation,
        createIcon: createIcon,
        createInfoWindow: createInfoWindow,
        pointsToBaiDu: pointsToBaiDu,
        zoom: zoom
    };

    // 创建地图
    function createMap(opt) {
        var defaultConfig = {
            navigationControl: {
                anchor: BMAP_ANCHOR_TOP_LEFT,
                offset: new BMap.Size(20, 20),
            },
            overviewMapControl: {}
        }

        var config = $.extend({}, defaultConfig, opt);

        var map = new BMap.Map('mymap');
        map.enableScrollWheelZoom();// 启用地图滚轮放大缩小
        map.addControl(new BMap.NavigationControl(config.navigationControl));// 向地图中添加缩放控件
        map.addControl(new BMap.OverviewMapControl(config.overviewMapControl)); // 向地图中添加缩略图控件
        // map.addControl(new BMap.ScaleControl());  （地图缩放前会显示黑块，暂不启用）
        return map;
    }

    // 一个整理过的汽车对象
    // "carId": "car_10000m332df7",
    // "cartypeName": "奥迪A4L",
    // "deviceNo": "115011000000002",
    // "direction": 154.3,
    // "ignited": false,
    // "latitude/baiDuLatitude": 29.432166,
    // "longitude/baiDuLongitude": 106.36373,
    // "license": "京A00024",
    // "ignited":true,
    // "direction":130
    function createCar(car, icon, haslabel) {
        var point;
        if (car.baiDuLatitude) {
            point = new BMap.Point(car.baiDuLongitude, car.baiDuLatitude);
        } else {
            point = new BMap.Point(car.longitude, car.latitude);
        }
        var marker = new BMap.Marker(point, {
            icon: icon,
            rotation: car.direction
        });
        if (haslabel === true) {
            var label = new BMap.Label(car.license, {
                offset: new BMap.Size(-20, -20),
                position: point
            });
            label.setStyle({
                backgroundColor: '#2894FF',
                color: '#fff',
                border: 0,
                padding: '3px 10px',
                'max-width': 'none',
                opacity: '.7'
            });
            marker.setLabel(label);
        }
        return {
            info: car,
            point: point,
            marker: marker
        };
    }
    //创建网点标识
    function createStation(station, icon, haslabel) {
        var point = new BMap.Point(station.baiduLongitude, station.baiduLatitude);
        var marker = new BMap.Marker(point, {
            icon: icon
        });
        if (haslabel === true) {
            var label = new BMap.Label(station.stationName, {
                offset: new BMap.Size(-20, -20),
                position: point
            });
            label.setStyle({
                backgroundColor: '#2894FF',
                color: '#fff',
                border: 0,
                padding: '3px 10px',
                'max-width': 'none',
                opacity: '.7'
            });
            marker.setLabel(label);
        }
        return {
            info: station,
            point: point,
            marker: marker
        };
    }
    /**
     * 创建一个图标覆盖物
     * @param imgName       string      图片名称
     * @param iw            int         图片宽度
     * @param ih            int         图片高度
     * @returns {BMap.Icon}             百度地图Icon对象
     */
    function createIcon(imgName, iw, ih) {
        var w = iw || 50;
        var h = ih || 40;
        var base = '/resources/skin/img/mapIcon/';
        return new BMap.Icon(base + imgName + '.png', new BMap.Size(w, h));
    }

    function createInfoWindow() {
        return new BMap.InfoWindow('', {
            offset: new BMap.Size(15, -15),
            enableMessage: false,
            enableAutoPan: false
        });
    }

    //坐标转换
    //points格式（[[longitude,latitude],[longitude,latitude]]）
    //执行完成调用callback（转义后points）,
    function pointsToBaiDu(points, callback) {
        var len = points.length;
        var size = 100;//步长
        var parts = Math.ceil(len / size);
        var backs = 0;
        var queue = [];//存储转义后的坐标
        var getBaiduPoints = function (index) {
            var next = index + size > len ? len : index + size;
            var coords = [];
            points.slice(index, next).forEach(function (e) {
                coords.push(e.join(','));
            });
            coords = coords.join(';');
            $.ajax({
                url: 'http://api.map.baidu.com/geoconv/v1/',
                type: 'GET',
                data: {
                    'ak': 'F59c827e67962dac05cfb696941530af',
                    'output': 'json',
                    'coords': coords
                },
                dataType: 'jsonp',
                success: function (res) {
                    //console.log(res);
                    if (res.status === 0) {
                        res.result.forEach(function (e, i) {
                            queue[index + i] = ([e.x, e.y]);
                        });
                    }
                    backs++;
                    if (backs >= parts) {
                        callback(queue);
                    }
                },
                error:function(){
                    backs++;
                    if (backs >= parts) {
                        callback(queue);
                    }
                },

            });
            if (next < len) {
                getBaiduPoints(next);
            }
        };
        //开始转义
        getBaiduPoints(0);
    }

    //缩放
    function zoom(map) {
        //缩放
        var localcity = new BMap.LocalCity();
        localcity.get(function (result) {
            map.centerAndZoom(result.name, result.level);
        });
    }
})(window.jQuery, window.BMap);
