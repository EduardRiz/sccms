const passutil = {
    randomFunc: [
        () => {
            return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
        },
        () => {
            return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
        },
        () => {
            return +String.fromCharCode(Math.floor(Math.random() * 10) + 48);
        },
        () => {
            const symbols = '!@#$'
            return symbols[Math.floor(Math.random() * symbols.length)];
        }
    ]
    ,
    randomFuncHex: [
        () => {
            return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
        },
        () => {
            return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
        },
        () => {
            return +String.fromCharCode(Math.floor(Math.random() * 10) + 48);
        },
    ]
    ,
    generate(length) {
        let generatedPassword = '';
        for (let i = 0; i < length; ++i) {
            let f = Math.floor(Math.random() * Math.floor(i?this.randomFunc.length:this.randomFunc.length-2))
            generatedPassword += this.randomFunc[f]();
        }
        return generatedPassword;
    },
    generateHex(length) {
        let generatedPassword = '';
        for (let i = 0; i < length; ++i) {
            let f = Math.floor(Math.random() * Math.floor(i?this.randomFuncHex.length:this.randomFuncHex.length-2))
            generatedPassword += this.randomFuncHex[f]();
        }
        return generatedPassword;
    },
}
export default passutil;