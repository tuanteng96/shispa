import { Link } from "framework7-react";
import React from "react";
import { FaWhatsapp, FaFacebookMessenger } from "react-icons/fa";
import { CALL_PHONE } from "../../constants/prom21";
import { getStockIDStorage } from "../../constants/user";
import userService from "../../service/user.service";

export default class quickAction extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  componentDidMount() {
    //this.getPhone();
    this.mounted = true;
  }

  async componentDidUpdate(prevProps, prevState) {
    const stockName = this.props.stockName;
    if (prevProps.stockName !== stockName) {
      const stock = await getStockIDStorage();
      if (!stock || parseInt(stock) === 9992) {
        const allAdd1 = await userService.getConfig("Chung.sdt");
        this.setState({
          phone: allAdd1.data.data[0].ValueText,
        });
      } else {
        const allAdd2 = await userService.getConfig("Chung.sdt1");
        this.setState({
          phone: allAdd2.data.data[0].ValueText,
        });
      }
    }
  }

  componentWillUnmount() {
    this.mounted = false;
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
          data-phone={phone && phone}
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
