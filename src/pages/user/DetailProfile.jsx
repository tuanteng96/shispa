import React from "react";
import { Page, Link, Navbar } from "framework7-react";
import SelectStock from "../../components/SelectStock";
import {
  checkAvt,
  formatDateBirday,
  formatDateUTC,
} from "../../constants/format";
import {
  getUser,
  getPassword,
  getStockNameStorage,
  app_request,
} from "../../constants/user";
import UserService from "../../service/user.service";
import DatePicker from "react-mobile-datepicker";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      memberInfo: [],
      IDStockName: "",
      isOpen: false,
      isOpenStock: false,
    };
  }

  componentDidMount() {
    this.getInfoMember();
    this.getStockCurrent();
  }
  getInfoMember = () => {
    const infoUser = getUser();
    if (!infoUser) return false;
    const username = infoUser.MobilePhone;
    const password = getPassword();
    UserService.getInfo(username, password)
      .then((response) => {
        const memberInfo = response.data.info;
        this.setState({
          memberInfo: memberInfo,
        });
      })
      .catch((err) => console.log(err));
  };
  signOut = () => {
    const $$this = this;
    $$this.$f7.dialog.confirm("Bạn muống đăng xuất khỏi tài khoản ?", () => {
      localStorage.clear();
      app_request("unsubscribe", "");
      $$this.$f7router.navigate("/");
    });
  };

  handleClickBirthday = () => {
    this.setState({ isOpen: true });
  };

  handleCancelBirthday = () => {
    this.setState({ isOpen: false });
  };

  handleSelectBirthday = (date) => {
    var date = formatDateUTC(date);
    const infoUser = getUser();
    const username = infoUser.MobilePhone;
    const password = getPassword();

    UserService.updateBirthday(date, username, password)
      .then((response) => {
        if (!response.error) {
          toast.success("Cập nhập ngày sinh thành công !", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
          });
          this.getInfoMember();
        } else {
          toast.error("Ngày sinh không hợp lệ !", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
          });
        }
      })
      .catch((err) => console.log(err));
    this.setState({ isOpen: false });
  };

  handleUpdateEmail = () => {
    const self = this;
    self.$f7router.navigate("/edit-email/");
  };
  handleUpdatePassword = () => {
    const self = this;
    self.$f7router.navigate("/edit-password/");
  };

  getStockCurrent = () => {
    const StockCurrentName = getStockNameStorage();
    this.setState({
      IDStockName: StockCurrentName,
    });
  };

  changeStock = () => {
    this.setState({ isOpenStock: !this.state.isOpenStock });
  };

  checkSuccess = (status) => {
    if (status === true) {
      this.getStockCurrent();
    }
  };

  render() {
    const member = this.state.memberInfo && this.state.memberInfo;
    const IDStockName = this.state.IDStockName;
    const dateConfig = {
      date: {
        caption: "Ngày",
        format: "D",
        step: 1,
      },
      month: {
        caption: "Tháng",
        format: "M",
        step: 1,
      },
      year: {
        caption: "Năm",
        format: "YYYY",
        step: 1,
      },
    };
    return (
      <Page
        onPageBeforeIn={this.onPageBeforeIn.bind(this)}
        name="detail-profile"
        noToolbar
      >
        <Navbar>
          <div className="page-navbar">
            <div className="page-navbar__back">
              <Link onClick={() => this.$f7router.back()}>
                <i className="las la-angle-left"></i>
              </Link>
            </div>
            <div className="page-navbar__title">
              <span className="title">Thông tin cá nhân</span>
            </div>
            <div className="page-navbar__noti">
              <Link onClick={() => this.signOut()}>
                <i className="las la-sign-out-alt"></i>
              </Link>
            </div>
          </div>
        </Navbar>
        <div className="page-render page-detail-profile p-0">
          <div className="page-detail-profile__box">
            <div className="page-detail-profile__item">
              <div className="name">Avatar</div>
              <div className="content">
                <div className="content-avatar">
                  <img src={checkAvt(member.Photo)} />
                </div>
                <i className="las la-angle-right"></i>
              </div>
            </div>
            <div className="page-detail-profile__item">
              <div className="name">Họ và tên</div>
              <div className="content">
                <div className="content-text">{member.FullName}</div>
              </div>
            </div>
            <div className="page-detail-profile__item">
              <div className="name">Giới tính</div>
              <div className="content">
                <div className="content-text">
                  {member.Gender === 1 ? "Nam" : "Nữ"}
                </div>
              </div>
            </div>
            <div
              className="page-detail-profile__item"
              onClick={this.handleClickBirthday}
            >
              <div className="name">Ngày sinh</div>
              <div className="content">
                <div className="content-text">
                  {formatDateBirday(member.BirthDate)}
                  <DatePicker
                    theme="ios"
                    cancelText="Đóng"
                    confirmText="Cập nhập"
                    headerFormat="DD/MM/YYYY"
                    showCaption={true}
                    dateConfig={dateConfig}
                    value={new Date(member.BirthDate)}
                    isOpen={this.state.isOpen}
                    onSelect={this.handleSelectBirthday}
                    onCancel={this.handleCancelBirthday}
                  />
                </div>
                <i className="las la-angle-right"></i>
              </div>
            </div>
            <div className="page-detail-profile__item">
              <div className="name">Số điện thoại</div>
              <div className="content">
                <div className="content-text">{member.MobilePhone}</div>
              </div>
            </div>
            <div
              className="page-detail-profile__item"
              onClick={() => this.handleUpdateEmail()}
            >
              <div className="name">Email</div>
              <div className="content">
                <div className="content-text">{member.Email}</div>
                <i className="las la-angle-right"></i>
              </div>
            </div>
            <div className="page-detail-profile__item">
              <div className="name">Địa chỉ</div>
              <div className="content">
                <div className="content-text">{member.HomeAddress}</div>
              </div>
            </div>
            <div
              className="page-detail-profile__item"
              onClick={() => this.changeStock()}
            >
              <div className="name">Cơ sở</div>
              <div className="content">
                <div className="content-text">
                  {IDStockName === "" ? "Chưa chọn điểm" : IDStockName}
                </div>
                <i className="las la-angle-right"></i>
              </div>
            </div>
            <div
              className="page-detail-profile__item"
              onClick={() => this.handleUpdatePassword()}
            >
              <div className="name">Mật khẩu</div>
              <div className="content">
                <div className="content-text password-chw">Thay đổi</div>
                <i className="las la-angle-right"></i>
              </div>
            </div>
            <div className="line-logout"></div>
          </div>
          <div className="page-detail-profile__footer">
            <div className="text">Cser Beauty 1.0.0</div>
            <button
              type="button"
              className="btn-signout"
              onClick={() => this.signOut()}
            >
              Đăng xuất
            </button>
          </div>
        </div>
        <SelectStock
          isOpenStock={this.state.isOpenStock}
          fnSuccess={(status) => this.checkSuccess(status)}
        />
      </Page>
    );
  }
  onPageBeforeIn() {
    this.getInfoMember();
  }
}
