//百度地图绘图模块
(function () {
    window.wzDraw = {
        //设置提示标语
        createAlarmLabel: createAlarmLabel,
        //选择绘制图形
        setDrawMode: setDrawMode,
        //获取图形数据
        getCoords: getCoords,
        //根据图形数据绘制图形
        drawCoords: drawCoords
    }
    function createAlarmLabel(map, type) {

        var content = {
            polygon: '单击开始，双击结束',
            circle: '请按住鼠标拖拽画圆',
            rectangle: '请按住鼠标拖拽矩形'
        }
        var opts = {
            offset: new BMap.Size(20, -10)    //设置文本偏移量
        };
        var alarmLabel = new BMap.Label(content[type], opts);  // 创建文本标注对象
        alarmLabel.setStyle({
            color: "red",
            fontSize: "12px",
            fontFamily: "微软雅黑"
        });
        map.addOverlay(alarmLabel);
        map.addEventListener("mousemove", function (e) {
            alarmLabel.setPosition(e.point);
        });
        return alarmLabel;
    }

    function setDrawMode(drawingManager, type, label) {
        if (type === 'rectangle') {
            drawingManager.setDrawingMode(BMAP_DRAWING_RECTANGLE);
            return true;
        } else if (type === 'circle') {
            drawingManager.setDrawingMode(BMAP_DRAWING_CIRCLE);
            return true;
        } else if (type === 'polygon') {
            drawingManager.setDrawingMode(BMAP_DRAWING_POLYGON);
            return true;
        } else {
            return false;
        }
    };
    //获取关键数据
    function getCoords(overlay) {
        if (overlay == null) {
            return null;
        }
        var source = {}
        //圆形
        if (typeof overlay.getRadius == 'function') {
            source.type = 2;
            var center = overlay.getCenter();
            source.coords = {
                lat: center.lat,
                lng: center.lng,
                r: overlay.getRadius()
            }
            //多边形
        } else if (typeof overlay.getPath == 'function') {
            source.type = 3;
            source.coords = [];
            overlay.getPath().forEach(function (e) {
                source.coords.push({
                    lat: e.lat,
                    lng: e.lng
                });
            });
        }
        return source;
    }

    function drawCoords(map, source) {
        var overlay = null;
        //矩形多边形
        if (source.type == 3) {
            var points = [];
            source.coords.forEach(function (e) {
                points.push(new BMap.Point(e.lng, e.lat));
            });
            overlay = new BMap.Polygon(points);
            map.addOverlay(overlay);
            map.setViewport(points);
            //圆
        } else if (source.type == 2) {
            var center = new BMap.Point(source.coords.lng, source.coords.lat);
            overlay = new BMap.Circle(center, source.coords.r);
            map.addOverlay(overlay);
            map.centerAndZoom(center, 11);
        }
        return overlay;
    }
})();
