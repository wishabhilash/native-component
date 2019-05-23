import Component from "../../native-component.min.js";

class ColorButton extends Component {
    init() {
        this.number = null
        this.addEventListener("click", (event) => {
            console.log("Click working")
        })
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