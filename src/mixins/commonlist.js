
export default {
    data() {
        return {
            items: [],
            dates: [],
            filterBy: "created",
            dmode: "delete",
            d_confirm: false,
            currentPage: 1,
            company: null,
            pagination: {},
            totalItems: 0,
            search: "",
            lvSearch: "",
            itemPerPage: 14,
            foot_props: {
                itemsPerPageOptions: [14, 20, 50, 100], // -> Add this example
                showFirstLastPage: true,
                firstIcon: "mdi-arrow-collapse-left",
                lastIcon: "mdi-arrow-collapse-right",
                prevIcon: "mdi-less-than",
                nextIcon: "mdi-greater-than",
                itemsPerPageText: this.$t("label.rowPerPage")
            },
        }
    },
    computed: {
        filteredItems() {
            if (this.dates.length == 2) {
                return this.items.filter(e => {
                    const d0 = this.$moment(e[this.filterBy]);
                    let d1 = this.$moment(this.dates[0]);
                    let d2 = this.$moment(this.dates[1]);
                    if (d1.isAfter(d2)) {
                        d1 = this.$moment(this.dates[1]);
                        d2 = this.$moment(this.dates[0]);
                    }
                    if (this.company && e.company != this.company) return false;
                    return d0.isAfter(d1.startOf("day")) && d0.isBefore(d2.endOf("day"));
                });
            } else if (this.company) {
                return this.items.filter(e => {
                    return e.company == this.company;
                });
            } else {
                return this.items;
            }
        }
    },
    watch: {
        pagination: {
          handler() {
            this.loadData();
          },
          deep: true,
        },
      },
   
    methods: {
        startSearch() {
            let latv = "ēūīāšģķļžčņ";
            let latin = "euiasgklzcn";
            let str = "";
            [...this.search.toLowerCase()].forEach(s => {
                let lv = latv.indexOf(s);
                let tn = latin.indexOf(s);
                if (lv != -1) str += "[" + s + latin[lv] + "]";
                else if (tn != -1) str += "[" + s + latv[tn] + "]";
                else str += s;
            });
            this.lvSearch = str;
        },
        customSearch(value, search, item) {
            if (!value || !search) return false;
            try {
                return new RegExp(search, "i").test(this.searchField ? item[this.searchField] : value);
            } catch (error) {
                return false;
            }
        },
        sortByParam(def) {
            let sort = def;
            try {
                if (this.pagination.sortBy.length) {
                    sort = this.pagination.sortBy.join()+ (this.pagination.sortDesc[0] ? ",asc" : ",desc");
                }
            } catch (error) {
                console.log(error);
            }
            return sort;
        },
        debug(v) {
            console.log(v);
        },
    }
}