import { Link } from "framework7-react";
import React from "react";
import { GrCheckmark } from "react-icons/gr";

export default class ScheduleSuccess extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="page-schedule__success">
        <GrCheckmark />
        <div className="desc">
          <div>Quý khách vui lòng chờ trong ít phút.</div>
          <div>Chúng tôi sẽ liên hệ lại <span>xác nhận đặt lịch</span> của Quý Khách qua tin nhắn App hoặc điện thoại.</div>
          <div>Xin cảm ơn quý khách !</div>
        </div>
        <Link
          noLinkClass
          className="btn-submit-order"
          href="/manage-schedules/"
        >
          Quản lý đặt lịch
        </Link>
      </div>
    );
  }
}
