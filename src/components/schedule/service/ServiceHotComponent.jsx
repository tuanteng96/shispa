import React from "react";
import NewsDataService from "../../../service/news.service";
import Slider from "react-slick";
import { SERVER_APP } from "../../../constants/config";
import { AiFillCheckCircle } from "react-icons/ai";
import ServiceHotSkeleton from "./ServiceHotSkeleton";

export default class ServiceHotComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      width: window.innerWidth,
      isLoading: true,
    };
  }
  componentDidMount() {
    this.getService();
  }
  handStyle = () => {
    const _width = this.state.width - 70;
    return Object.assign({
      width: _width,
    });
  };
  getService = () => {
    NewsDataService.getBannerName("App.DichVuBook")
      .then((response) => {
        const data = response.data.data;
        this.setState({
          isLoading: false,
          arrService: data,
        });
      })
      .catch((er) => console.log(er));
  };

  handleClick = (item) => {
    const id = item.ID;
    const Titles = item.Title;
    item.OrderItemID = id;
    item.Titles = Titles;
    item.ServiceID = parseInt(item.Link);
    this.setState({
      active: id,
    });
    const itemBooks = [item];
    this.props.serviceSelected(itemBooks);
  };

  resetActive = () => {
    this.setState({
      active: 0,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { reset } = this.props;

    if (prevProps.reset !== reset) {
      this.resetActive();
    }
  }

  render() {
    const { arrService, isLoading, active } = this.state;
    const settingService = {
      className: "slider variable-width",
      dots: false,
      arrows: false,
      infinite: true,
      slidesToShow: 1,
      centerPadding: "20px",
      variableWidth: true,
    };
    return (
      <div className="service-hot__box">
        <div className="service-hot__list">
          {isLoading && <ServiceHotSkeleton />}
          <Slider {...settingService}>
            {!isLoading &&
              arrService &&
              arrService.map((item, index) => {
                return (
                  <div
                    className={`item ${active === item.ID ? "active" : ""}`}
                    key={item.ID}
                    onClick={() => this.handleClick(item)}
                    style={this.handStyle()}
                  >
                    <img
                      src={SERVER_APP + "/Upload/image/" + item.FileName}
                      alt={item.Title}
                    />
                    <div className="icon">
                      <AiFillCheckCircle />
                    </div>
                  </div>
                );
              })}
          </Slider>
        </div>
      </div>
    );
  }
}
