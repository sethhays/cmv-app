define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    //'dojo/_base/array',
    'dojo/on',
    'dojo/topic',
    'dojo/dom-construct',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-attr',
    'dojo/html',
    './../plugins/LayerMenu',
    'dojo/text!./templates/Control.html'
], function (
    declare,
    lang,
    //array,
    on,
    topic,
    domConst,
    domStyle,
    domClass,
    domAttr,
    html,
    LayerMenu,
    template
) {

    var _Control = declare([], {
        templateString: template, // widget template

        controller: null, // LayerControl instance
        layer: null, // the layer object
        layerTitle: 'Layer Title', // default title
        controlOptions: null, // control options

        layerMenu: null, //the controls menu

        _reorderUp: null, // used by LayerMenu
        _reorderDown: null, // used by LayerMenu

        _scaleRangeHandler: null, // handle for scale range awareness
        _expandClickHandler: null, // the click handler for the expandNode

        postCreate: function () {
            this.inherited(arguments);

            if (!this.controller) {
                topic.publish('viewer/handleError', {
                    source: 'LayerControl/_Control',
                    error: 'controller option is required'
                });
                this.destroy();
                return;
            }
            if (!this.layer) {
                topic.publish('viewer/handleError', {
                    source: 'LayerControl/_Control',
                    error: 'layer option is required'
                });
                this.destroy();
                return;
            }

            if (this.layer.loaded) {
                this._initialize();
            } else {
                this.layer.on('load', lang.hitch(this, '_initialize'));
            }
        },

        // initialize the control
        _initialize: function () {
            // an optional function in each control widget called before widget init
            if (this._layerTypePreInit) {
                this._layerTypePreInit();
            }

            var layer = this.layer,
                controlOptions = this.controlOptions;

            // set checkbox
            this._setLayerCheckbox(layer, this.checkNode);

            // wire up layer visibility
            on(this.checkNode, 'click', lang.hitch(this, '_setLayerVisibility', layer, this.checkNode));

            // set title
            html.set(this.labelNode, this.layerTitle);

            // wire up updating indicator
            layer.on('update-start', lang.hitch(this, function () {
                domStyle.set(this.layerUpdateNode, 'display', 'inline-block'); //font awesome display
            }));
            layer.on('update-end', lang.hitch(this, function () {
                domStyle.set(this.layerUpdateNode, 'display', 'none');
            }));

            // create layer menu
            this.layerMenu = new LayerMenu({
                control: this,
                contextMenuForWindow: false,
                targetNodeIds: [this.labelNode],
                leftClickToOpen: true
            });
            this.layerMenu.startup();

            // if layer has scales set
            if (layer.minScale !== 0 || layer.maxScale !== 0) {
                this._checkboxScaleRange();
                this._scaleRangeHandler = layer.getMap().on('zoom-end', lang.hitch(this, '_checkboxScaleRange'));
            }

            // if layer scales change
            this.layer.on('scale-range-change', lang.hitch(this, function () {
                if (layer.minScale !== 0 || layer.maxScale !== 0) {
                    this._checkboxScaleRange();
                    this._scaleRangeHandler = layer.getMap().on('zoom-end', lang.hitch(this, '_checkboxScaleRange'));
                } else {
                    this._checkboxScaleRange();
                    if (this._scaleRangeHandler) {
                        this._scaleRangeHandler.remove();
                        this._scaleRangeHandler = null;
                    }
                }
            }));

            // a function in each control widget for layer type specifics like legends and such
            this._layerTypeInit();

            // show expandNode
            //   no harm if click handler wasn't created
            if (controlOptions.expanded && controlOptions.sublayers) {
                this.expandClickNode.click();
            }

            // esri layer's don't inherit from Stateful
            //   connect to update events to handle "watching" layers
            layer.on('update-start', lang.hitch(this, '_updateStart'));
            layer.on('update-end', lang.hitch(this, '_updateEnd'));
            layer.on('visibility-change', lang.hitch(this, '_visibilityChange'));
        },

        // add on event to expandClickNode
        _expandClick: function () {
            this._expandClickHandler = on(this.expandClickNode, 'click', lang.hitch(this, function () {
                var expandNode = this.expandNode,
                    iconNode = this.expandIconNode;
                if (domStyle.get(expandNode, 'display') === 'none') {
                    domStyle.set(expandNode, 'display', 'block');
                    domClass.replace(iconNode, 'fa-minus-square-o', 'fa-plus-square-o');
                } else {
                    domStyle.set(expandNode, 'display', 'none');
                    domClass.replace(iconNode, 'fa-plus-square-o', 'fa-minus-square-o');
                }
            }));
        },

        // removes the icons and cursor:pointer from expandClickNode and destroys expandNode
        _expandRemove: function () {
            domClass.remove(this.expandIconNode, ['fa', 'fa-plus-square-o', 'layerControlToggleIcon']);
            domStyle.set(this.expandClickNode, 'cursor', 'default');
            domConst.destroy(this.expandNode);
        },

        // set layer visibility and update icon
        _setLayerVisibility: function (layer, checkNode) {
            if (layer.visible) {
                this._setLayerCheckbox(layer, checkNode);
                layer.hide();
                topic.publish('layerControl/layerToggle', {
                    id: layer.id,
                    visible: layer.visible
                });
            } else {
                this._setLayerCheckbox(layer, checkNode);
                layer.show();
                topic.publish('layerControl/layerToggle', {
                    id: layer.id,
                    visible: layer.visible
                });
            }
            if (layer.minScale !== 0 || layer.maxScale !== 0) {
                this._checkboxScaleRange();
            }
        },

        // set checkbox based on layer so it's always in sync
        _setLayerCheckbox: function (layer, checkNode) {
            if (layer.visible) {
                domAttr.set(checkNode, 'data-checked', 'checked');
                domClass.replace(checkNode, 'fa-check-square-o', 'fa-square-o');
            } else {
                domAttr.set(checkNode, 'data-checked', 'unchecked');
                domClass.replace(checkNode, 'fa-square-o', 'fa-check-square-o');
            }
        },

        // check scales and add/remove disabled classes from checkbox
        _checkboxScaleRange: function () {
            var node = this.checkNode,
                layer = this.layer,
                scale = layer.getMap().getScale(),
                min = layer.minScale,
                max = layer.maxScale;
            domClass.remove(node, 'layerControlCheckIconOutScale');
            if ((min !== 0 && scale > min) || (max !== 0 && scale < max)) {
                domClass.add(node, 'layerControlCheckIconOutScale');
            }
        },

        // anything the widget may need to do before update
        _updateStart: function () {
            // clone a layer state before layer updates for use after update
            this._layerState = lang.clone({
                visible: this.layer.visible,
                visibleLayers: this.layer.visibleLayers || null
            });
        },

        // anything the widget may need to do after update
        _updateEnd: function () { 
            // how to handle external layer.setVisibleLayers() ???
            //
            // without topics to get/set sublayer state this will be challenging
            // still up for debate...

            // anything needing before update layer state
            if (!this._layerState) {
                // clear
                this._layerState = null;
                return;
            }
        },

        // anything the widget may need to do after visibility change
        _visibilityChange: function (r) {
            // if the checkbox doesn't match layer visibility correct it by calling _setLayerCheckbox
            if ((r.visible && domAttr.get(this.checkNode, 'data-checked') === 'unchecked') || (!r.visible && domAttr.get(this.checkNode, 'data-checked') === 'checked')) {
                this._setLayerCheckbox(this.layer, this.checkNode);
            }
        }

    });

    return _Control;
});