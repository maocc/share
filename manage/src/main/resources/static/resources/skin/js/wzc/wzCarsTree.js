(function(){

    //创建车辆树
    function create(id, data, carIds) {
        var data = _Format(data, carIds);
        var tree = $(id)
            .jstree({
                "checkbox": {
                    "keep_selected_style": false
                },
                "plugins": ["checkbox"],
                core: {
                    data: data
                }
            });
        return tree;
    }

    //车辆原始数据整理
    function _Format(data, carIds) {
        var obj = data;
        var arr = [];
        //获取根节点车辆
        getCarList(obj.storeCarList, arr);
        //获取区域列表及其以下所有信息
        getchildren(obj.districtList, arr);
        //获取根节点门店
        getStoreList(obj.storeList, arr);
        return arr;
        function getchildren(childrenList, arr) {
            childrenList.forEach(function (e) {
                var district = {
                    id: e.id,
                    pid: e.parentId,
                    text: e.districtName,
                    icon: 'district',
                    children: []
                };
                if (e.storeList != null) {
                    e.storeList.forEach(function (e) {
                        var store = {
                            id: e.id,
                            pid: e.districtId,
                            text: e.storeName,
                            icon: 'store',
                            children: []
                        }
                        e.carList.forEach(function (e) {
                            var selected = carIds.indexOf(e.carId) > -1 ? true : false;
                            store.children.push({
                                id: e.carId,
                                text: e.license,
                                pid: e.storeid,
                                icon: 'car',
                                state: {
                                    selected: selected
                                }
                            });
                        });
                        district.children.push(store);
                    });
                }

                if (e.childrenList != null) {
                    getchildren(e.childrenList, district.children);
                }
                arr.push(district);
            });
        }

        function getStoreList(storeList, arr) {
            storeList.forEach(function (e) {
                var store = {
                    id: e.id,
                    pid: e.companyId,
                    text: e.storeName,
                    icon: 'store',
                    children: []
                }
                e.carList.forEach(function (e) {
                    var selected = carIds.indexOf(e.carId) > -1 ? true : false;
                    store.children.push({
                        id: e.carId,
                        text: e.license,
                        pid: e.storeid,
                        icon: 'car',
                        state: {
                            selected: selected
                        }
                    });
                });
                arr.push(store);
            });
        }

        function getCarList(carlist, arr) {
            carlist.forEach(function (e) {
                var selected = carIds.indexOf(e.carId) > -1 ? true : false;
                var car = {
                    id: e.carId,
                    text: e.license,
                    pid: e.storeid,
                    icon: 'car',
                    state: {
                        selected: selected
                    }
                }
                arr.push(car);
            });
        }
    }
    
    window.carsTreeCreate=create;
})();


