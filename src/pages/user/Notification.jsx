import React from "react";
import { Page, Link, Toolbar, Navbar, Fab, Icon } from "framework7-react";
import ToolBarBottom from "../../components/ToolBarBottom";
import UserService from "../../service/user.service";
import noNotification from "../../assets/images/no-notification.png";
import { getUser } from "../../constants/user";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import "moment/locale/vi";
moment.locale("vi");

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      arrNoti: [],
      allChecked: false,
      isCheckAll: false,
    };
  }
  componentDidMount() {
    this.getNotification();
  }

  getNotification = () => {
    const infoUser = getUser();
    if (!infoUser) {
      _this.$f7.views.main.router.navigate("/notification/");
      return false;
    }

    UserService.getNotification(infoUser.acc_type, infoUser.acc_id, 0, 200)
      .then((response) => {
        const data = response.data.data;
        const dataNew = [];
        data.map((item) => {
          const itemNew = {
            ...item,
            isChecked: false,
          };
          dataNew.push(itemNew);
        });
        this.setState({
          arrNoti: dataNew,
        });
      })
      .catch((er) => console.log(er));
  };
  iconNoti = () => {
    return (
      <svg
        width={20}
        height={20}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="prefix__feather prefix__feather-bell"
      >
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
      </svg>
    );
  };
  handleCheckAll = () => {
    this.setState((prevState) => {
      let { arrNoti, allChecked, isActive, isCheckAll } = prevState;
      isActive = "";
      if (arrNoti.length > 0) {
        isCheckAll = !isCheckAll;
      }
      if (isCheckAll === true) {
        arrNoti = arrNoti.map((item) => ({
          ...item,
          isChecked: true,
        }));
      } else {
        arrNoti = arrNoti.map((item) => ({
          ...item,
          isChecked: false,
        }));
      }

      return { arrNoti, allChecked, isActive, isCheckAll };
    });
  };
  handleChangeInput = (e) => {
    let itemID = e.target.name;
    let checked = e.target.checked;
    this.setState((prevState) => {
      let { arrNoti, allChecked, isCheckAll } = prevState;
      if (itemID === "checkAll") {
        allChecked = checked;
        arrNoti = arrNoti.map((item) => ({ ...item, isChecked: checked }));
      } else {
        arrNoti = arrNoti.map((item) =>
          item.ID === parseInt(itemID) ? { ...item, isChecked: checked } : item
        );
        allChecked = arrNoti.every((item) => item.isChecked);
      }
      if (isCheckAll === true) {
        const arrNotiLeng = arrNoti.filter((x) => x.isChecked === true).length;
        arrNotiLeng === 0 ? (isCheckAll = false) : isCheckAll;
      }
      return { arrNoti, allChecked, isCheckAll };
    });
  };

  handleItem = (item) => {
    const id = item.ID;
    const { isCheckAll, isActive } = this.state;
    if (isCheckAll === true) return;
    if (isActive !== id) {
      this.setState({
        isActive: id,
      });
    } else {
      this.setState({
        isActive: "",
      });
    }

    this.handleReaded(item);
  };

  handleReaded = (item) => {
    if (item.IsReaded) return false;
    const id = item.ID;
    const data = new FormData();
    data.append("ids", id);
    UserService.readedNotification(data)
      .then((response) => {
        if (response.data) {
          this.setState({
            isCheckAll: false,
          });
          this.getNotification();
        }
      })
      .catch((er) => console.log(er));
  };

  handleDelete = (id) => {
    const data = new FormData();
    data.append("ids", id);
    UserService.deleteNotification(data)
      .then((response) => {
        if (response.data) {
          toast.success(" Xóa thành công !", {
            position: toast.POSITION.TOP_LEFT,
            autoClose: 3000,
          });
          this.setState({
            isCheckAll: false,
          });
          this.getNotification();
        }
      })
      .catch((er) => console.log(er));
  };

  handleDeleteAll = () => {
    const { arrNoti } = this.state;
    const arrNotiDelete = [];
    arrNoti
      .filter((x) => x.isChecked === true)
      .map((x) => {
        arrNotiDelete.push(x.ID);
      });
    const listItemDelete = arrNotiDelete.join(",");
    this.handleDelete(listItemDelete);
  };

  render() {
    const { arrNoti, isActive, isCheckAll } = this.state;
    return (
      <Page>
        <Navbar>
          <div className="page-navbar">
            <div className="page-navbar__back">
              <Link onClick={() => this.$f7router.back()}>
                <i className="las la-angle-left"></i>
              </Link>
            </div>
            <div className="page-navbar__title">
              <span className="title">Thông báo</span>
            </div>

            <div className="page-navbar__noti" onClick={this.handleCheckAll}>
              <Link>
                {isCheckAll === false ? (
                  <i className="las la-check-double"></i>
                ) : (
                  <span className="text-close-noti">Hủy</span>
                )}
              </Link>
            </div>
          </div>
        </Navbar>
        <div className="page-render no-bg p-0">
          <div className="page-noti">
            {arrNoti && arrNoti.length === 0 ? (
              <div className="no-notification">
                <img src={noNotification} />
              </div>
            ) : (
              ""
            )}
            <ul className="page-noti__list">
              {arrNoti &&
                arrNoti.map((item, index) => (
                  <li
                    className={
                      (isActive === item.ID ? "active " : "") +
                      (item.isChecked === true ? "activeFull " : "") +
                      (item.IsReaded === true ? "readed" : "")
                    }
                    key={index}
                  >
                    <div
                      className="action"
                      onClick={() => this.handleItem(item)}
                    >
                      <div className="icon">
                        <div className="icon-box">{this.iconNoti()}</div>
                      </div>
                      <div className="text">
                        <h4>{item.Title}</h4>
                        <div className="text-desc">{item.Body}</div>
                        <div className="text-time">
                          {moment(item.CreateDate).fromNow()}{" "}
                          {item.IsReaded === true ? (<span>- Đã xem</span>) : ("")}
                        </div>
                      </div>
                    </div>
                    <div
                      className="delete"
                      onClick={() => this.handleDelete(item.ID)}
                    >
                      <i className="las la-trash"></i>
                    </div>
                    <div className="input">
                      <input
                        key={item.ID}
                        type="checkbox"
                        name={item.ID}
                        value={item.ID}
                        checked={item.isChecked}
                        onChange={this.handleChangeInput}
                      />
                      <i className="las la-check"></i>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
        {isCheckAll === true ? (
          <Fab
            className="btn-notification-deleteall"
            position="left-bottom"
            slot="fixed"
            color="red"
            onClick={() => this.handleDeleteAll()}
          >
            <i className="las la-trash"></i>
          </Fab>
        ) : (
          ""
        )}

        <Toolbar tabbar position="bottom">
          <ToolBarBottom />
        </Toolbar>
      </Page>
    );
  }
}
