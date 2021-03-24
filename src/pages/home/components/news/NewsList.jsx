import React from "react";
import { Link } from "framework7-react";
import Slider from "react-slick";
import ReactHtmlParser from "react-html-parser";
import SkeletonNews from "../news/SkeletonNews";
import NewsDataService from "../../../../service/news.service";
import { SERVER_APP } from "../../../../constants/config";

export default class NewsList extends React.Component {
  constructor() {
    super();
    this.state = {
      width: window.innerWidth,
      isLoading: true,
    };
  }
  componentDidMount() {
    this.getNewsAll();
  }
  handStyle = () => {
    const _width = this.state.width - 120;
    return Object.assign({
      width: _width,
    });
  };

  getNewsAll = () => {
    NewsDataService.getAll()
      .then((response) => {
        const arrNews = response.data.news;
        this.setState({
          arrNews: arrNews,
          isLoading: false,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  render() {
    const { arrNews, isLoading } = this.state;
    const settingsNews = {
      className: "slider variable-width",
      dots: false,
      arrows: false,
      infinite: true,
      slidesToShow: 1,
      centerPadding: "20px",
      variableWidth: true,
    };
    return (
      <div className="page-news__list-ul">
        {!isLoading && (
          <Slider {...settingsNews}>
            {arrNews &&
              arrNews.map((item, index) => {
                if (index > 6) return null;
                return (
                  <Link
                    href={"/news/detail/" + item.ID + "/"}
                    className="page-news__list-item"
                    key={item.ID}
                    style={this.handStyle()}
                  >
                    <div className="images">
                      <img
                        src={SERVER_APP + item.Thumbnail_web}
                        alt={item.Title}
                      />
                    </div>
                    <div className="text">
                      <h6>{item.Title}</h6>
                      <div className="desc">{ReactHtmlParser(item.Desc)}</div>
                    </div>
                  </Link>
                );
              })}
          </Slider>
        )}
        {isLoading && <SkeletonNews />}
      </div>
    );
  }
}
