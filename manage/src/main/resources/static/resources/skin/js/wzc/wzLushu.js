/**
 * 最后修改：庞滨
 * 修改时间：2017-04-13
 */
(function (win, BMap) {
    /*
     * 百度lushu 改造版
     * 取消原来途经点功能
     * 只兼容到ie9

     LuShu类接口
     构造函数:
     map: baidu Map实例
     icon:BMap.Icon实例 小车图标对象
     path:格式[{lng:'经度',lat:'纬度',label:'用于显示的其它信息，如果没有则不会显示'}]
     实例方法
     play:播放方法
     pause:暂停方法
     reset:重置方法
     setSpeed: 默认为1 表示1km/s
     setPath:重新绘制新路线
     clear:删除覆盖物及动画
     实例对象
     label:BMap.Label实例
     */
    // var LuShu = function (map, car_icon, path, opt) {
    var LuShu = function (map, car_icon, path) {

        this.onLabel = function () {};
        this.path = path;
        this.map = map;
        this._createLine();
        this._setPosition(path[0], car_icon);
        this._setRotation(path[0], path[1]);
        this._speed = 1;
        this._moveHandler = null;
        this._toPath = [];
        this._moving = false;
    };

    LuShu.prototype.play = function () {
        if (this._moving === false) {
            if (this._toPath.length < 2) {
                this._toPath = this._copyPath(this.path);
            }
            return this._move();
        }
    };

    LuShu.prototype.pause = function () {
        var p;
        if (this._moving === true) {
            clearInterval(this._moveHandler);
            p = this.marker.getPosition();
            this._toPath.unshift({
                lng: p.lng,
                lat: p.lat
            });
            return this._moving = false;
        }
    };

    LuShu.prototype.reset = function () {
        this._moving = false;
        clearInterval(this._moveHandler);
        this._toPath = [];
        this._setPosition(this.path[0]);
        return this._setRotation(this.path[0], this.path[1]);
    };

    LuShu.prototype.clear = function () {
        this.map.removeOverlay(this.line);
        this._delAline();
        return this.map.removeOverlay(this.marker);
    };

    LuShu.prototype.setSpeed = function (speed) {
        this._speed = speed;
        if (this._moving === true) {
            this.pause();
            return this.play();
        }
    };

    LuShu.prototype.setPath = function (path) {
        this.path = path;
        this.map.removeOverlay(this.line);
        this._createLine();
        return this.reset();
    };

    LuShu.prototype._setRotation = function (a, b) {
        var atan, bias, deg, disy, tan;
        deg = 0;
        a = this.map.pointToPixel(new BMap.Point(a.lng, a.lat));
        b = this.map.pointToPixel(new BMap.Point(b.lng, b.lat));
        if (b.x !== a.x) {
            tan = (b.y - a.y) / (b.x - a.x);
            atan = Math.atan(tan);
            deg = atan * 360 / (2 * Math.PI);
            if (b.x < a.x) {
                deg = -deg + 90 + 90;
            } else {
                deg = -deg;
            }
            return this.marker.setRotation(-deg + 90);
        } else {
            disy = b.y - a.y;
            bias = 0;
            if (disy > 0) {
                bias = -1;
            } else {
                bias = 1;
            }
            return this.marker.setRotation(-bias * 90 + 90);
        }
    };

    LuShu.prototype._copyPath = function (path) {
        var clonePath;
        clonePath = [];
        path.forEach(function (e) {
            return clonePath.push({
                lng: e.lng,
                lat: e.lat,
                label: e.label
            });
        });
        return clonePath;
    };

    /**
     * 设置小车
     * @param Object      p           坐标对象，lng lat alert label
     * @param BMap.icon   car_icon    百度地图图标对象实例
     */
    LuShu.prototype._setPosition = function (p, car_icon) {
        var point;
        point = new BMap.Point(p.lng, p.lat);
        if (this.marker === void 0) {
            this.marker = new BMap.Marker(point, {
                icon: car_icon
            });
            this.map.addOverlay(this.marker);
        } else {
            this.marker.setPosition(point);
        }
        if (p.label) {
            return this.onLabel(p.label);
        }
    };

    /**
     * 创建路径
     */
    LuShu.prototype._createLine = function () {
        var points = [];
        this.path.forEach(function (e) {
            return points.push(new BMap.Point(e.lng, e.lat));
        });
        // 调整地图视野包含所有坐标点
        this.map.setViewport(points);
        this.line = new BMap.Polyline(points);
        this.map.addOverlay(this.line);

        return this._endpoint(points[0], points[points.length - 1]);
    };


    LuShu.prototype._endpoint = function (a, b) {
        var marker1, marker2;

        marker1 = new BMap.Marker(a, {
            icon: new BMap.Icon('/resources/skin/img/mapIcon/startPoin.png', new BMap.Size(39, 46)),
            offset: new BMap.Size(0, -23)
        });
        marker2 = new BMap.Marker(b, {
            icon: new BMap.Icon('/resources/skin/img/mapIcon/endPoin.png', new BMap.Size(39, 46)),
            offset: new BMap.Size(0, -23)
        });
        if (this.endpoint) {
            this.map.removeOverlay(this.endpoint[0]);
            this.map.removeOverlay(this.endpoint[1]);
        }
        this.endpoint = [marker1, marker2];
        this.map.addOverlay(marker1);
        return this.map.addOverlay(marker2);
    };

    LuShu.prototype._move = function () {
        var a, b;
        if (this._toPath.length < 2) {
            return this._moving = false;
        } else {
            this._moving = true;
            a = this._toPath.shift();
            b = this._toPath[0];
            this._setRotation(a, b);
            return this._toNext(a, b, this._move.bind(this));
        }
    };

    LuShu.prototype._toNext = function (a, b, onOver) {
        var go, latItem, lat_len, len, lngItem, lng_len, max, ratio, speed, _i;
        speed = this._speed / 1000;
        _i = 1;
        lat_len = b.lat - a.lat;
        lng_len = b.lng - a.lng;
        len = Math.sqrt(Math.pow(lat_len, 2) + Math.pow(lng_len, 2));
        ratio = speed / len;
        max = Math.round(len / speed);
        latItem = ratio * lat_len;
        lngItem = ratio * lng_len;
        go = function () {
            var lat, lng;
            lat = _i * latItem + a.lat;
            lng = _i * lngItem + a.lng;
            if (max < _i++) {
                this._setPosition(b);
                clearInterval(this._moveHandler);
                return onOver();
            } else {
                return this._setPosition({
                    lng: lng,
                    lat: lat
                });
            }
        };
        return this._moveHandler = setInterval(go.bind(this), 30);
    };

    win.wzLushu = LuShu;

})(window, window.BMap);