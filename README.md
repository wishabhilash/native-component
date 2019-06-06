# native-component
Use native webcomponent to build your next app.

Example:

```
import {Component} from "es6-native-component"

class ColorDiv extends Component {
    init() {
        this.color = null
    }

    static get observedAttributes() {
        return ['color']
    }

    listeners() {
        return [
            ['color-btn', 'click', 'showAlert']
        ]
    }

    showAlert() {
        alert("Am working!!!")
    }

    dom() {
        return `
            <div class="cd">
                <color-btn number="0"></color-btn>
                <color-btn number="1"></color-btn>
            </div>`
    }

    style() {
        return `
            div.cd {
                background-color: ${this.getProp('color')};
                padding: 10px;
            }
        `
    }

    // Overrides
    onAttributeChange(name, oldValue, newValue){}
    onInsert(){}
    onRemove(){}
}

customElements.define('color-div', ColorDiv)
```