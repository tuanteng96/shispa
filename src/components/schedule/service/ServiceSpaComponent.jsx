import React from "react";
import { SERVER_APP } from "../../../constants/config";
import ShopDataService from "../../../service/shop.service";
import ReactHtmlParser from "react-html-parser";
import ServiceSpaSkeleton from "./ServiceSpaSkeleton";
import { getStockIDStorage } from "../../../constants/user";

export default class ServiceSpaComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading : true,
    };
  }
  componentDidMount() {
    this.getSerive();
  }

  getSerive = () => {
    ShopDataService.getCate(795)
      .then((response) => {
        const data = response.data;
        this.setState({
          arrService: data,
          isLoading: false,
        });
      })
      .catch((er) => console.log(er));
  };

  handleClick = (item) => {
    const id = item.ID;
    const Titles = item.Title;
    item.OrderItemID = id;
    item.Titles = Titles;

    this.props.handleDataService(item, null, true);

    const stockid = getStockIDStorage();
    stockid ? stockid : 0;
    ShopDataService.getServiceParentID(id, stockid)
      .then((response) => {
        var arrServiceParent = response.data.data;
        const promises = arrServiceParent.map((item) =>
          ShopDataService.getServiceProdID(item.ID, stockid).then(
            (response) => {
              const arrServiceProd = response.data.data;
              item.lst = arrServiceProd;
            }
          )
        );
        // wait for all requests to resolve
        Promise.all(promises).then(() => {
          this.props.handleDataService(item, arrServiceParent, false);
        });
      })
      .catch((e) => console.log(e));
  };

  render() {
    const { arrService, isLoading } = this.state;
    const { active } = this.props;
    return (
      <div className="service-me__box">
        <div className="service-me__list">
          {isLoading && <ServiceSpaSkeleton />}
          {!isLoading && arrService &&
            arrService.map((item, index) => {
              if (item.IsPublic === 1) {
                return (
                  <div
                    className={`item ${
                      active === item.OrderItemID ? "active" : ""
                    }`}
                    onClick={() => this.handleClick(item)}
                    key={index}
                  >
                    <div className="item-info">
                      <div className="title">{item.Title}</div>
                      <div className="desc">{ReactHtmlParser(item.Desc)}</div>
                    </div>
                    <div className="item-image">
                      <img
                        src={SERVER_APP + "/Upload/image/" + item.Thumbnail2}
                        alt={item.Title}
                      />
                    </div>
                  </div>
                );
              }
            })}
        </div>
      </div>
    );
  }
}
