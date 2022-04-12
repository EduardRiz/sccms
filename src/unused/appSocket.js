// import SockJS from "sockjs-client";
// import Stomp from "webstomp-client";
// import api from "@/api.js";

function socket(vm) {
    console.log(vm);
    // let s = {
    //     socket: null,
    //     $vm: null,
    //     stompClient: null,
    //     connected: false,
    //     interval: null,
    //     url: api.api + "/sc-events-queue",
    //     CONNECT: () => {
    //         this.socket = new SockJS(this.url);
    //         this.stompClient = Stomp.over(this.socket, {
    //             debug: false
    //         });
    //         const self = this.$vm;
    //         this.stompClient.connect({},
    //             (frame) => {
    //                 const {
    //                     command
    //                 } = frame;
    //                 switch (command) {
    //                     case "CONNECTED":
    //                         self.$store.commit("session/setConnected", true);
    //                         break;
    //                 }
    //                 console.log(frame);
    //                 this.connected = true;
    //                 this.stompClient.subscribe("/events", (tick) => {
    //                     console.log("tick")
    //                     self.$root.$emit("app-event", tick);
    //                 });
    //             },
    //             (error) => {
    //                 if (error.type == "close" && this.connected) this.autoconnect(vm);
    //                 console.log(error);
    //             }
    //         )
    //     },
    //     autoconnect() {
    //         this.interval = setInterval(() => {
    //             if (!this.connected) this.CONNECT(this.$vm);
    //             else clearInterval(this.interval)
    //         }, 5000);
    //     }
    // }
    // s.$vm = vm;
    // return s;

}
export default socket;