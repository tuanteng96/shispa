import http from "../service/http-common";

class UserService {
    login(username, password) {
        return http.get(`/app/index.aspx?USN=${username}&PWD=${password}&cmd=authen`);
    }
    register(fullname, password, phone, stock) {
        return http.get(`/app/index.aspx?Fn=${fullname}&Phone=${phone}&NewPWD=${password}&cmd=reg&ByStock=${stock}&USN=${phone}`);
    }
    getInfo(username, password) {
        return http.get(`/app/index.aspx?cmd=authen&USN=${username}&PWD=${password}`)
    }
    getSubscribe(usn, pwd, isuser) {
        return http.get(`/app/index.aspx?cmd=authen&USN=${usn}&PWD=${pwd}&IsUser=${isuser}`);
    }
    getListTagService(username, password, memberid) {
        return http.get(`/services/preview.aspx?a=1&USN=${username}&PWD=${password}&cmd=loadOrderService&MemberID=${memberid}&IsMember=1&fromOrderAdd=0`);
    }
    getBarCode(memberid) {
        return http.get(`/services/preview.aspx?cmd=Barcode&mid=${memberid}`);
    }
    updateBirthday(date, username, password) {
        return http.get(`/api/v1/?cmd=member_update_birth`, {
            params: {
                birth: date,
                USN: username,
                PWD: password
            }
        })
    }
    updateEmail(email, crpwd, username, password) {
        return http.get(`/api/v1/?cmd=member_update_email`, {
            params: {
                email: email,
                crpwd: crpwd,
                USN: username,
                PWD: password
            }
        })
    }
    updatePassword(username, password, data) {
        return http.post(`/app/index.aspx?cmd=chgpwd&USN=${username}&PWD=${password}`, data);
    }
    getStock() {
        return http.post(`/api/v3/web?cmd=getStock`)
    }
    setStock(data) {
        return http.post(`/api/v3/web?cmd=setStock`, data)
    }
    getVoucher(memberid) {
        return http.post(`/app/index.aspx?cmd=voucherandaff&mid=${memberid}`);
    }
    getWallet(data) {
        return http.post(`/services/preview.aspx?cmd=list_money`, data);
    }
    getDiary(username, password) {
        return http.post(`/app/index.aspx?cmd=noti&USN=${username}&PWD=${password}`);
    }
    getReviews(memberid) {
        return http.get(`/api/v3/OrderService?cmd=get_service_unrate&mid=${memberid}`);
    }
    postReviews(memberid, data) {
        return http.post(`/api/v3/OrderService?cmd=get_service_unrate&mid=${memberid}`, data);
    }
    getNotification(acctype, accid, offset, next) {
        return http.get(`/api/v3/noti2?cmd=nextoffset&acctype=${acctype}&accid=${accid}&offset=${offset}&next=${next}`);
    }
    deleteNotification(data) {
        return http.post(`/api/v3/noti2/?cmd=clear2`, data);
    }
    readedNotification(data) {
        return http.post(`/api/v3/noti2/?cmd=readed2`, data);
    }
    getOrderAll(memberID) {
        return http.get(`/services/preview.aspx?cmd=search_order&key=kh:${memberID}&getitems=1`);
    }
    getOrderAll2(member) {
        return http.get(`/app/index.aspx?cmd=orders&USN=${member.USN}&PWD=${member.PWD}&IsUser=0`)
    }
    getConfig(name) {
        return http.get(`/api/v3/config?cmd=getnames&names=${name}`);
    }
}

export default new UserService();