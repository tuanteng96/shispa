import React from "react";
import {
  Page,
  Link,
  Navbar,
  Toolbar,
  Row,
  Col,
  Subnavbar,
  Tabs,
  Tab,
} from "framework7-react";
import NotificationIcon from "../../components/NotificationIcon";
import ToolBarBottom from "../../components/ToolBarBottom";

import CardSchedulingComponent from "./SchedulesManage/CardSchedulingComponent";
import AdvisorySchedulesComponent from "./SchedulesManage/AdvisorySchedulesComponent";

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      isRefresh: false,
    };
  }

  handleLoadRefresh = () => {

  }

  async loadRefresh(done) {
    const { isRefresh } = this.state;
    this.setState({
      isRefresh: !isRefresh,
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    done();
  }

  render() {
    const { isRefresh } = this.state;
    return (
      <Page
        name="schedule-manage"
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
              <span className="title">Quản lý đặt lịch</span>
            </div>
            <div className="page-navbar__noti">
              <NotificationIcon />
            </div>
          </div>
          <Subnavbar className="cardservice-tab-head">
            <div className="cardservice-title card-book">
              <Link noLinkClass tabLink="#bookcard" tabLinkActive>
                Đặt lịch tư vấn
              </Link>
              <Link noLinkClass tabLink="#booksupport">
                Đặt lịch thẻ
              </Link>
            </div>
          </Subnavbar>
        </Navbar>
        <div className="page-wrapper">
          <div className="chedule-manage">
            <Tabs>
              <Tab id="bookcard" tabActive>
                <CardSchedulingComponent isRefresh={isRefresh} />
              </Tab>
              <Tab id="booksupport">
                <AdvisorySchedulesComponent isRefresh={isRefresh} />
              </Tab>
            </Tabs>
          </div>
        </div>
        <Toolbar tabbar position="bottom">
          <ToolBarBottom />
        </Toolbar>
      </Page>
    );
  }
}
