import React from "react";
import { SERVER_APP } from "./../../constants/config";
import ReactHtmlParser from "react-html-parser";
import NewsDataService from "../../service/news.service";
import { Page, Link, Navbar, Toolbar } from "framework7-react";
import ToolBar from "../../components/ToolBar";
import NotificationIcon from "../../components/NotificationIcon";
import SkeletonNews from "../news/SkeletonNews";

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      arrNews: [],
      isLoading: true,
    };
  }

  componentDidMount() {
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
  }

  render() {
    const arrNews = this.state.arrNews;
    const { isLoading } = this.state;
    return (
      <Page name="news-list">
        <Navbar>
          <div className="page-navbar">
            <div className="page-navbar__back">
              <Link onClick={() => this.$f7router.back()}>
                <i className="las la-angle-left"></i>
              </Link>
            </div>
            <div className="page-navbar__title">
              <span className="title">Tin tức & Khuyến mại</span>
            </div>
            <div className="page-navbar__noti">
              <NotificationIcon />
            </div>
          </div>
        </Navbar>
        <div className="page-wrapper">
          <div className="page-render">
            <div className="page-news__list page-news__all">
              {!isLoading && (
                <div className="page-news__list-ul">
                  {arrNews &&
                    arrNews.map((item, index) => {
                      return (
                        <Link
                          href={"/news/detail/" + item.ID + "/"}
                          className="page-news__list-item"
                          key={item.ID}
                        >
                          <div className="images">
                            <img
                              src={SERVER_APP + item.Thumbnail_web}
                              alt={item.Title}
                            />
                          </div>
                          <div className="text">
                            <h6>{item.Title}</h6>
                            <div className="desc">
                              {ReactHtmlParser(item.Desc)}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                </div>
              )}
              {isLoading && <SkeletonNews />}
            </div>
          </div>
        </div>
        <Toolbar tabbar position="bottom">
          <ToolBar />
        </Toolbar>
      </Page>
    );
  }
}
