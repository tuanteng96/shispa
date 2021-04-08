import React from "react";
import { Link } from "framework7-react";
import { getUser } from "../constants/user";
import iconBook from "../assets/images/bookicon.png";
import { checkRole } from "../constants/checkRole";
import PrivateNav from "../auth/PrivateNav";


export default class ToolBarCustom extends React.Component {
  constructor() {
    super();
    this.state = {
      currentUrl: "",
      infoUser: getUser(),
    };
  }
  componentDidMount() {
    var $$ = this.Dom7;
    const itemLink = $$(".page-toolbar-bottom__link").length;
    this.setState({
      itemLink: itemLink,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const {itemLink} = this.state;
    var href = this.$f7.views.main.router.url;
    var $$ = this.Dom7;
    $$(".js-toolbar-link").removeClass("js-active");
    if (prevState.currentUrl !== href) {
      $$(".js-toolbar-link").each(function () {
        const _this = $$(this);
        const hrefLink = _this.attr("href");
        
        if (href === "/") {
          $$(".js-link-home").addClass("js-active");
        }
        if (hrefLink === href) {
          _this.addClass("js-active");
        }
      });
    }
    if (prevState.itemLink !== itemLink) {
      const itemLink = $$(".page-current").find(".page-toolbar-bottom__link")
        .length;
      this.setState({
        itemLink: itemLink,
      });
    }
  }

  menuToolbar = () => {
    const TYPE = checkRole();
    switch (TYPE) {
      case "STAFF":
        return (
          <React.Fragment>
            <PrivateNav
              className="page-toolbar-bottom__link js-toolbar-link js-link-home"
              icon="las la-hand-holding-heart"
              text="Dịch vụ"
              roles={["service"]}
              href="/employee/service/"
            />
            <PrivateNav
              className="page-toolbar-bottom__link js-toolbar-link"
              icon="las la-piggy-bank"
              text="Thống kê"
              roles={[
                "order",
                "sale",
                "service",
                "manager",
                "director",
                "store",
                "accountant",
              ]}
              href="/employee/statistical/"
            />
            <PrivateNav
              className="page-toolbar-bottom__link js-toolbar-link"
              icon="las la-chart-bar"
              text="Báo cáo"
              roles={["director"]}
              href="/employee/report/"
            />
            <PrivateNav
              className="page-toolbar-bottom__link js-toolbar-link"
              icon="las la-user-circle"
              text="Tài khoản"
              roles={[
                "order",
                "sale",
                "service",
                "manager",
                "director",
                "store",
                "accountant",
              ]}
              href="/profile/"
            />
          </React.Fragment>
        );
      case "ADMIN":
        return (
          <React.Fragment>
            <Link
              noLinkClass
              href="/employee/report/"
              className={`page-toolbar-bottom__link js-toolbar-link js-link-home ${TYPE}`}
            >
              <i className="las la-chart-bar"></i>
              <span>Báo cáo</span>
            </Link>
            <Link
              noLinkClass
              href="/profile/"
              className={`page-toolbar-bottom__link js-toolbar-link ${TYPE}`}
            >
              <i className="las la-user-circle"></i>
              <span>Tài khoản</span>
            </Link>
          </React.Fragment>
        );
      case "M":
        return (
          <React.Fragment>
            <Link
              noLinkClass
              href="/news/"
              className="page-toolbar-bottom__link js-toolbar-link js-link-home"
            >
              <i className="las la-newspaper"></i>
            </Link>
            <Link
              noLinkClass
              href="/shop/"
              className="page-toolbar-bottom__link js-toolbar-link"
            >
              <i className="las la-shopping-cart"></i>
            </Link>
            <Link
              noLinkClass
              href="/schedule/"
              className="page-toolbar-bottom__link active"
            >
              <div className="page-toolbar-bottom__link-inner">
                <img src={iconBook} alt="Đặt lịch" />
                {/* <i className="las la-calendar-plus"></i> */}
              </div>
            </Link>
            <Link
              noLinkClass
              href="/cardservice/"
              className="page-toolbar-bottom__link js-toolbar-link"
            >
              <i className="las la-clipboard-list"></i>
            </Link>
            <Link
              noLinkClass
              href="/profile/"
              className="page-toolbar-bottom__link js-toolbar-link"
            >
              <i className="las la-user-circle"></i>
            </Link>
          </React.Fragment>
        );
      default:
        return (
          <React.Fragment>
            <Link
              noLinkClass
              href="/news/"
              className="page-toolbar-bottom__link js-toolbar-link js-link-home"
            >
              <i className="las la-newspaper"></i>
            </Link>
            <Link
              noLinkClass
              href="/shop/"
              className="page-toolbar-bottom__link js-toolbar-link"
            >
              <i className="las la-shopping-cart"></i>
            </Link>
            <Link
              noLinkClass
              href="/login/"
              className="page-toolbar-bottom__link active"
            >
              <div className="page-toolbar-bottom__link-inner">
                <img src={iconBook} alt="Đặt lịch" />
              </div>
            </Link>
            <Link
              noLinkClass
              href="/maps/"
              className="page-toolbar-bottom__link js-toolbar-link"
            >
              <i className="las la-map-marked-alt"></i>
            </Link>
            <Link
              noLinkClass
              href="/login/"
              className="page-toolbar-bottom__link js-toolbar-link"
            >
              <i className="las la-user-circle"></i>
            </Link>
            <div className="page-toolbar-indicator">
              <div className="page-toolbar-indicator__left"></div>
              <div className="page-toolbar-indicator__right"></div>
            </div>
          </React.Fragment>
        );
    }
  };

  render() {
    const { itemLink } = this.state;
    return (
      <div className="page-toolbar">
        <div
          className={`page-toolbar-bottom js-toolbar-bottom total-${itemLink}`}
          id="js-toolbar-bottom"
        >
          {this.menuToolbar()}
        </div>
      </div>
    );
  }
}
