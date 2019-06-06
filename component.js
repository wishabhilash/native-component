let ComponentMixin = (superclass) => class extends superclass {
    constructor() {
        super()
        this.init()
        this._prop = this._initProxy()
        this._listenersToRemove = []
        this.shadow = this.attachShadow({mode: 'open'})
        this.render()
    }

    _initProxy() {
        this._observedAttributes = this._getPropNames()
        let definedProps = this._collectAndDeleteProperties()
        let self = this
        let targetObj = {
            props: definedProps,
            instance: self
        }
        
        return new Proxy(targetObj, {
            get(target, key) {
                if(!(key in target.props)) throw Error("Permission denied.")
                let propList = Object.getOwnPropertyNames(target)
                if (!(key in definedProps)) throw Error('key not in property list')
                return target.props[key]
            },
            set(target, key, value) {
                if(!(key in target.props)) throw Error("Permission denied.")
                let propList = Object.getOwnPropertyNames(target)
                if (!(key in definedProps)) throw Error('key not in property list')
                target.props[key] = value
                target.instance.render()
            }
        })
    }

    _getPropNames() {
        return Object.getOwnPropertyNames(this).filter((e)=>!(e in {'_prop': null, '_listeners': null}))
    }

    _collectAndDeleteProperties() {
        let props = {}
        let self = this
        this._getPropNames().forEach((e) => {
            props[e] = self[e]
            delete this[e]
        })
        return props
    }

    _inArray(arr, key) {
        let len = arr.filter((e)=>e == key).length
        return len == 0 ? false : true
    }

    getProp(key) {
        return Reflect.get(this._prop, key)
    }

    setProp(key, value) {
        Reflect.set(this._prop, key, value)
    }
    
    connectedCallback() {
        this._bindListeners()
        this.onInsert()
    }

    disconnectedCallback() {
        this._unbindListeners()
        this.onRemove()
    }

    _bindListeners() {
        let self = this
        let listenerList = this.listeners()
        listenerList.forEach((listener) => {
            let target = () => self[listener[2]]()
            self.shadowRoot.querySelector(listener[0])
                .addEventListener(listener[1], target, false)
            let _l = [...listener]
            _l.push(target)
            self._listenersToRemove.push(_l)
        })
    }

    _unbindListeners() {
        let self = this
        this._listenersToRemove.forEach((listener) => {
            self.shadowRoot.querySelector(listener[0])
                .removeEventListener(listener[1], listener[3], false)
        })
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return
        this.setProp(name, newValue)
        this.onAttributeChange(name, oldValue, newValue)
    }

    render() {
        this.shadow.innerHTML = this.dom()
        let style = document.createElement('style')
        style.textContent = this.style()
        this.shadow.appendChild(style)
    }
    
    // Overrides
    init() {}
    dom() {}
    style() {}
    listeners(){return []}
    
    // Events
    onAttributeChange(name, oldValue, newValue){}
    onInsert(){}
    onRemove(){}
};

class Component extends ComponentMixin(HTMLElement) {}

export default Component
