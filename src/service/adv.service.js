import http from "../service/http-common";

class AdvDataService {
    getMenuShop() {
        return http.get("/app/index.aspx?cmd=adv&pos=App.MuaHang");
    }
}

export default new AdvDataService();