import React from "react";
import { Page, Link, Toolbar, Navbar } from "framework7-react";
import ToolBarBottom from "../../components/ToolBarBottom";
import UserService from "../../service/user.service";
import NotificationIcon from "../../components/NotificationIcon";
import { getUser, getPassword } from "../../constants/user";
import PageNoData from "../../components/PageNoData";
import {
  formatPriceVietnamese,
  checkImageProduct,
} from "../../constants/format";
import moment from "moment";
import "moment/locale/vi";
moment.locale("vi");

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      arrOder: [],
    };
  }
  componentDidMount() {
    this.getOrderAll();
  }

  getOrderAll = () => {
    const infoUser = getUser();
    const PWD = getPassword();
    console.log(PWD);
    if (!infoUser || !PWD) {
      this.$f7router.navigate("/login/");
      return;
    }
    const member = {
      USN: infoUser.MobilePhone,
      PWD: PWD,
    };
    UserService.getOrderAll2(member)
      .then((response) => {
        
        const data = response.data;
        console.log(data);
        this.setState({
          arrOder: data,
        });
      })
      .catch((er) => console.log(er));
  };

  formatDateFull = (data) => {
    const dateSplit = data.split("T");
    return dateSplit[1] + " " + dateSplit[0];
  };

  checkStatus = (status) => {
    if (status === "finish") {
      return "success";
    }
  }

  async loadRefresh(done) {
    await this.getOrderAll();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    done();
  }

  render() {
    const { arrOder } = this.state;
    return (
      <Page
        onPtrRefresh={this.loadRefresh.bind(this)}
        ptr
        infiniteDistance={50}
      >
        <Navbar>
          <div className="page-navbar">
            <div className="page-navbar__back">
              <Link onClick={() => this.$f7router.back()}>
                <i className="las la-angle-left"></i>
              </Link>
            </div>
            <div className="page-navbar__title">
              <span className="title">Đơn hàng</span>
            </div>
            <div className="page-navbar__noti">
              <NotificationIcon />
            </div>
          </div>
        </Navbar>
        <div className="page-render no-bg p-0">
          <div className="page-order">
            <div className="page-order__list">
              {arrOder.length > 0 ? (
                arrOder &&
                arrOder.map((item, index) => (
                  <Link key={index} href="" noLinkClass className="item">
                    <div className="item-header">
                      <i className="las la-dolly"></i>
                      <div className="text">
                        <div className="date">
                          {this.formatDateFull(item.OrderDate)}
                        </div>
                        <div
                          className={`status ` + this.checkStatus(item.Status)}
                        >
                          {item.StatusText}
                        </div>
                      </div>
                    </div>
                    <div className="item-body">
                      <div className="image">
                        <img src={checkImageProduct(item.Thumb1)} />
                      </div>
                      <div className="content">
                        <div className="content-item">x{item.Total}</div>
                        <div className="content-item">
                          Đã thanh toán :
                          <span>
                            {formatPriceVietnamese(
                              item.ToPay - Math.abs(item.RemainPay)
                            )}
                            <b>₫</b>
                          </span>
                        </div>
                        <div className="content-item">
                          Còn nợ :
                          <span>
                            {formatPriceVietnamese(Math.abs(item.RemainPay))}
                            <b>₫</b>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="item-footer">
                      <div className="content-item">
                        <span>Tổng đơn hàng :</span>
                        <span>
                          {formatPriceVietnamese(item.ToPay)}
                          <b>₫</b>
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <PageNoData text="Đơn hàng của bạn trống. Vui lòng đặt hàng." />
              )}
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
