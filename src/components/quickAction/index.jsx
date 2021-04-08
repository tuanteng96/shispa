import { Link } from "framework7-react";
import React from "react";
import { FaWhatsapp, FaFacebookMessenger } from "react-icons/fa";
import { CALL_PHONE } from "../../constants/prom21";
import userService from "../../service/user.service";

export default class quickAction extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  componentDidMount() {
    this.getPhone();
  }
  getPhone = () => {
    userService
      .getConfig("Chung.sdt")
      .then((response) => {
        this.setState({
          phone: response.data.data[0].ValueText,
        });
      })
      .catch((err) => console.log(err));
  };
  handleCall = (phone) => {
    CALL_PHONE(phone);
  };
  render() {
    const { phone } = this.state;
    return (
      <div className="page-quick">
        <div
          className="item call"
          onClick={() => this.handleCall(phone && phone)}
        >
          <FaWhatsapp />
        </div>
        {/* <Link
          //external
          //href=""
          noLinkClass
          className="item mess"
        >
          <FaFacebookMessenger />
        </Link> */}
      </div>
    );
  }
}
