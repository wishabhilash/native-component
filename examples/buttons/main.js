import Component from "../../component.min.js";

class ColorButton extends Component {
    init() {
        this.number = null
    }

    static get observedAttributes() {
        return ['number']
    }

    dom() {
        return `<button>${this.getProp('number')}</button>`
    }
}

class ColorDiv extends Component {
    init() {
        this.color = null
    }

    static get observedAttributes() {
        return ['color']
    }

    listeners() {
        return [
            ['color-btn', 'click', this.showAlert]
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
}

customElements.define('color-div', ColorDiv)
customElements.define('color-btn', ColorButton)