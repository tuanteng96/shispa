import { subscribe } from "../constants/user";
import UserService from "../service/user.service";
export const setSubscribe = (userData, PWD) => {
    if (!userData) return false;

    const USN = userData.MobilePhone ?
        userData.MobilePhone :
        userData.UserName;
    const IsUser = userData.acc_type === "M" ? 0 : 1
        // if (IsUser) {
        //     const StockID = userData.ByStockID;
        // }
    UserService.getSubscribe(USN, PWD, IsUser)
        .then(response => {
            const data = response.data;
            subscribe(data);
        })
        .catch(er => console.log(er));
}