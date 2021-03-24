import { Navbar, Toolbar, Page, Link } from "framework7-react";
import React from "react";
import IconSucces from "../../assets/images/box.svg";
import NotificationIcon from "../../components/NotificationIcon";
import ToolBarBottom from "../../components/ToolBarBottom";
import UserService from "../../service/user.service";
import { getPassword, setUserStorage, getUser } from "../../constants/user";

export default class extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  componentDidMount() {
      const userInfo = getUser();
      if (!userInfo) return false;
      const pwd = getPassword();
      UserService.getInfo(userInfo.MobilePhone, pwd)
          .then(response => {
              const data = response.data.info;
              setUserStorage(data.etoken, data, pwd);
          })
          .catch(er => console.log(er));
  }
  render() {
    return (
      <Page
        onPageBeforeOut={this.onPageBeforeOut}
        onPageBeforeRemove={this.onPageBeforeRemove}
        name="shop-pay-success"
      >
        <Navbar>
          <div className="page-navbar">
            <div className="page-navbar__back">
              <Link href="/news/">
                <i className="las la-home"></i>
              </Link>
            </div>
            <div className="page-navbar__title">
              <span className="title">Thành công</span>
            </div>
            <div className="page-navbar__noti">
              <NotificationIcon />
            </div>
          </div>
        </Navbar>
        <div className="page-render no-bg p-0">
          <div className="page-pay no-bg">
            <div className="page-pay-success">
              <div className="image">
                <img src={IconSucces} alt="Đơn hàng được gửi thành công!" />
              </div>
              <div className="text">
                Đơn hàng <span>#{this.$f7route.params.orderID}</span> của bạn đã
                được gửi thành công. Cảm ơn quý khách !
              </div>
              <div className="btn">
                <Link href="/order/">Đơn hàng của bạn</Link>
                <Link href="/shop/">Tiếp tục mua hàng</Link>
              </div>
            </div>
          </div>
        </div>
        <Toolbar tabbar position="bottom">
          <ToolBarBottom />
        </Toolbar>
      </Page>
    );
  }
}
