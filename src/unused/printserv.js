const generator = {
    w: null,
    createElem: function (name, cls) {
        //console.log(name, cls);
        if (!this.w) return;
        let elem = this.w.document.createElement(name);
        if (cls) {
            cls.split(",").forEach(c => {
                elem.classList.add(c.trim());
            });
        }
        return elem;
    },
    addElem: function (to, cls, name, val) {
        if (val == undefined) val = "";
        //console.log(to, cls, name, val);
        let elem = this.createElem(name, cls);
        elem.innerHTML = val;
        to.append(elem);
    },

    prepare: function ($vm, data, columns, options, filter) {
        //if (!this.$vm.$store.getters.test('print')) return;
        const mainClass = "sc-report";
        if (data.length == 0) return 1;
        //        var w = window.open();
        this.w = open();


        this.w.document.write(document.implementation.createHTMLDocument(options.title).documentElement.outerHTML);
        var meta = this.w.document.createElement('meta');
        meta.httpEquiv = "Content-Type";
        meta.content = "text/html; charset=UTF-8";
        this.w.document.getElementsByTagName('head')[0].appendChild(meta);
        var linkElement = this.w.document.createElement('link');
        linkElement.setAttribute('rel', 'stylesheet');
        linkElement.setAttribute('type', 'text/css');
        linkElement.setAttribute('href', 'screport.css');
        this.w.document.getElementsByTagName('head')[0].appendChild(linkElement);
        this.w.document.title = options.title;

        var root = this.w.document.body;
        try {
            root.classList.add(mainClass);

            let header = null;
            this.addElem(root, "rt", "div", options.title);
            header = this.createElem("div", "rkp");
            this.addElem(header, "rkk", "div", $vm.$t('report.created'));
            this.addElem(header, "rkv", "div", $vm.$moment().format("YYYY-MM-DD HH:mm"));
            root.append(header);
            if (filter.range) {
                header = this.createElem("div", "rkp");
                this.addElem(header, "rkk", "div", $vm.$t('report.period'));
                this.addElem(header, "rkv", "div", filter.range);
                root.append(header);
            }
            const table = this.createElem("table", "");
            const tr = this.createElem("tr", "trh");
            columns.forEach(h => {
                let cls = "";
                if (h.align) cls = "rpt-al-" + h.align;
                this.addElem(tr, cls, "th", h.text);
            });
            table.append(tr);
            data.forEach((c) => {
                const tr = this.createElem("tr", "trd");
                columns.forEach(h => {
                    let inner = c[h.value];
                    try {
                        if (h.pfilter) {
                            inner = $vm.$options.filters[h.pfilter](inner);
                        }
                    } catch (e) {
                        console.log(e.message, JSON.stringify(h), inner)
                    }
                    let cls = "";
                    if (h.align) cls = "rpt-al-" + h.align;
                    this.addElem(tr, cls, "td", inner);
                });
                table.append(tr);
            });
            //tr = createElem("tr", "trf");
            // const footers = options ? options : {};
            //console.log(footers)
            // columns.forEach(c => {
            //     if (c.text.length == 0) return;
            //     let inner = '';
            //     let cls = ["rpt-tf"];
            //     if (footers.totals[c.value] != undefined) {
            //         //console.log(c.value, c.filt, c.filter);
            //         inner = footers.totals[c.value];
            //         if (c.filt) inner = $vm.$options.filters[c.filt](inner);
            //         if (c.filter) inner = $vm.$options.filters[c.filter](inner);
            //         if (c.align) cls.push("rpt-al-" + c.align);
            //     }
            //     addElem(tr, cls, "td", inner);
            // });
            //table.append(tr);
            root.append(table);

            // w.documentElement.appendChild(root);
            //console.log(new Date());
            // var win = window.open();
            // win.document.write(w.documentElement.innerHTML);
            this.w.document.close();
            //console.log(new Date());
            this.w.focus();
        } catch (e) {
            console.log(e);
        }
    }
}


export default generator;