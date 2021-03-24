import React from "react";
import { Link, ListItem, Toolbar } from "framework7-react";
import ShopDataService from "../../service/shop.service";
import ServiceHotComponent from "./service/ServiceHotComponent";
import ServiceCartComponent from "./service/ServiceCartComponent";
import ServiceSpaComponent from "./service/ServiceSpaComponent";

export default class ScheduleService extends React.Component {
  constructor() {
    super();
    this.state = {
      arrProd: [],
      activeID: 0,
      arrProdActive: [],
      resetStep1: false,
      resetStep2: false,
      resetStep3: false,
    };
  }
  componentDidMount() {}

  serviceSelected = (item) => {
    this.props.handleService(item);
    this.setState({
      resetStep1: !this.state.resetStep1,
      activeID: 0,
    });
  };

  handleDataService = (item, data, loading) => {
    this.setState({
      activeID: item.OrderItemID,
      resetStep1: !this.state.resetStep1,
      resetStep2: !this.state.resetStep2,
    });
    this.props.handleDataService(item, data, loading);
  };

  handleMultiService = (item) => {
    this.props.handleService(item.length > 0 ? item : null);
    this.setState({
      resetStep2: !this.state.resetStep2,
      activeID: 0,
    });
  };

  render() {
    const { activeID, resetStep1, resetStep2, resetStep3 } = this.state;
    return (
      <div className="page-schedule__box">
        <div className="service-me">
          <h5>Thẻ dịch vụ của bạn</h5>
          <ServiceCartComponent
            handleMultiService={(item) => this.handleMultiService(item)}
            reset={resetStep1}
          />
        </div>
        <div className="service-hot">
          <h5>Dịch vụ nổi bật</h5>
          <ServiceHotComponent
            serviceSelected={(item) => this.serviceSelected(item)}
            reset={resetStep2}
          />
        </div>
        <div className="service-spa">
          <h5>Dịch vụ Spa</h5>
          <ServiceSpaComponent
            handleDataService={(item, data, loading) =>
              this.handleDataService(item, data, loading)
            }
            active={activeID}
            reset={resetStep3}
          />
        </div>
      </div>
    );
  }
}
