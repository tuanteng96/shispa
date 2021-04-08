import React from "react";
import { SERVER_APP } from "./../../constants/config";
import { Page, Link, Toolbar, Navbar } from "framework7-react";
import ReactHtmlParser from "react-html-parser";
import ToolBarBottom from "../../components/ToolBarBottom";
import MapsDataService from "../../service/maps.service";
import Slider from "react-slick";

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      arrMaps: [],
    };
  }
  componentDidMount() {
    this.setState({ width: window.innerWidth });

    MapsDataService.getAll("7956")
      .then((response) => {
        const result = response.data.data;
        this.setState({
          arrMaps: result,
          currentMap: result[0].source.Content,
          currentID: result[0].id,
        });
      })
      .catch((e) => console.log(e));
  }

  handStyle = () => {
    const _width = this.state.width - 150;
    return Object.assign({
      width: _width,
    });
  };
  handleMaps = (item) => {
    this.setState({
      currentMap: item.source.Content,
      currentID: item.id,
    });
  };

  render() {
    const { arrMaps, currentMap, currentID } = this.state;
    const settingsMaps = {
      className: "slider variable-width",
      dots: false,
      arrows: false,
      infinite: true,
      slidesToShow: 1,
      //centerPadding: "20px",
      variableWidth: true,
    };
    return (
      <Page noNavbar name="maps">
        <div className="page-wrapper page-maps">
          <div className="page-maps__back">
            <Link onClick={() => this.$f7router.back()}>
              <i className="las la-arrow-left"></i>
            </Link>
          </div>

          <div className="page-render page-maps__box p-0">
            {currentMap && (
              <iframe
                src={ReactHtmlParser(currentMap)[0].props.children[0]}
                frameBorder={0}
                allowFullScreen
                aria-hidden="false"
                tabIndex={0}
                loading="lazy"
              />
            )}
          </div>
          <div className="page-maps__list">
            <Slider {...settingsMaps}>
              {arrMaps &&
                arrMaps.map((item, index) => (
                  <div
                    className={`page-maps__list-item ${currentID === item.id ? "active" : ""}`}
                    key={index}
                    style={this.handStyle()}
                    onClick={() => this.handleMaps(item)}
                  >
                    <div className="page-maps__list-pd">
                      <div className="star">
                        <i className="las la-star"></i>
                        <i className="las la-star"></i>
                        <i className="las la-star"></i>
                        <i className="las la-star"></i>
                        <i className="las la-star"></i>
                        <i className="las la-location-arrow"></i>
                      </div>
                      <h3>{item.source.Title}</h3>
                      <ul>
                        <li className="address">
                          <i className="las la-map-marked-alt"></i>
                          {ReactHtmlParser(item.source.Desc)}
                        </li>
                        <li className="phone">
                          <i className="las la-phone-volume"></i>
                          {item.source.LinkSEO}
                        </li>
                        <li className="time">
                          <span>Đang mở cửa</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                ))}
            </Slider>
          </div>
        </div>
        <Toolbar tabbar position="bottom">
          <ToolBarBottom />
        </Toolbar>
      </Page>
    );
  }
}
