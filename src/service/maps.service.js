import http from "../service/http-common";

class MapsDataService {
    getAll() {
        return http.get("/app/index.aspx?cmd=StockInfo");
    }
}

export default new MapsDataService();