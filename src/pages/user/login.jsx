import React from "react";
import { SERVER_APP } from "./../../constants/config";
import { setUserStorage } from "../../constants/user";
import { Page, Link, Toolbar } from "framework7-react";
import UserService from "../../service/user.service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setSubscribe } from "../../constants/subscribe";

toast.configure();
export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      username: "",
      password: "",
      arrNews: [],
      arrBanner: [],
    };
  }
  componentDidMount() {
  }
  loginSubmit = () => {
    const username = this.state.username;
    const password = this.state.password;
    if (username === "" || password === "") {
      toast.error("Vui lòng nhập tài khoản & mật khẩu !", {
        position: toast.POSITION.TOP_LEFT,
        autoClose: 3000,
      });
      return;
    }
    const self = this;
    self.$f7.preloader.show();
    UserService.login(username, password)
      .then((response) => {
        if (response.data.error) {
          self.$f7.preloader.hide();
          toast.error("Tài khoản & mật khẩu không chính xác !", {
            position: toast.POSITION.TOP_LEFT,
            autoClose: 3000,
          });
          this.setState({
            password: "",
          });
        } else {
          const userData = response.data;
          const token = userData.etoken;
          setUserStorage(token, userData, password);
          setSubscribe(userData, password);
          setTimeout(() => {
            self.$f7.preloader.hide();
            this.$f7router.navigate("/", { reloadCurrent: true });
          }, 1000);
        }
      })
      .catch((e) => console.log(e));
  };

  handleChangeInput = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };

  render() {
    const isLoading = this.state.isLoading;
    const password = this.state.password;
    return (
      <Page noNavbar noToolbar name="login">
        <div className="page-wrapper page-login">
          <div className="page-login__back">
            <Link onClick={() => this.$f7router.back()}>
              <i className="las la-arrow-left"></i>
            </Link>
          </div>
          <div className="page-login__content">
            <div className="page-login__logo">
              <img src={SERVER_APP + "/app/images/logo.png"} />
            </div>
            <div className="page-login__form">
              <div className="page-login__title">
                Hi, Vui lòng đăng nhập vào tài khoản của bạn
              </div>
              <form>
                <div className="page-login__form-item">
                  <input
                    type="text"
                    name="username"
                    autoComplete="off"
                    onChange={this.handleChangeInput}
                    placeholder="Số điện thoại hoặc Email"
                  />
                </div>
                <div className="page-login__form-item">
                  <input
                    type="password"
                    value={password}
                    name="password"
                    autoComplete="off"
                    onChange={this.handleChangeInput}
                    placeholder="Mật khẩu"
                  />
                </div>
                <div className="page-login__form-item">
                  <button
                    type="button"
                    onClick={() => this.loginSubmit()}
                    className={
                      "btn-login btn-me" + (isLoading === true ? " loading" : "")
                    }
                  >
                    <span>Đăng nhập</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="page-login__alert">
            Bạn chưa có tài khoản ?<Link href="/registration/">Đăng ký</Link>
          </div>
        </div>
      </Page>
    );
  }
}
