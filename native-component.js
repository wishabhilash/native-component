let ComponentMixin = (superclass) => class extends superclass {
    constructor() {
        super()
        this.init()
        this._prop = this._initProxy()
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
        return Object.getOwnPropertyNames(this).filter((e)=>e!='_prop')
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
        this.onInsert()
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
    dom() {}
    style() {}
    
    // Events
    onAttributeChange(name, oldValue, newValue){}
    onInsert(){}
};

class Component extends ComponentMixin(HTMLElement) {}

export default Component
