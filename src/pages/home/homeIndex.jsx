import React, { Suspense } from "react";
import bgHeaderTop from "../../assets/images/bg-header-home.png";
import { Page, Link, Toolbar, f7} from "framework7-react";
import UserService from "../../service/user.service";
import IconSearch from "../../assets/images/icon-search.png";
import { FaRegUser, FaMapMarkerAlt, FaChevronDown } from "react-icons/fa";
const ModalReviews = React.lazy(() => import("../../components/ModalReviews"));
const SelectStock = React.lazy(() => import("../../components/SelectStock"));
import CartToolBar from "../../components/CartToolBar";
import ToolBarBottom from "../../components/ToolBarBottom";
import NotificationIcon from "../../components/NotificationIcon";
import {
  getUser,
  setStockIDStorage,
  getStockIDStorage,
  setStockNameStorage,
  getStockNameStorage,
  removeStockNameStorage,
} from "../../constants/user";
import ListService from "./components/Service/ListService";
import SlideList from "../home/components/BannerSlide/SlideList";
import ListImage from "../home/components/Customer/ListImage";
import ProductList from "../home/components/Product/ProductList";
import NewsList from "../home/components/news/NewsList";
import QuickAction from "../../components/quickAction";

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      arrNews: [],
      isOpenStock: false,
      width: window.innerWidth,
    };
  }

  componentDidMount() {
    const stockName = getStockNameStorage();
    this.setState({
      stockName: stockName,
    });
  }
  onPageBeforeIn = () => {
    const getStock = getStockIDStorage();
    
    UserService.getStock()
      .then((response) => {
        let indexStock = 0;
        const arrStock = response.data.data.all;
        
        const countStock = arrStock.length;
        const CurrentStockID = response.data.data.CurrentStockID;
        if (getStock) {
          indexStock = arrStock.findIndex(
            (item) => item.ID === parseInt(getStock)
          );
        }
        const indexCurrentStock = arrStock.findIndex(
          (item) => item.ID === parseInt(CurrentStockID)
        );;

        if (countStock === 2) {
          const StockID = arrStock.slice(-1)[0].ID;
          const TitleStockID = arrStock.slice(-1)[0].Title;
          setStockIDStorage(StockID);
          setStockNameStorage(TitleStockID);
        }
        setTimeout(() => {
          if (indexCurrentStock <= 0 && indexStock <= 0 && countStock > 2) {
            removeStockNameStorage();
            this.setState({
              isOpenStock: true,
              stockName: null
            });
          }
        }, 500);
      })
      .catch((e) => console.log(e));
  };

  handleStock = () => {
    this.setState({
      isOpenStock: !this.state.isOpenStock,
    });
  };

  userHTML = () => {
    if (!getUser()) {
      return (
        <Link href="/login/" noLinkClass>
          <FaRegUser />
        </Link>
      )
    }
    else {
      return (
        <Link href="/profile/" noLinkClass>
          <FaRegUser />
        </Link>
      )
    }
  }

  nameStock = (name) => {
    this.setState({
      stockName: name,
    });
  };

  searchPage = () => {
    this.$f7router.navigate("/search/");
  }

  render() {
    const { isOpenStock, stockName } = this.state;

    return (
      <Page noNavbar name="news" onPageBeforeIn={() => this.onPageBeforeIn()}>
        <div className="page-wrapper">
          <div className="page-render p-0">
            <div className="home-page">
              <div className="home-page__header">
                <div
                  className="top"
                  style={{
                    background: `url(${bgHeaderTop}) center bottom/cover no-repeat white`,
                  }}
                >
                  <div className="top-content">
                    <div
                      className="location"
                      onClick={() => this.handleStock()}
                    >
                      <FaMapMarkerAlt />
                      <div className="location-name">
                        {stockName && stockName ? stockName : "Bạn đang ở ?"}
                      </div>
                      <div className="down">
                        <FaChevronDown />
                      </div>
                    </div>
                    <div className="menu">
                      <CartToolBar />
                      <NotificationIcon />
                      {this.userHTML()}
                    </div>
                  </div>
                </div>
                <div className="body">
                  <div className="body-search">
                    <button type="button">
                      <img src={IconSearch} />
                    </button>
                    <input
                      type="text"
                      placeholder="Bạn tìm gì hôm nay ?"
                      onFocus={this.searchPage}
                    ></input>
                  </div>
                  <SlideList />
                  <ListService />
                </div>
              </div>
              <ListImage />
              <div className="home-page__product">
                <div className="head">
                  <h5>Sản phẩm mới</h5>
                  <div className="all">
                    <Link href="/shop/794/">
                      Xem tất cả <i className="las la-angle-right"></i>
                    </Link>
                  </div>
                </div>
                <ProductList />
              </div>
              <div className="home-page__news">
                <div className="page-news__list">
                  <div className="page-news__list-head">
                    <h5>Tin tức mới</h5>
                    <div className="all">
                      <Link href="/news-list/">
                        Xem tất cả <i className="las la-angle-right"></i>
                      </Link>
                    </div>
                  </div>
                  <NewsList />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Toolbar tabbar position="bottom">
          <ToolBarBottom />
        </Toolbar>

        <Suspense fallback={<div>Loading...</div>}>
          <SelectStock
            isOpenStock={isOpenStock}
            nameStock={(name) => this.nameStock(name)}
          />
          <ModalReviews />
          <QuickAction />
        </Suspense>
      </Page>
    );
  }
}
