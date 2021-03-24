import React from "react";
import { SERVER_APP } from "./../../constants/config";
import { Page, Link, Toolbar, Navbar } from "framework7-react";
import ReactHtmlParser from "react-html-parser";
import ToolBarBottom from '../../components/ToolBarBottom';
import MapsDataService from '../../service/maps.service';
import NewsDataService from "../../service/news.service";
import Slider from "react-slick";

export default class extends React.Component {
    constructor() {
        super();
        this.state = {
            arrMaps: [],
            mapCurrent: null
        };
    }

    componentDidMount() {
        this.$f7ready((f7) => {
            var $$ = this.Dom7;
            this.setState({ width: window.innerWidth });

            MapsDataService.getAll()
                .then((response) => {
                    const arrMaps = response.data.data.stocks;
                    const arrMapsNew = [];
                    arrMaps.map(item => {
                        if (item.Title !== "Kho") arrMapsNew.push(item);
                    })
                    this.setState({
                        arrMaps: arrMapsNew
                    })
                })
                .catch(e => console.log(e));
            this.getMapCurrent();
        });
    }

    handStyle = () => {
        const _width = this.state.width - 150;
        return Object.assign({
            width: _width,
        });
    }

    getMapCurrent = () => {
        NewsDataService.getDetailNew("177")
            .then(response => {
                const mapCurrent = ReactHtmlParser(response.data.data[0].Desc);
                this.setState({
                  mapCurrent: mapCurrent[0].props.children[0],
                });
            })
        .catch(error => console.log(error))
    }

    render() {
        const { arrMaps, mapCurrent } = this.state;
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
                {mapCurrent && (
                  <iframe
                    src={mapCurrent}
                    frameBorder={0}
                    allowFullScreen
                    aria-hidden="false"
                    tabIndex={0}
                  />
                )}
              </div>
              <div className="page-maps__list">
                <Slider {...settingsMaps}>
                  {arrMaps &&
                    arrMaps.map((item) => (
                      <div
                        className="page-maps__list-item"
                        key={item.ID}
                        style={this.handStyle()}
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
                          <h3>{item.Title}</h3>
                          <ul>
                            <li className="address">
                              <i className="las la-map-marked-alt"></i>
                              {item.Desc}
                            </li>
                            <li className="phone">
                              <i className="las la-phone-volume"></i>
                              {item.LinkSEO}
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