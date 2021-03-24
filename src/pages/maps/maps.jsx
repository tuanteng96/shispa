import React from "react";
import { SERVER_APP } from "./../../constants/config";
import { Page, Link, Toolbar, Navbar } from "framework7-react";
import ReactHtmlParser from "react-html-parser";
import ToolBarBottom from '../../components/ToolBarBottom';
import MapsDataService from '../../service/maps.service';
import Slider from "react-slick";

export default class extends React.Component {
    constructor() {
        super();
        this.state = {
            arrMaps: []
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
                .catch(e => console.log(e))
        });
    }

    handStyle = () => {
        const _width = this.state.width - 150;
        return Object.assign({
            width: _width,
        });
    }

    render() {
        const arrMaps = this.state.arrMaps;
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
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.456787991938!2d105.80825751541903!3d21.01440119364303!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab6176bd4321%3A0x5db62fa79dcf1cd5!2zMjIsIDQyIFbFqSBOZ-G7jWMgUGhhbiwgS2h1IHThuq1wIHRo4buDIE5hbSBUaMOgbmggQ8O0bmcsIEzDoW5nIEjhuqEsIMSQ4buRbmcgxJBhLCBIw6AgTuG7mWksIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1602315946963!5m2!1svi!2s" frameBorder={0} allowFullScreen aria-hidden="false" tabIndex={0} />
                    </div>
                    <div className="page-maps__list">
                        <Slider {...settingsMaps}>
                            {
                                arrMaps && arrMaps.map((item) => (
                                    <div className="page-maps__list-item"
                                        key={item.ID}
                                        style={this.handStyle()}>
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
                                ))
                            }
                        </Slider>
                    </div>
                </div>
                <Toolbar tabbar position="bottom">
                    <ToolBarBottom />
                </Toolbar>
            </Page>
        )
    }
}