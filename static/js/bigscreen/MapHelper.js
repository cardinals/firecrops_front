Ext.define('FirePlanGisApp.view.viewport.map.MapHelper', {
    singleton: true,

    requires: [
        'Ext.window.Toast'
    ],

    config: {
        attachController: null,
        currentOverlay: null,
        currentPoi: null,
        trafficLayer: null,
        autoSearch: null,
        defaultCursor: null,
        isMeasuringDis: false,
        isMeasuringArea: false,
        polyPoints: null,
        polyMarkers: null,
        measurePolyLine: null,
        measurePolyRegion: null,
        isMeasureEditing: false,
        resultDis: 0,
        resultArea: 0
    },

    ICON_W_XHS: 'resources/images/map/marker/marker_hydrant_map.png',
    ICON_W_SH: 'resources/images/map/marker/marker_crane_map.png',
    ICON_W_SC: 'resources/images/map/marker/marker_pool_map.png',
    ICON_W_QSMT: 'resources/images/map/marker/marker_wharf_map.png',
    ICON_W_TRSY: 'resources/images/map/marker/marker_naturalwater_map.png',
    ICON_ZDDW: 'resources/images/map/marker/marker_zddw_map.png',
    ICON_ZQZD: 'resources/images/map/marker/marker_zqzd_map.png',
    ICON_ZQDD: 'resources/images/map/marker/marker_zqdd_map.png',
    ICON_QYD: 'resources/images/map/marker/marker_qyd_map.png',
    ICON_XFC: 'resources/images/map/marker/marker_xfc_map.png',
    ICON_POI: 'resources/images/map/marker/cur_pos_icon.png',
    ICON_MEASURE: 'resources/images/map/marker/icon_measure.png',
    ICON_FIREENGINE_ONLINE: 'resources/images/map/marker/marker_fireengine_online_map.png',
    ICON_FIREENGINE_OFFLINE: 'resources/images/map/marker/marker_fireengine_offline_map.png',

    layerConfigs: {
        compWatersourceXhs: {
            collection: new Ext.util.MixedCollection(),
            displayStyle: 'clusterer',
            clustererStyles: [{
                url: 'resources/images/map/clusterer/xhs.png',
                size: new BMap.Size(72, 24),
                textColor: '#fff'
            }],
            clusterer: null
        },
        compWatersourceSh: {
            collection: new Ext.util.MixedCollection(),
            displayStyle: 'clusterer',
            clustererStyles: [{
                url: 'resources/images/map/clusterer/sh.png',
                size: new BMap.Size(72, 24),
                textColor: '#fff'
            }],
            clusterer: null
        },
        compWatersourceSc: {
            collection: new Ext.util.MixedCollection(),
            displayStyle: 'clusterer',
            clustererStyles: [{
                url: 'resources/images/map/clusterer/sc.png',
                size: new BMap.Size(72, 24),
                textColor: '#fff'
            }],
            clusterer: null
        },
        compWatersourceQsmt: {
            collection: new Ext.util.MixedCollection(),
            displayStyle: 'clusterer',
            clustererStyles: [{
                url: 'resources/images/map/clusterer/qsmt.png',
                size: new BMap.Size(72, 24),
                textColor: '#fff'
            }],
            clusterer: null
        },
        compWatersourceTrsy: {
            collection: new Ext.util.MixedCollection(),
            displayStyle: 'clusterer',
            clustererStyles: [{
                url: 'resources/images/map/clusterer/trsy.png',
                size: new BMap.Size(72, 24),
                textColor: '#fff'
            }],
            clusterer: null
        },
        compZddw: {
            collection: new Ext.util.MixedCollection(),
            displayStyle: 'clusterer',
            clustererStyles: [{
                url: 'resources/images/map/clusterer/zddw.png',
                size: new BMap.Size(72, 24),
                textColor: '#fff'
            }],
            clusterer: null
        },
        compZqzd: {
            collection: new Ext.util.MixedCollection(),
            displayStyle: 'clusterer',
            clustererStyles: [{
                url: 'resources/images/map/clusterer/zqzd.png',
                size: new BMap.Size(72, 24),
                textColor: '#fff'
            }],
            clusterer: null
        },
        compZqdd: {
            collection: new Ext.util.MixedCollection(),
            displayStyle: 'clusterer',
            clustererStyles: [{
                url: 'resources/images/map/clusterer/zqdd.png',
                size: new BMap.Size(72, 24),
                textColor: '#fff'
            }],
            clusterer: null
        },
        compQyd: {
            collection: new Ext.util.MixedCollection(),
            displayStyle: 'clusterer',
            clustererStyles: [{
                url: 'resources/images/map/clusterer/qyd.png',
                size: new BMap.Size(72, 24),
                textColor: '#fff'
            }],
            clusterer: null
        },
        compFireEngine: {
            collection: new Ext.util.MixedCollection(),
            // displayStyle: 'overlay' // cuihj change to overlay
            // cuihj 20171008 comment out
            displayStyle: 'clusterer',
            clustererStyles: [{
                url: 'resources/images/map/clusterer/fireengine.png',
                size: new BMap.Size(72, 24),
                textColor: '#fff'
            }],
            clusterer: null
        }
    },

    xfkLayerIds: [
        'compWatersourceXhs',
        'compWatersourceSh',
        'compWatersourceSc',
        'compWatersourceQsmt',
        'compWatersourceTrsy',
        'compZddw'
    ],

    infoWindowBaseCfg: {
        border: '1px solid #aaa',
        boxShadow: '0 0 16px rgba(0, 0, 0, 0.4)',
        borderRadius: '8px',
        fontFamily: "微软雅黑"
    },
    markerLabelStyle: {
        'fontSize': '12px',
        'fontWeight': 'bold',
        'opacity': '0.85',
        'border': '0',
        'padding': '2px 4px',
        'border-radius': '4px',
        'textAlign': 'center'
    },

    initMap: function(viewportCfg) {
        var me = this;
        var map = me.getMap();

        me.setDefaultCursor(map.getDefaultCursor());

        // init map control 
        var top_left_navigation = new BMap.NavigationControl();
        map.addControl(top_left_navigation);

        map.addControl(new BMap.PanoramaControl({
            anchor: BMAP_ANCHOR_TOP_LEFT, //位置
            offset: new BMap.Size(10, 220)
        }));

        if (!!viewportCfg && viewportCfg.length > 0) {
            var points = [];
            viewportCfg.forEach(function(pointArray) {
                var point = new BMap.Point(pointArray[0], pointArray[1]);
                points.push(point);
            });

            map.setViewport(points);
        }

        me.initMapEvent();
    },

    initMapEvent: function() {
        var me = this;
        var map = me.getMap();

        me.tilesLoadListener = Ext.bind(me.onMapLoaded, me);
        map.addEventListener("tilesloaded", me.tilesLoadListener);

        map.addEventListener('click', function(evt) {
            if (me.getIsMeasuringDis() || me.getIsMeasuringArea()) {
                if (me.getIsMeasureEditing()) {
                    return;
                }

                var polyPoints = me.getPolyPoints();
                if (polyPoints == null) {
                    polyPoints = new Array();
                }

                if (me.getIsMeasuringDis()) {
                    polyPoints.push(evt.point);
                    if (polyPoints.length >= 2) {
                        if (me.getMeasurePolyLine() == null) {
                            var measurePolyLine = new BMap.Polyline(polyPoints, {
                                strokeColor: "rgb(0, 255, 0)",
                                strokeWeight: 3,
                                strokeOpacity: 0.5
                            });
                            map.addOverlay(measurePolyLine);
                            me.setMeasurePolyLine(measurePolyLine);
                        } else {
                            polyPoints = me.getMeasurePolyLine().getPath();
                            polyPoints.push(evt.point);
                            me.getMeasurePolyLine().setPath(polyPoints);
                        }
                        var result = BMapLib.GeoUtils.getPolylineDistance(me.getMeasurePolyLine());
                        me.setResultDis(new Number(result).toFixed(3));
                    }
                    me.setPolyPoints(polyPoints);
                    me.drawPolyMarkers(false);
                } else {
                    polyPoints.push(evt.point);
                    if (polyPoints.length >= 3) {
                        if (me.getMeasurePolyRegion() == null) {
                            var measurePolyRegion = new BMap.Polygon(polyPoints, {
                                strokeColor: "rgb(0, 255, 0)",
                                strokeWeight: 3,
                                strokeOpacity: 0.5,
                                fillColor: "rgb(255, 255, 0)",
                                fillOpacity: 0.3
                            });
                            map.addOverlay(measurePolyRegion);
                            me.setMeasurePolyRegion(measurePolyRegion);
                        } else {
                            polyPoints = me.getMeasurePolyRegion().getPath();
                            polyPoints.push(evt.point);
                            me.getMeasurePolyRegion().setPath(polyPoints);
                        }
                        var result = BMapLib.GeoUtils.getPolygonArea(me.getMeasurePolyRegion());
                        me.setResultArea(new Number(result).toFixed(3));
                    }
                    me.setPolyPoints(polyPoints);
                    me.drawPolyMarkers(false);
                }
            }
        });
    },

    onMapLoaded: function(evt) {
        var me = this;

        var attachController = me.getAttachController();
        attachController.fireEvent('evtMapLoaded');
    },

    removeMapLoadedEvent: function() {
        var me = this;
        var map = me.getMap();
        map.removeEventListener("tilesloaded", me.tilesLoadListener);
    },

    addSearchAuto: function(fuzzyKeyField) {
        var me = this;
        var map = me.getMap();
        var ac = new BMap.Autocomplete({
            "input": fuzzyKeyField.getId() + '-inputEl',
            "location": map
        });
        ac.addEventListener("onconfirm", function(e) { //鼠标点击下拉列表后的事件
            var _value = e.item.value;
            var myValue = _value.province + _value.city +
                _value.district + _value.street + _value.business;
            var local = new BMap.LocalSearch(map, { //智能搜索
                onSearchComplete: function() {
                    var poi = local.getResults().getPoi(0);
                    alert(poi);
                    me.drawCurrentOverlay(poi);
                }
            });
            local.search(myValue);
        });
        me.setAutoSearch(ac);
    },

    deleteSearchAuto: function() {
        var me = this;

        if (me.getAutoSearch() != null) {
            me.getAutoSearch().dispose();
            me.setAutoSearch(null);
        }
    },

    removePolyMarkers: function() {
        var me = this;
        var map = me.getMap();

        var polyMarkers = me.getPolyMarkers();
        if (polyMarkers != null) {
            for (var i = 0; i < polyMarkers.length; i++) {
                map.removeOverlay(polyMarkers[i]);
            }
        }

        polyMarkers = null;
        me.setPolyMarkers(polyMarkers);
    },

    isInViewPort: function(point) {
        var me = this;
        var map = me.getMap();
        var bounds = map.getBounds();

        var sw = bounds.getSouthWest();
        var ne = bounds.getNorthEast();

        var result = false;
        if (point.lng >= sw.lng && point.lng <= ne.lng &&
            point.lat >= sw.lat && point.lat <= ne.lat) {
            result = true;
        }
        return result;
    },

    getCurrentBounds: function() {
        var me = this;
        var map = me.getMap();
        var bounds = map.getBounds();

        var sw = bounds.getSouthWest();
        var ne = bounds.getNorthEast();

        return {
            maxLon: ne.lng,
            minLon: sw.lng,
            maxLat: ne.lat,
            minLat: sw.lat
        };
    },

    drawPolyMarkers: function(poly) {
        var me = this;
        var map = me.getMap();

        var polyMarkers = me.getPolyMarkers();
        if (polyMarkers != null) {
            for (var i = 0; i < polyMarkers.length; i++) {
                map.removeOverlay(polyMarkers[i]);
            }
        }

        polyMarkers = new Array();

        var polyPoints = null;
        if (poly) {
            if (me.getIsMeasuringDis()) {
                if (me.getMeasurePolyLine() != null) {
                    polyPoints = me.getMeasurePolyLine().getPath();
                }
            } else {
                if (me.getMeasurePolyRegion() != null) {
                    polyPoints = me.getMeasurePolyRegion().getPath();
                }
            }
        } else {
            polyPoints = me.getPolyPoints();
        }
        if (polyPoints == null || polyPoints.length == 0) {
            return;
        }

        for (var i = 0; i < polyPoints.length; i++) {
            var icon = new BMap.Icon(
                me.ICON_MEASURE,
                new BMap.Size(8, 8));
            icon.setAnchor(new BMap.Size(4, 4));
            var overlay = new BMap.Marker(polyPoints[i], {
                icon: icon
            });

            map.addOverlay(overlay);
            polyMarkers.push(overlay);
        }
        me.setPolyMarkers(polyMarkers);
    },

    startMeasureDis: function() {
        var me = this;
        var map = me.getMap();

        map.setDefaultCursor("crosshair");
        me.setIsMeasuringDis(true);
        me.setPolyPoints(new Array());
        me.setIsMeasureEditing(false);
        me.setMeasurePolyLine(null);
        me.setMarkerClustererClickable(false);
    },

    endMeasureDis: function() {
        var me = this;
        var map = me.getMap();

        if (me.getMeasurePolyLine() != null) {
            map.removeOverlay(me.getMeasurePolyLine());
        }
        me.removePolyMarkers();

        map.setDefaultCursor(me.getDefaultCursor());
        me.setIsMeasuringDis(false);
        me.setPolyPoints(null);
        me.setIsMeasureEditing(false);
        me.setMeasurePolyLine(null);
        me.setMarkerClustererClickable(true);
    },

    startMeasureArea: function() {
        var me = this;
        var map = me.getMap();

        map.setDefaultCursor("crosshair");
        me.setIsMeasuringArea(true);
        me.setPolyPoints(new Array());
        me.setIsMeasureEditing(false);
        me.setMeasurePolyRegion(null);
        me.setMarkerClustererClickable(false);
    },

    endMeasureArea: function() {
        var me = this;
        var map = me.getMap();

        if (me.getMeasurePolyRegion() != null) {
            map.removeOverlay(me.getMeasurePolyRegion());
        }
        me.removePolyMarkers();

        map.setDefaultCursor(me.getDefaultCursor());
        me.setIsMeasuringArea(false);
        me.setPolyPoints(null);
        me.setIsMeasureEditing(false);
        me.setMeasurePolyRegion(null);
        me.setMarkerClustererClickable(true);
    },

    editMeasure: function() {
        var me = this;
        if (!me.getIsMeasuringDis() && !me.getIsMeasuringArea()) {
            return;
        }

        var isMeasureEditing = me.getIsMeasureEditing();
        isMeasureEditing = !isMeasureEditing;

        if (isMeasureEditing) {
            me.removePolyMarkers();
        } else {
            me.drawPolyMarkers(true);
        }

        if (me.getIsMeasuringDis()) {
            var polyLine = me.getMeasurePolyLine();
            if (polyLine != null) {
                if (isMeasureEditing) {
                    polyLine.enableEditing();
                } else {
                    polyLine.disableEditing();
                    var result = BMapLib.GeoUtils.getPolylineDistance(polyLine);
                    me.setResultDis(new Number(result).toFixed(3));
                }
            }
        } else {
            var polygon = me.getMeasurePolyRegion();
            if (polygon != null) {
                if (isMeasureEditing) {
                    polygon.enableEditing();
                } else {
                    polygon.disableEditing();
                    var result = BMapLib.GeoUtils.getPolygonArea(polygon);
                    me.setResultArea(new Number(result).toFixed(3));
                }
            }
        }
        me.setIsMeasureEditing(isMeasureEditing);
    },

    clearMeasure: function() {
        var me = this;
        if (!me.getIsMeasuringDis() && !me.getIsMeasuringArea()) {
            return;
        }

        me.setResultDis(0);
        me.setResultArea(0);

        if (me.getIsMeasuringDis()) {
            if (me.getMeasurePolyLine() != null) {
                var map = me.getMap();
                map.removeOverlay(me.getMeasurePolyLine());
            }

            me.setMeasurePolyLine(null);
        } else {
            if (me.getMeasurePolyRegion() != null) {
                var map = me.getMap();
                map.removeOverlay(me.getMeasurePolyRegion());
            }

            me.setMeasurePolyRegion(null);
        }

        me.setPolyPoints(null);
        me.setIsMeasureEditing(false);
        me.removePolyMarkers();
    },

    setMarkerClustererClickable: function(clickable) {
        var me = this;
        var layerConfigs = me.layerConfigs;
        var layers = Object.getOwnPropertyNames(layerConfigs);
        layers.forEach(function(layerId) {
            var layerConfig = layerConfigs[layerId];

            if (layerConfig.clusterer != null) {
                layerConfig.clusterer.setMarkerClickable(clickable);
            }
        });
    },

    addLayer: function(layerId, collection, visible) {
        var me = this;
        var layerConfigs = me.layerConfigs;
        var layerConfig = layerConfigs[layerId];
        var map = me.getMap();

        if (!map || collection.getCount() == 0) {
            return;
        }

        var overlayCollection = layerConfig.collection;
        overlayCollection.clear();
        collection.each(function(item) {
            var record = item.entity;
            var overlay = me.createOverlay(map, layerId, record);
            if (!!overlay) {
                overlayCollection.add(record.get('uuid'), overlay);
            }
        });

        var displayStyle = layerConfig.displayStyle;
        if (displayStyle == 'overlay') {
            overlayCollection.each(function(overlay) {
                map.addOverlay(overlay);

                if (visible) {
                    overlay.show();
                } else {
                    overlay.hide();
                }
            });
        } else if (displayStyle == 'clusterer') {
            var clusterer = layerConfig.clusterer;
            if (clusterer == null) {
                clusterer = new BMapLib.MarkerClusterer(
                    map);

                var styles = layerConfig.clustererStyles;
                if (!!styles) {
                    clusterer.setStyles(styles);
                }
            }

            clusterer.clearMarkers();
            var overlays = overlayCollection.getRange();
            if (visible) {
                clusterer.addMarkers(overlays);
            } else {
                clusterer.removeMarkers(overlays);
            }

            layerConfig.clusterer = clusterer;
        }
    },

    removeLayer: function(layerId) {
        var me = this;
        var layerConfigs = me.layerConfigs;
        var layerConfig = layerConfigs[layerId];
        var overlayCollection = layerConfig.collection;
        var map = me.getMap();

        if (!map || overlayCollection.getCount() == 0) {
            return;
        }

        var displayStyle = layerConfig.displayStyle;
        if (displayStyle == 'overlay') {
            overlayCollection.each(function(overlay) {
                map.removeOverlay(overlay);
            });
        } else if (displayStyle == 'clusterer') {
            var overlays = overlayCollection.getRange();
            var clusterer = layerConfig.clusterer;
            clusterer.removeMarkers(overlays);

            layerConfig.clusterer = null;
        }

        overlayCollection.clear();
    },

    toggleLayer: function(layerId, visible) {
        var me = this;
        var layerConfigs = me.layerConfigs;
        var layerConfig = layerConfigs[layerId];
        var overlayCollection = layerConfig.collection;

        if (overlayCollection.getCount() == 0) {
            return;
        }

        var displayStyle = layerConfig.displayStyle;
        if (displayStyle == 'overlay') {
            overlayCollection.each(function(overlay) {
                if (visible) {
                    overlay.show();
                } else {
                    overlay.hide();
                }
            });
        } else if (displayStyle == 'clusterer') {
            var overlays = overlayCollection.getRange();
            var clusterer = layerConfig.clusterer;
            if (!!clusterer) {
                if (visible) {
                    clusterer.addMarkers(overlays);
                } else {
                    clusterer.removeMarkers(overlays);
                }
            }
        }
    },

    doCenterAndZoom: function(layerId, key, record) {
        var me = this;
        var layerConfigs = me.layerConfigs;
        var layerConfig = layerConfigs[layerId];

        var overlayCollection = layerConfig.collection;

        var overlay = overlayCollection.get(key);
        if (!overlay) {
            return;
        }
        me.setCurrentOverlay(overlay);
        overlay.entity = record;

        var detail = overlay.entity;
        var map = me.getMap();
        if (map.getZoom() < 16) {
            map.setZoom(16);
        }
        if (!me.isInViewPort(overlay.getPosition())) {
            map.setCenter(overlay.getPosition());
        }
        var info,
            point = overlay.point;

        switch (layerId) {
            case 'compWatersourceXhs':
                info = me.getWaterXhsInfoWindowHtml(detail);
                me.openWaterXhsInfoWindow(info, point);
                break;
            case 'compWatersourceSh':
                info = me.getWaterShInfoWindowHtml(detail);
                me.openWaterShInfoWindow(info, point);
                break;
            case 'compWatersourceSc':
                info = me.getWaterScInfoWindowHtml(detail);
                me.openWaterScInfoWindow(info, point);
                break;
            case 'compWatersourceQsmt':
                info = me.getWaterQsmtInfoWindowHtml(detail);
                me.openWaterQsmtInfoWindow(info, point);
                break;
            case 'compWatersourceTrsy':
                info = me.getWaterTrsyInfoWindowHtml(detail);
                me.openWaterTrsyInfoWindow(info, point);
                break;
            case 'compZddw':
                info = me.getZddwInfoWindowHtml(detail);
                me.openZddwInfoWindow(info, point);
                break;
            case 'compZqzd':
                info = me.getZqzdInfoWindowHtml(detail);
                me.openZqzdInfoWindow(info, point);
                break;
            case 'compZqdd':
                info = me.getZqddInfoWindowHtml(detail);
                me.openZqddInfoWindow(info, point);
                break;
            case 'compQyd':
                info = me.getQydInfoWindowHtml(detail);
                me.openQydInfoWindow(info, point);
                break;
            case 'compFireEngine':
                info = me.getFireEngineInfoWindowHtml(detail);
                me.openFireEngineInfoWindow(info, point);
        }
    },

    getOverlay: function(layerId, key) {
        var me = this;
        var layerConfigs = me.layerConfigs;
        var layerConfig = layerConfigs[layerId];
        var overlayCollection = layerConfig.collection;

        var overlay = overlayCollection.get(key);
        if (!overlay) {
            return;
        }

        return overlay;
    },

    updateViewport: function(option) {
        var me = this;
        var map = me.getMap();
        var type = option.type;

        var points = [];
        var layerIds = [];
        if (type == 'xfk') {
            layerIds = me.xfkLayerIds;
        } else if (type == 'layer') {
            var layerId = option.layerId;
            if (layerId != 'compFireEngine') { // cuihj add exclude FireEngine Real Position
                layerIds.push(option.layerId);
            }
        } else {

        }

        layerIds.forEach(function(layerId) {
            var layerConfig = me.layerConfigs[layerId];
            var overlayCollection = layerConfig.collection;

            overlayCollection.each(function(overlay) {
                points.push(overlay.getPosition());
            });
        });

        if (points.length > 0) {
            map.setViewport(points);
        }
    },
    //路况
    changeTraffic: function() {
        var me = this;
        var map = me.getMap();
        var isTrafficOpen = false;
        var trafficLayer = me.getTrafficLayer();
        if (trafficLayer == null) {
            trafficLayer = new BMap.TrafficLayer();
            me.setTrafficLayer(trafficLayer);
            map.addTileLayer(trafficLayer);
            isTrafficOpen = true;
        } else {
            map.removeTileLayer(trafficLayer);
            me.setTrafficLayer(null);
            isTrafficOpen = false;
        }
        return isTrafficOpen;
    },

    changeMapType: function(type) {
        var me = this;
        var map = me.getMap();

        if (type == '2D') {
            map.setMapType(BMAP_NORMAL_MAP);
        } else if (type == 'satellite') {
            map.setMapType(BMAP_HYBRID_MAP);
        } else {
            map.setMapType(BMAP_PERSPECTIVE_MAP);
        }
    },

    drawCurrentOverlay: function(poi) {
        var overlay;
        var me = this;
        var map = me.getMap();
        var point = poi.point;
        if (point == null) {
            return;
        }

        var strName = poi.title;
        strName = me.formatLabel(strName);
        var xOffset = 6 * (-5);
        if (strName.length < 6) {
            xOffset = strName.length * (-5);
        }
        xOffset += 2;
        var offsetLabel = new BMap.Size(xOffset, 38);

        var currentPoi = me.getCurrentPoi();

        if (currentPoi == null) {
            var icon = new BMap.Icon(
                me.ICON_POI, new BMap.Size(24, 36));
            overlay = new BMap.Marker(point, {
                icon: icon
            });

            map.addOverlay(overlay);
            me.setCurrentPoi(overlay);
            currentPoi = overlay;

            var label = new BMap.Label(strName, {
                offset: offsetLabel
            });
            var labelStyle = Ext.clone(me.markerLabelStyle);
            labelStyle.color = 'rgb(245, 67, 54)';
            label.setStyle(labelStyle);
            currentPoi.setLabel(label);
        } else {
            currentPoi.setPosition(point);
            var newLabel = currentPoi.getLabel();
            newLabel.setContent(strName);
            newLabel.setOffset(offsetLabel);
            currentPoi.setLabel(newLabel);
        }

        currentPoi.entity = poi;

        map.centerAndZoom(point, 18);
    },

    updateCurrentOverlay: function(newOverlay, oldOverlay) {
        var me = this;

        if (!!newOverlay) {
            var icon = newOverlay.getIcon();
            icon.setImageOffset(new BMap.Size(-24, 0));
            newOverlay.setIcon(icon);
        }

        if (!!oldOverlay) {
            var icon = oldOverlay.getIcon();
            icon.setImageOffset(new BMap.Size(0, 0));
            oldOverlay.setIcon(icon);
        }
    },

    createOverlay: function(map, layerId, record) {
        var ret = null;
        var me = this;

        var bdLon = record.get('bdLon'),
            bdLat = record.get('bdLat');
        if (!bdLon || !bdLat) {
            return ret;
        }

        switch (layerId) {
            case 'compWatersourceXhs':
                ret = me._createCompWatersourceXhs(map, record);
                break;
            case 'compWatersourceSh':
                ret = me._createCompWatersourceSh(map, record);
                break;
            case 'compWatersourceSc':
                ret = me._createCompWatersourceSc(map, record);
                break;
            case 'compWatersourceQsmt':
                ret = me._createCompWatersourceQsmt(map, record);
                break;
            case 'compWatersourceTrsy':
                ret = me._createCompWatersourceTrsy(map, record);
                break;
            case 'compZddw':
                ret = me._createCompZddw(map, record);
                break;
            case 'compZqzd':
                ret = me._createCompZqzd(map, record);
                break;
            case 'compZqdd':
                ret = me._createCompZqdd(map, record);
                break;
            case 'compQyd':
                ret = me._createCompQyd(map, record);
                break;
            case 'compFireEngine':
                ret = me._createCompFireEngine(map, record);
                break;
            default:
                break;
        }

        return ret;
    },

    findGeometryDepartment: function(point) {
        var me = this;
        var ret;
        var layerConfigs = me.layerConfigs;
        var collection = layerConfigs['policeDistrict'].collection;
        if (!collection || collection.getCount() == 0) {
            return ret;
        }

        var target;
        collection.each(function(item) {
            var overlay = item;

            var isValid = BMapLib.GeoUtils.isPointInPolygon(point, overlay);
            if (isValid) {
                target = item;

                return false;
            }
        });

        if (!!target) {
            ret = target.entity;
        }

        return ret;
    },

    _createCompWatersourceXhs: function(map, record) {
        var overlay;
        var me = this;
        var bdLon = record.get('bdLon'),
            baLat = record.get('bdLat');

        var icon = new BMap.Icon(
            me.ICON_W_XHS, new BMap.Size(24, 24), {
                offset: new BMap.Size(12, 24)
            });
        var pt = new BMap.Point(bdLon, baLat);
        overlay = new BMap.Marker(pt, {
            icon: icon
        });

        var strName = record.get('name');
        strName = me.formatLabel(strName);
        var xOffset = 6 * (-5);
        if (strName.length < 6) {
            xOffset = strName.length * (-5);
        }
        xOffset += 2;
        var label = new BMap.Label(strName, {
            offset: new BMap.Size(xOffset, 26)
        });
        var labelStyle = Ext.clone(me.markerLabelStyle);
        labelStyle.color = 'rgb(0, 127, 248)';
        label.setStyle(labelStyle);
        overlay.setLabel(label);
        overlay.entity = record;
        var info = me.getWaterXhsInfoWindowHtml(record);
        overlay.addEventListener('click', function(evt) {
            if (me.getIsMeasuringDis() || me.getIsMeasuringArea()) {
                return;
            }
            me.setCurrentOverlay(evt.target);
            me.doGetElementDetail();
        });
        return overlay;
    },

    _createCompWatersourceSh: function(map, record) {
        var overlay;
        var me = this;
        var bdLon = record.get('bdLon'),
            baLat = record.get('bdLat');
        var icon = new BMap.Icon(
            me.ICON_W_SH, new BMap.Size(24, 24), {
                offset: new BMap.Size(12, 24)
            });
        var pt = new BMap.Point(bdLon, baLat);
        overlay = new BMap.Marker(pt, {
            icon: icon
        });
        var strName = record.get('name');
        strName = me.formatLabel(strName);
        var xOffset = 6 * (-5);
        if (strName.length < 6) {
            xOffset = strName.length * (-5);
        }
        xOffset += 2;
        var label = new BMap.Label(strName, {
            offset: new BMap.Size(xOffset, 26)
        });
        var labelStyle = Ext.clone(me.markerLabelStyle);
        labelStyle.color = 'rgb(69, 181, 255)';
        label.setStyle(labelStyle);
        overlay.setLabel(label);
        overlay.entity = record;
        var info = me.getWaterShInfoWindowHtml(record);
        overlay.addEventListener('click', function(evt) {
            if (me.getIsMeasuringDis() || me.getIsMeasuringArea()) {
                return;
            }
            me.setCurrentOverlay(evt.target);
            me.doGetElementDetail();
        });
        return overlay;
    },

    _createCompWatersourceSc: function(map, record) {
        var overlay;
        var me = this;
        var bdLon = record.get('bdLon'),
            baLat = record.get('bdLat');

        var icon = new BMap.Icon(
            me.ICON_W_SC, new BMap.Size(24, 24), {
                offset: new BMap.Size(12, 24)
            });
        var pt = new BMap.Point(bdLon, baLat);
        overlay = new BMap.Marker(pt, {
            icon: icon
        });

        var strName = record.get('name');
        strName = me.formatLabel(strName);
        var xOffset = 6 * (-5);
        if (strName.length < 6) {
            xOffset = strName.length * (-5);
        }
        xOffset += 2;
        var label = new BMap.Label(strName, {
            offset: new BMap.Size(xOffset, 26)
        });
        var labelStyle = Ext.clone(me.markerLabelStyle);
        labelStyle.color = 'rgb(117, 189, 213)';
        label.setStyle(labelStyle);
        overlay.setLabel(label);

        overlay.entity = record;

        var info = me.getWaterScInfoWindowHtml(record);
        overlay.addEventListener('click', function(evt) {
            if (me.getIsMeasuringDis() || me.getIsMeasuringArea()) {
                return;
            }
            me.setCurrentOverlay(evt.target);
            me.doGetElementDetail();
        });
        return overlay;
    },

    _createCompWatersourceQsmt: function(map, record) {
        var overlay;
        var me = this;
        var bdLon = record.get('bdLon'),
            baLat = record.get('bdLat');

        var icon = new BMap.Icon(
            me.ICON_W_QSMT, new BMap.Size(24, 24), {
                offset: new BMap.Size(12, 24)
            });
        var pt = new BMap.Point(bdLon, baLat);
        overlay = new BMap.Marker(pt, {
            icon: icon
        });

        var strName = record.get('name');
        strName = me.formatLabel(strName);
        var xOffset = 6 * (-5);
        if (strName.length < 6) {
            xOffset = strName.length * (-5);
        }
        xOffset += 2;
        var label = new BMap.Label(strName, {
            offset: new BMap.Size(xOffset, 26)
        });
        var labelStyle = Ext.clone(me.markerLabelStyle);
        labelStyle.color = 'rgb(116, 204, 102)';
        label.setStyle(labelStyle);
        overlay.setLabel(label);

        overlay.entity = record;

        var info = me.getWaterQsmtInfoWindowHtml(record);
        overlay.addEventListener('click', function(evt) {
            if (me.getIsMeasuringDis() || me.getIsMeasuringArea()) {
                return;
            }
            me.setCurrentOverlay(evt.target);
            me.doGetElementDetail();
        });
        return overlay;
    },

    _createCompWatersourceTrsy: function(map, record) {
        var overlay;
        var me = this;
        var bdLon = record.get('bdLon'),
            baLat = record.get('bdLat');

        var icon = new BMap.Icon(
            me.ICON_W_TRSY, new BMap.Size(24, 24), {
                offset: new BMap.Size(12, 24)
            });
        var pt = new BMap.Point(bdLon, baLat);
        overlay = new BMap.Marker(pt, {
            icon: icon
        });

        var strName = record.get('name');
        strName = me.formatLabel(strName);
        var xOffset = 6 * (-5);
        if (strName.length < 6) {
            xOffset = strName.length * (-5);
        }
        xOffset += 2;
        var label = new BMap.Label(strName, {
            offset: new BMap.Size(xOffset, 26)
        });
        var labelStyle = Ext.clone(me.markerLabelStyle);
        labelStyle.color = 'rgb(94, 193, 128)';
        label.setStyle(labelStyle);
        overlay.setLabel(label);

        overlay.entity = record;

        var info = me.getWaterTrsyInfoWindowHtml(record);
        overlay.addEventListener('click', function(evt) {
            if (me.getIsMeasuringDis() || me.getIsMeasuringArea()) {
                return;
            }
            me.setCurrentOverlay(evt.target);
            me.doGetElementDetail();
        });
        return overlay;
    },

    _createCompZddw: function(map, record) {
        var overlay;
        var me = this;
        var bdLon = record.get('bdLon'),
            baLat = record.get('bdLat');

        var icon = new BMap.Icon(
            me.ICON_ZDDW, new BMap.Size(24, 24), {
                offset: new BMap.Size(12, 24)
            });
        var pt = new BMap.Point(bdLon, baLat);
        overlay = new BMap.Marker(pt, {
            icon: icon
        });

        var strName = record.get('name');
        strName = me.formatLabel(strName);
        var xOffset = 6 * (-5);
        if (strName.length < 6) {
            xOffset = strName.length * (-5);
        }
        xOffset += 2;
        var label = new BMap.Label(strName, {
            offset: new BMap.Size(xOffset, 26)
        });
        var labelStyle = Ext.clone(me.markerLabelStyle);
        labelStyle.color = 'rgb(174, 130, 225)';
        label.setStyle(labelStyle);
        overlay.setLabel(label);

        overlay.entity = record;

        var info = me.getZddwInfoWindowHtml(record);
        overlay.addEventListener('click', function(evt) {
            if (me.getIsMeasuringDis() || me.getIsMeasuringArea()) {
                return;
            }
            // var record = evt.target.entity;
            // var point = new BMap.Point(record.get('bdLon'), record.get('bdLat'));
            // me.openZddwInfoWindow(info, point);

            me.setCurrentOverlay(evt.target);
            me.doGetElementDetail();
        });

        return overlay;
    },

    _createCompZqzd: function(map, record) {
        var overlay;
        var me = this;
        var bdLon = record.get('bdLon'),
            baLat = record.get('bdLat');

        var icon = new BMap.Icon(
            me.ICON_ZQZD, new BMap.Size(24, 24), {
                offset: new BMap.Size(12, 24)
            });
        var pt = new BMap.Point(bdLon, baLat);
        overlay = new BMap.Marker(pt, {
            icon: icon
        });

        var strName = record.get('name');
        strName = me.formatLabel(strName);
        var xOffset = 6 * (-5);
        if (strName.length < 6) {
            xOffset = strName.length * (-5);
        }
        xOffset += 2;
        var label = new BMap.Label(strName, {
            offset: new BMap.Size(xOffset, 26)
        });
        var labelStyle = Ext.clone(me.markerLabelStyle);
        labelStyle.color = 'rgb(219, 69, 56)';
        label.setStyle(labelStyle);
        overlay.setLabel(label);

        overlay.entity = record;

        var info = me.getZqzdInfoWindowHtml(record);
        overlay.addEventListener('click', function(evt) {
            if (me.getIsMeasuringDis() || me.getIsMeasuringArea()) {
                return;
            }
            var record = evt.target.entity;
            var point = new BMap.Point(record.get('bdLon'), record.get('bdLat'));
            me.openZqzdInfoWindow(info, point);

            me.setCurrentOverlay(evt.target);
        });

        return overlay;
    },

    _createCompZqdd: function(map, record) {
        var overlay;
        var me = this;
        var bdLon = record.get('bdLon'),
            baLat = record.get('bdLat');

        var icon = new BMap.Icon(
            me.ICON_ZQDD, new BMap.Size(24, 24), {
                offset: new BMap.Size(12, 24)
            });
        var pt = new BMap.Point(bdLon, baLat);
        overlay = new BMap.Marker(pt, {
            icon: icon
        });

        var strName = record.get('name');
        strName = me.formatLabel(strName);
        var xOffset = 6 * (-5);
        if (strName.length < 6) {
            xOffset = strName.length * (-5);
        }
        xOffset += 2;
        var label = new BMap.Label(strName, {
            offset: new BMap.Size(xOffset, 26)
        });
        var labelStyle = Ext.clone(me.markerLabelStyle);
        labelStyle.color = 'rgb(22, 154, 218)';
        label.setStyle(labelStyle);
        overlay.setLabel(label);

        overlay.entity = record;

        var info = me.getZqddInfoWindowHtml(record);
        overlay.addEventListener('click', function(evt) {
            if (me.getIsMeasuringDis() || me.getIsMeasuringArea()) {
                return;
            }
            var record = evt.target.entity;
            var point = new BMap.Point(record.get('bdLon'), record.get('bdLat'));
            me.openZqddInfoWindow(info, point);

            me.setCurrentOverlay(evt.target);
        });

        return overlay;
    },

    _createCompQyd: function(map, record) {
        var overlay;
        var me = this;
        var bdLon = record.get('bdLon'),
            baLat = record.get('bdLat');

        var icon = new BMap.Icon(
            me.ICON_QYD, new BMap.Size(24, 24), {
                offset: new BMap.Size(12, 24)
            });
        var pt = new BMap.Point(bdLon, baLat);
        overlay = new BMap.Marker(pt, {
            icon: icon
        });

        var strName = record.get('name');
        strName = me.formatLabel(strName);
        var xOffset = 6 * (-5);
        if (strName.length < 6) {
            xOffset = strName.length * (-5);
        }
        xOffset += 2;
        var label = new BMap.Label(strName, {
            offset: new BMap.Size(xOffset, 26)
        });
        var labelStyle = Ext.clone(me.markerLabelStyle);
        labelStyle.color = 'rgb(108, 159, 65)';
        label.setStyle(labelStyle);
        overlay.setLabel(label);
        overlay.entity = record;
        var info = me.getQydInfoWindowHtml(record);
        overlay.addEventListener('click', function(evt) {
            if (me.getIsMeasuringDis() || me.getIsMeasuringArea()) {
                return;
            }
            var record = evt.target.entity;
            var point = new BMap.Point(record.get('bdLon'), record.get('bdLat'));
            me.openQydInfoWindow(info, point);

            me.setCurrentOverlay(evt.target);
        });
        return overlay;
    },
    _createCompFireEngine: function(map, record) {
        var overlay;
        var me = this;
        var bdLon = record.get('bdLon'),
            baLat = record.get('bdLat');
        var online = record.get('online');
        var iconFireEngine = me.ICON_FIREENGINE_OFFLINE;
        if (online) {
            iconFireEngine = me.ICON_FIREENGINE_ONLINE;
        }
        var icon = new BMap.Icon(
            iconFireEngine, new BMap.Size(24, 24), {
                offset: new BMap.Size(12, 24)
            });
        var pt = new BMap.Point(bdLon, baLat);
        overlay = new BMap.Marker(pt, {
            icon: icon
        });
        /* cuihj 20171008 comment out
        var strName = record.get('depName') + record.get('vendor');
        strName = me.formatLabel(strName);
        var xOffset = 6 * (-5);
        if (strName.length < 6) {
            xOffset = strName.length * (-5);
        }
        xOffset += 2;
        var label = new BMap.Label(strName, {
            offset: new BMap.Size(xOffset, 26)
        });
        var labelStyle = Ext.clone(me.markerLabelStyle);
        labelStyle.color = 'rgb(108, 159, 65)';
        label.setStyle(labelStyle);
        overlay.setLabel(label);*/
        overlay.entity = record;
        var info = me.getFireEngineInfoWindowHtml(record);
        overlay.addEventListener('click', function(evt) {
            if (me.getIsMeasuringDis() || me.getIsMeasuringArea()) {
                return;
            }
            var record = evt.target.entity;
            var point = new BMap.Point(record.get('bdLon'), record.get('bdLat'));
            me.openQydInfoWindow(info, point);
            me.setCurrentOverlay(evt.target);
        });
        return overlay;
    },

    getMap: function() {
        var me = this;
        var attachController = me.getAttachController();
        var map = attachController.getMap();
        return map;
    },

    formatLabel: function(strname) {
        var len = strname.length;
        if (len <= 6) {
            return strname;
        }
        var result = "";
        var cnt = parseInt(len / 6);
        var index = 0;
        for (var i = 0; i < cnt; i++) {
            index = i * 6;
            result += strname.slice(index, index + 6) + "<br/>";
        }
        if (len % 6) {
            result += strname.slice(index + 6, len);
        }
        return result;
    },

    // getCompInfoWindow: function(record, cb) {
    //     var me = this;
    //     var restConstant = 'COMP_' + record.get('eleType'),
    //         restUrl = _CommonConstants[restConstant] + '/' + _myConstants.GETBYUUID + '/' + record.get('uuid');

    //     var promise = _RestUtil.request(restUrl);
    //     promise.then(function(responseObj) {
    //         var success = responseObj.success;
    //         if (!success) {
    //             var errorCode = responseObj.errorCode;
    //             // 通过errorCode,提示失败原因
    //             return;
    //         }
    //         var compAttachFileDTOs = responseObj.data.compAttachFileDTOs;
    //         me.upDateFileManager(compAttachFileDTOs);
    //     });
    // },

    openWaterXhsInfoWindow: function(html, point) {
        var me = this,
            map = me.getMap(),
            opts = me.infoWindowBaseCfg;
        opts.width = 440;
        opts.height = 220;

        var infoWindow = new BMap.InfoWindow(html, opts);
        infoWindow.disableAutoPan();
        map.openInfoWindow(infoWindow, point);
    },

    getWaterXhsInfoWindowHtml: function(record) {
        var me = this;
        var tpl = new Ext.XTemplate(
            '<div class="app-map-infowindow water-xhs-infowindow">',
            '<h3 class="title">',
            '{name}',
            '</h3>',
            '<div class="summary">',
            '{address}',
            '</div>',
            '<table cellpadding="0" cellspacing="0" class="content">',
            '<tr>',
            '<td><strong>管辖中队：</strong> {[this.getOrgName(values)]}</td>',
            '</tr>',
            '<tr>',
            '<td><strong>可用状态：</strong> {state}</td>',
            '</tr>',
            '<tr>',
            '<td><strong>管网形式：</strong> {[this.getGwxsName(values)]}</td>',
            '</tr>',
            '<tr>',
            '<td><strong>管网直径：</strong> {gwzj}mm</td>',
            '</tr>',
            '</table>',
            '<div class="bbar"><b class="btn" onclick="onClickInfoWindowDetail()"><img src="resources/images/icon/icon_info.png"> 详情</b></div>',
            '<div class="x-clear"></div>',
            '</div>', {
                getOrgName: function(values) {
                    var name = _PreLoadDataMgr.getFieldValue('AppOrganizations', 'uuid', values.orgUuid, 'name');
                    return name;
                },
                getGwxsName: function(values) {
                    var name = _PreLoadDataMgr.getFieldValue('DtDictionaryComps', 'uuid', values.gwxs, 'name');
                    return name;
                }
            }
        );

        var content = tpl.apply({
            name: record.get('name'),
            address: record.get('address'),
            state: record.get('state'),
            gwzj: record.get('gwzj'),
            orgUuid: record.get('orgUuid'),
            gwxs: record.get('gwxs')
        });
        return content;
    },

    openWaterShInfoWindow: function(html, point) {
        var me = this,
            map = me.getMap(),
            opts = me.infoWindowBaseCfg;
        opts.width = 440;
        opts.height = 220;

        var infoWindow = new BMap.InfoWindow(html, opts);
        infoWindow.disableAutoPan();
        map.openInfoWindow(infoWindow, point);
    },

    getWaterShInfoWindowHtml: function(record) {
        var me = this;
        var tpl = new Ext.XTemplate(
            '<div class="app-map-infowindow water-sh-infowindow">',
            '<h3 class="title">',
            '{name}',
            '</h3>',
            '<div class="summary">',
            '{address}',
            '</div>',
            '<table cellpadding="0" cellspacing="0" class="content">',
            '<tr>',
            '<td><strong>管辖中队：</strong> {[this.getOrgName(values)]}</td>',
            '</tr>',
            '<tr>',
            '<td><strong>管网直径：</strong> {gwzj}mm</td>',
            '</tr>',
            '<tr>',
            '<td><strong>管网压力：</strong> {gwyl}Mpa</td>',
            '</tr>',
            '<tr>',
            '<td><strong>流量：</strong> {flow}L/s</td>',
            '</tr>',
            '</table>',
            '<div class="bbar"><b class="btn" onclick="onClickInfoWindowDetail()"><img src="resources/images/icon/icon_info.png"> 详情</b></div>',
            '<div class="x-clear"></div>',
            '</div>', {
                getOrgName: function(values) {
                    var name = _PreLoadDataMgr.getFieldValue('AppOrganizations', 'uuid', values.orgUuid, 'name');
                    return name;
                }
            }
        );

        var content = tpl.apply({
            name: record.get('name'),
            address: record.get('address'),
            gwzj: record.get('gwzj'),
            gwyl: record.get('gwyl'),
            flow: record.get('flow'),
            orgUuid: record.get('orgUuid')
        });
        return content;
    },

    openWaterScInfoWindow: function(html, point) {
        var me = this,
            map = me.getMap(),
            opts = me.infoWindowBaseCfg;
        opts.width = 440;
        opts.height = 220;

        var infoWindow = new BMap.InfoWindow(html, opts);
        infoWindow.disableAutoPan();
        map.openInfoWindow(infoWindow, point);
    },

    getWaterScInfoWindowHtml: function(record) {
        var me = this;
        var tpl = new Ext.XTemplate(
            '<div class="app-map-infowindow water-sc-infowindow">',
            '<h3 class="title">',
            '{name}',
            '</h3>',
            '<div class="summary">',
            '{address}',
            '</div>',
            '<table cellpadding="0" cellspacing="0" class="content">',
            '<tr>',
            '<td><strong>取水口与水面高差：</strong> {qskgc}m</td>',
            '</tr>',
            '<tr>',
            '<td><strong>取水最大流量：</strong> {zdll}L/s</td>',
            '</tr>',
            '<tr>',
            '<td><strong>进水管网形式：</strong> {jsgwxs}</td>',
            '</tr>',
            '<tr>',
            '<td><strong>同时取水车辆数：</strong> {qscls}</td>',
            '</tr>',
            '</table>',
            '<div class="bbar"><b class="btn" onclick="onClickInfoWindowDetail()"><img src="resources/images/icon/icon_info.png"> 详情</b></div>',
            '<div class="x-clear"></div>',
            '</div>'
        );

        var content = tpl.apply({
            name: record.get('name'),
            address: record.get('address'),
            qskgc: record.get('qskgc'),
            zdll: record.get('zdll'),
            jsgwxs: record.get('jsgwxs'),
            qscls: record.get('qscls')
        });
        return content;
    },

    openWaterQsmtInfoWindow: function(html, point) {
        var me = this,
            map = me.getMap(),
            opts = me.infoWindowBaseCfg;
        opts.width = 440;
        opts.height = 248;

        var infoWindow = new BMap.InfoWindow(html, opts);
        infoWindow.disableAutoPan();
        map.openInfoWindow(infoWindow, point);
    },

    getWaterQsmtInfoWindowHtml: function(record) {
        var me = this;
        var tpl = new Ext.XTemplate(
            '<div class="app-map-infowindow water-qsmt-infowindow">',
            '<h3 class="title">',
            '{name}',
            '</h3>',
            '<div class="summary">',
            '{address}',
            '</div>',
            '<table cellpadding="0" cellspacing="0" class="content">',
            '<tr>',
            '<td><strong>管辖中队：</strong> {[this.getOrgName(values)]}</td>',
            '</tr>',
            '<tr>',
            '<td><strong>可用状态：</strong> {state}</td>',
            '</tr>',
            '<tr>',
            '<td><strong>取水形式：</strong> {qsxs}</td>',
            '</tr>',
            '<tr>',
            '<td><strong>取水口与水面高差：</strong> {qskgc}m</td>',
            '</tr>',
            '<tr>',
            '<td><strong>同时取水车辆数：</strong> {qscls}</td>',
            '</tr>',
            '</table>',
            '<div class="bbar"><b class="btn" onclick="onClickInfoWindowDetail()"><img src="resources/images/icon/icon_info.png"> 详情</b></div>',
            '<div class="x-clear"></div>',
            '</div>', {
                getOrgName: function(values) {
                    var name = _PreLoadDataMgr.getFieldValue('AppOrganizations', 'uuid', values.orgUuid, 'name');
                    return name;
                }
            }
        );

        var content = tpl.apply({
            name: record.get('name'),
            address: record.get('address'),
            state: record.get('state'),
            qsxs: record.get('qsxs'),
            qskgc: record.get('qskgc'),
            qscls: record.get('qscls'),
            orgUuid: record.get('orgUuid')
        });
        return content;
    },

    openWaterTrsyInfoWindow: function(html, point) {
        var me = this,
            map = me.getMap(),
            opts = me.infoWindowBaseCfg;
        opts.width = 440;
        opts.height = 220;

        var infoWindow = new BMap.InfoWindow(html, opts);
        infoWindow.disableAutoPan();
        map.openInfoWindow(infoWindow, point);
    },

    getWaterTrsyInfoWindowHtml: function(record) {
        var me = this;
        var tpl = new Ext.XTemplate(
            '<div class="app-map-infowindow water-trsy-infowindow">',
            '<h3 class="title">',
            '{name}',
            '</h3>',
            '<div class="summary">',
            '{address}',
            '</div>',
            '<table cellpadding="0" cellspacing="0" class="content">',
            '<tr>',
            '<td><strong>水质：</strong> {sz}</td>',
            '</tr>',
            '<tr>',
            '<td><strong>枯水期：</strong> {ksq}</td>',
            '</tr>',
            '<tr>',
            '<td><strong>吸水深度：</strong> {xssd}m</td>',
            '</tr>',
            '<tr>',
            '<td><strong>可用状态：</strong> {state}</td>',
            '</tr>',
            '</table>',
            '<div class="bbar"><b class="btn" onclick="onClickInfoWindowDetail()"><img src="resources/images/icon/icon_info.png"> 详情</b></div>',
            '<div class="x-clear"></div>',
            '</div>'
        );

        var content = tpl.apply({
            name: record.get('name'),
            address: record.get('address'),
            sz: record.get('sz'),
            ksq: record.get('ksq'),
            xssd: record.get('xssd'),
            state: record.get('state')
        });
        return content;
    },

    openZddwInfoWindow: function(html, point) {
        var me = this,
            map = me.getMap(),
            opts = me.infoWindowBaseCfg;
        opts.width = 440;
        opts.height = 272;

        var infoWindow = new BMap.InfoWindow(html, opts);
        infoWindow.disableAutoPan();
        map.openInfoWindow(infoWindow, point);
    },

    getZddwInfoWindowHtml: function(record) {
        var me = this;
        var tpl = new Ext.XTemplate(
            '<div class="app-map-infowindow zddw-infowindow">',
            '<h3 class="title">',
            '{name}',
            '</h3>',
            '<div class="summary">',
            '{address}',
            '</div>',
            '<table cellpadding="0" cellspacing="0" class="content">',
            '<tr>',
            '<td colspan="2"><strong>消防管理人：</strong> {xffzr} {fzrTel}</td>',
            '</tr>',
            '<tr>',
            '<td colspan="2"><strong>单位值班电话：</strong> {zbTel}</td>',
            '</tr>',
            '<tr>',
            '<td colspan="2"><strong>责任队站：</strong> {[this.getOrgName(values)]}</td>',
            '</tr>',
            '<tr>',
            '<td><strong>预案级别：</strong> {[this.getYajbName(values)]}</td>',
            '</tr>',
            '<tr>',
            '<td><strong>防火级别：</strong> {[this.getFhjbName(values)]}</td>',
            '</tr>',
            // '<tr>',
            // '<td colspan="2">',
            // '<div  style="display: -webkit-box;max-height: 48px;overflow: hidden;text-overflow: ellipsis;word-wrap: break-word;-webkit-line-clamp: 2;-webkit-box-orient: vertical;">',
            // '<strong>总体概况：</strong> {overview}',
            // '</div>',
            // '</td>',
            // '</tr>',
            '</table>',
            '<div class="bbar">',
            '<b class="btn" onclick="onClickInfoWindowDetail()"><img src="resources/images/icon/icon_info.png"> 基本信息</b>',
            '<b class="btn" onclick="onCreateKeyDiagram()"><img src="resources/images/icon/icon_key_diagram.png"> 关键图示</b>',
            '<a class="btn" href="{[this.getPano(values)]}" target="_blank"><img src="resources/images/icon/icon_panorama.png"> 全景漫游</a>',
            '<b class="btn" onclick="onClickSwcj()"><img src="resources/images/icon/icon_3d.png"> 三维场景</b>',
            '<b class="btn" onclick="onClickShare()"><img src="resources/images/icon/icon_share.png"> 分享</b>',
            /*'<a class="btn" href="{[this.get3D(values)]}" target="_blank"><img src="resources/images/icon/icon_3d.png"> 三维场景</a>',*/
            '</div>',
            '<div class="x-clear"></div>',
            '</div>', {
                getOrgName: function(values) {
                    var name = _PreLoadDataMgr.getFieldValue('AppOrganizations', 'uuid', values.orgUuid, 'name');
                    return name;
                },
                getFhjbName: function(values) {
                    var name = _PreLoadDataMgr.getFieldValue('DtDictionaryComps', 'uuid', values.fhjb, 'name');
                    return name;
                },
                getYajbName: function(values) {
                    var name = _PreLoadDataMgr.getFieldValue('DtDictionaryComps', 'uuid', values.yajb, 'name');
                    return name;
                },
                getPano: function(values) {
                    var url = 'http://720yun.com/t/4bc2dxaOa4f?from=groupmessage&isappinstalled=0&pano_id=1080864';
                    var attachs = values.compAttachFileDTOs || [];
                    attachs.forEach(function(item) {
                        var type = item.type;
                        if (type == 'PANO') {
                            url = item.url;
                        }
                    });
                    return url;
                },
                get3D: function(values) {
                    var url = _CommonConstants.ATTACHFILE_URL + '/Zddw/TP/sanwei.jpg';
                    var attachs = values.compAttachFileDTOs || [];
                    attachs.forEach(function(item) {
                        var type = item.type;
                        if (type == 'ZDDW_MODEL') {
                            url = item.url;
                        }
                    });
                    return url;
                },

            }
        );

        var content = tpl.apply({
            name: record.get('name'),
            address: record.get('address'),
            xffzr: record.get('xffzr'),
            fzrTel: record.get('fzrTel'),
            zbTel: record.get('zbTel'),
            fhjb: record.get('fhjb'),
            yajb: record.get('yajb'),
            orgUuid: record.get('orgUuid'),
            overview: record.get('overview'),
            compAttachFileDTOs: record.get('compAttachFileDTOs')
        });
        return content;
    },

    openZqzdInfoWindow: function(html, point) {
        var me = this,
            map = me.getMap(),
            opts = me.infoWindowBaseCfg;
        opts.width = 440;
        opts.height = 220;

        var infoWindow = new BMap.InfoWindow(html, opts);
        infoWindow.disableAutoPan();
        map.openInfoWindow(infoWindow, point);
    },

    getZqzdInfoWindowHtml: function(record) {
        var me = this;
        var tpl = new Ext.XTemplate(
            '<div class="app-map-infowindow zqzd-infowindow">',
            '<h3 class="title">',
            '{name}',
            '</h3>',
            '<div class="summary">',
            '{address}',
            '</div>',
            '<table cellpadding="0" cellspacing="0" class="content">',
            '<tr>',
            '<td><strong>值班电话：</strong> {zbTel}</td>',
            '</tr>',
            '<tr>',
            '<td><strong>执勤人数：</strong> {zqrs}</td>',
            '</tr>',
            '<tr>',
            '<td><strong>执勤车辆（台）：</strong> {zqcl}</td>',
            '</tr>',
            '<tr>',
            '<td><strong>重点单位数量（个）：</strong> {zddwsl}</td>',
            '</tr>',
            '</table>',
            '<div class="bbar"><b class="btn" onclick="onClickInfoWindowDetail()"><img src="resources/images/icon/icon_info.png"> 详情</b></div>',
            '<div class="x-clear"></div>',
            '</div>'
        );

        var content = tpl.apply({
            name: record.get('name'),
            address: record.get('address'),
            zbTel: record.get('zbTel'),
            zqrs: record.get('zqrs'),
            zqcl: record.get('zqcl'),
            zddwsl: record.get('zddwsl')
        });
        return content;
    },

    openZqddInfoWindow: function(html, point) {
        var me = this,
            map = me.getMap(),
            opts = me.infoWindowBaseCfg;
        opts.width = 440;
        opts.height = 220;

        var infoWindow = new BMap.InfoWindow(html, opts);
        infoWindow.disableAutoPan();
        map.openInfoWindow(infoWindow, point);
    },

    getZqddInfoWindowHtml: function(record) {
        var me = this;
        var tpl = new Ext.XTemplate(
            '<div class="app-map-infowindow zqdd-infowindow">',
            '<h3 class="title">',
            '{name}',
            '</h3>',
            '<div class="summary">',
            '{address}',
            '</div>',
            '<table cellpadding="0" cellspacing="0" class="content">',
            '<tr>',
            '<td><strong>值班电话：</strong> {zbTel}</td>',
            '</tr>',
            '<tr>',
            '<td><strong>教导员：</strong> {zdy} {zdyTel}</td>',
            '</tr>',
            '<tr>',
            '<td><strong>大队长：</strong> {ddz} {ddzTel}</td>',
            '</tr>',
            '</table>',
            '<div class="bbar"><b class="btn" onclick="onClickInfoWindowDetail()"><img src="resources/images/icon/icon_info.png"> 详情</b></div>',
            '<div class="x-clear"></div>',
            '</div>'
        );

        var content = tpl.apply({
            name: record.get('name'),
            address: record.get('address'),
            zbTel: record.get('zbTel'),
            zdy: record.get('zdy'),
            zdyTel: record.get('zdyTel'),
            ddz: record.get('ddz'),
            ddzTel: record.get('ddzTel')
        });
        return content;
    },

    openQydInfoWindow: function(html, point) {
        var me = this,
            map = me.getMap(),
            opts = me.infoWindowBaseCfg;
        opts.width = 440;
        opts.height = 220;

        var infoWindow = new BMap.InfoWindow(html, opts);
        infoWindow.disableAutoPan();
        map.openInfoWindow(infoWindow, point);
    },

    getQydInfoWindowHtml: function(record) {
        var me = this;
        var tpl = new Ext.XTemplate(
            '<div class="app-map-infowindow qyd-infowindow">',
            '<h3 class="title">',
            '{name}',
            '</h3>',
            '<div class="summary">',
            '{address}',
            '</div>',
            '<table cellpadding="0" cellspacing="0" class="content">',
            '<tr>',
            '<td><strong>办公电话：</strong> {bgTel}</td>',
            '</tr>',
            '<tr>',
            '<td><strong>负责人：</strong> {fzr} {fzrTel}</td>',
            '</tr>',
            '<tr>',
            '<td><strong>人员数量：</strong> {rssl}</td>',
            '</tr>',
            '<tr>',
            '<td><strong>车辆：</strong> {clsl}台</td>',
            '</tr>',
            '</table>',
            '<div class="bbar"><b class="btn" onclick="onClickInfoWindowDetail()"><img src="resources/images/icon/icon_info.png"> 详情</b></div>',
            '<div class="x-clear"></div>',
            '</div>'
        );

        var content = tpl.apply({
            name: record.get('name'),
            address: record.get('address'),
            bgTel: record.get('bgTel'),
            fzr: record.get('fzr'),
            fzrTel: record.get('fzrTel'),
            rssl: record.get('rssl'),
            clsl: record.get('clsl')
        });
        return content;
    },

    openFireEngineInfoWindow: function(html, point) {
        var me = this,
            map = me.getMap(),
            opts = me.infoWindowBaseCfg;
        opts.width = 440;
        opts.height = 220;

        var infoWindow = new BMap.InfoWindow(html, opts);
        infoWindow.disableAutoPan();
        map.openInfoWindow(infoWindow, point);
    },

    getFireEngineInfoWindowHtml: function(record) {
        var me = this;

        var tpl = new Ext.XTemplate(
            '<div class="app-map-infowindow xfc-infowindow">',
            '<h3 class="title">',
            '{depName}{vendor}',
            '</h3>',
            '<div class="summary">',
            '{location}',
            '</div>',
            '<table cellpadding="0" cellspacing="0" class="content">',
            '<tr>',
            '<td><strong>方向：</strong> {direction}</td>',
            '</tr>',
            '<tr>',
            '<td><strong>GPS时间：</strong>{updateTime}</td>',
            '</tr>',
            '<tr>',
            '<td><strong>经度：</strong> {bdLon}</td>',
            '</tr>',
            '<tr>',
            '<td><strong>纬度：</strong> {bdLat}</td>',
            '</tr>',
            '</table>',
            '<div class="x-clear"></div>',
            '</div>'
        );
        var content = tpl.apply({
            depName: record.get('depName'),
            vendor: record.get('vendor'),
            location: record.get('location'),
            direction: record.get('direction'),
            fzr: record.get('fzr'),
            updateTime: record.get('updateTime'),
            bdLon: record.get('bdLon'),
            bdLat: record.get('bdLat')
        });
        return content;
    },

    onClickInfoWindowDetail: function() {
        var me = this;
        var currentOverlay = me.getCurrentOverlay();
        if (!currentOverlay) {
            return;
        }
        var record = currentOverlay.entity;
        var attachController = me.getAttachController();
        attachController.fireEvent('evtViewElementDetail', record);
    },

    onClickShare: function() {
        var me = this;
        var currentOverlay = me.getCurrentOverlay();
        if (!currentOverlay) {
            return;
        }
        var record = currentOverlay.entity;
        var attachController = me.getAttachController();
        attachController.fireEvent('evtOpenShareWindow', record);
    },

    onClickSwcj: function() {
        Ext.Ajax.request({
            method: "GET",
            url: "http://api.pingxingyun.cn:8050/api/v1/instance-api/instance/requestServerForExlusive?vrAppliGuid=234375460776291055&clientId=51fd1678-c022-4478-b670-a6d4815525d5",
            dataType: "json",
            success: function(res) {
                var response = res.responseText;
                if (response == '' || response == null) {
                    return;
                }
                var data = Ext.JSON.decode(response);
                if (data.code == 1000 && data.result != null) {
                    if (data.result.resultType == 0) {
                        var href = "PXY:" + data.result.ip + "|" + data.result.port + "|51fd1678-c022-4478-b670-a6d4815525d5|2400|1";
                    }
                    window.location.href = href;
                } else {
                    alert("请求应用服务器失败");
                }
            },
            error: function() {
                alert("请求应用服务器异常");
            }
        });
    },

    doGetElementDetail: function() {
        var me = this;
        var currentOverlay = me.getCurrentOverlay();
        if (!currentOverlay) {
            return;
        }
        var record = currentOverlay.entity;
        var attachController = me.getAttachController();
        attachController.fireEvent('evtLoadElementDetail', record);
    },

    onCreateKeyDiagram: function() {
        var me = this;
        var currentOverlay = me.getCurrentOverlay();

        if (!currentOverlay) {
            return;
        }

        var record = currentOverlay.entity,
            attachs = record.get('compAttachFileDTOs') || [],
            gjts = [];

        attachs.forEach(function(item) {
            var type = item.type;
            // if (type == 'ZDDW_ZTPMT' ||
            //     type == 'ZDDW_GNFBPMT' ||
            //     type == 'ZDDW_LCPMT' ||
            //     type == 'ZDDW_WLM') {
            //     gjts.push(item);
            // }
            if (type == 'ZDDW_ZTPMT') {
                gjts.push(item);
            }
        });

        if (gjts.length <= 0) {
            Ext.toast('暂无关键图示信息', '提示：', 'br');
            return false;
        }

        var fileWindow = Ext.create('FirePlanGisApp.view.common.filemanager.FileWindow', {
            title: '关键图示'
        });
        fileWindow.show();
        fileWindow.updateAttachFiles(gjts);
    },

    updateResultDis: function(value) {
        var me = this;
        var attachController = me.getAttachController();
        attachController.fireEvent('evtUpdateMeasureValue', 'dis', value);
    },

    updateResultArea: function(value) {
        var me = this;
        var attachController = me.getAttachController();
        attachController.fireEvent('evtUpdateMeasureValue', 'area', value);
    },
}, function(clazz) {
    window.onClickInfoWindowDetail = clazz.onClickInfoWindowDetail.bind(clazz);
    window.onClickShare = clazz.onClickShare.bind(clazz);
    window.onCreateKeyDiagram = clazz.onCreateKeyDiagram.bind(clazz);
    window.onClickSwcj = clazz.onClickSwcj.bind(clazz);
});