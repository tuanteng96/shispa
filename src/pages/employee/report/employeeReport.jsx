import React from "react";
import { Link, Navbar, Page, Toolbar } from "framework7-react";
import NotificationIcon from "../../../components/NotificationIcon";
import ToolBarBottom from "../../../components/ToolBarBottom";
import SelectStock from "../../../components/SelectStock";
import PageNoData from "../../../components/PageNoData";
export default class employeeReport extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  openStock = () => {
    this.setState({
      isOpenStock: !this.state.isOpenStock,
    });
  };

  render() {
    return (
      <Page name="employee-service">
        <Navbar>
          <div className="page-navbar">
            <div className="page-navbar__back">
              <Link onClick={() => this.openStock()}>
                <i className="las la-map-marked-alt"></i>
              </Link>
            </div>
            <div className="page-navbar__title">
              <span className="title">Báo cáo</span>
            </div>
            <div className="page-navbar__noti">
              <NotificationIcon />
            </div>
          </div>
        </Navbar>
        <div className="page-render">
          <PageNoData text="Đang cập nhập ..." />
        </div>
        <Toolbar tabbar position="bottom">
          <ToolBarBottom />
        </Toolbar>
        <SelectStock isOpenStock={this.state.isOpenStock} />
      </Page>
    );
  }
}
