import * as signalR from "@microsoft/signalr";

class SignalRService {
    constructor() {
        this.connection = null;
        this.onNotificationReceived = null;
    }

    startConnection = (userId) => {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl("https://flexiroapi-d7akfuaug8d7esdg.uksouth-01.azurewebsites.net/notificationHub")
            .withAutomaticReconnect()
            .build();

        this.connection.start()
            .then(() => {

                this.connection.invoke("OnConnected", userId);
            })
            .catch(err => console.error("SignalR Connection Error: ", err));

        this.connection.on("ReceiveNotification", (message) => {
            if (this.onNotificationReceived) {
                this.onNotificationReceived(message);
            }
        });
    }

    stopConnection = () => {
        if (this.connection) {
            this.connection.stop();
        }
    }

    setOnNotificationReceived = (callback) => {
        this.onNotificationReceived = callback;
    }
}

const signalRService = new SignalRService();
export default signalRService;