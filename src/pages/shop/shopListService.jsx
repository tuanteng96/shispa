import React from "react";
import { SERVER_APP } from "./../../constants/config";
import { formatPriceVietnamese, checkSale } from "../../constants/format";
import { getStockIDStorage } from "../../constants/user";
import { Page, Link, Toolbar, Navbar, Sheet, PageContent, Button, Searchbar } from "framework7-react";
import ShopDataService from "./../../service/shop.service";
import ReactHtmlParser from "react-html-parser";
import ToolBarBottom from "../../components/ToolBarBottom";
import _ from 'lodash';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sheetOpened: false,
            titlePage: "",
            arrService: [],
            arrSearch: [],
            isSearch: false
        };

        this.delayedCallback = _.debounce(this.inputCallback, 400);
    }
    getService = () => {
        const CateID = this.$f7route.params.cateId;
        const stockid = getStockIDStorage();
        stockid ? stockid : 0;
        ShopDataService.getServiceParentID(CateID, stockid)
          .then((response) => {
            var arrServiceParent = response.data.data;
            const promises = arrServiceParent.map((item) =>
              ShopDataService.getServiceProdID(item.ID).then((response) => {
                const arrServiceProd = response.data.data;
                item.lst = arrServiceProd;
              })
            );
            // wait for all requests to resolve
            Promise.all(promises).then(() => {
              this.setState({ arrService: arrServiceParent });
            });
          })
          .catch((e) => console.log(e));
    }

    getTitleCate = () => {
        const CateID = this.$f7route.params.cateId;
        ShopDataService.getTitleCate(CateID)
            .then((response) => {
                const titlePage = response.data.data[0].Title;
                this.setState({
                    titlePage: titlePage,
                });
            })
            .catch((e) => {
                console.log(e);
            });
    };

    componentDidMount() {
        this.$f7ready((f7) => {
            this.getTitleCate();
            this.getService();
        });
    }
    inputCallback = (value) => {
        const key = value;
        ShopDataService.getSearchService(key)
            .then((response) => {
                const arrSearch = response.data.data.lst;
                this.setState({
                    arrSearch: arrSearch,
                    isSearch: true
                })
            })
            .catch((e) => console.log(e))
    }
    handleInputSearch = (event) => {
        const key = event.target.value;
        event.persist()
        this.delayedCallback(key);
    }
    hideSearch = () => {
        this.setState({
            arrSearch: [],
            isSearch: false
        })
    }
    loadMore(done) {
        const self = this;
        setTimeout(() => {
            self.getService();
            done();
        }, 1000);
    }

    render() {
        const { arrService, arrSearch, isSearch } = this.state;
        return (
          <Page
            name="shop-List"
            onPageBeforeOut={this.onPageBeforeOut.bind(this)}
            onPageBeforeRemove={this.onPageBeforeRemove.bind(this)}
            ptr
            onPtrRefresh={this.loadMore.bind(this)}
          >
            <Navbar>
              <div className="page-navbar">
                <div className="page-navbar__back">
                  <Link onClick={() => this.$f7router.back()}>
                    <i className="las la-angle-left"></i>
                  </Link>
                </div>
                <div className="page-navbar__title">
                  <span className="title">{this.state.titlePage}</span>
                </div>
                <div className="page-navbar__noti">
                  <Link searchbarEnable=".searchbar-product">
                    <i className="las la-search"></i>
                  </Link>
                </div>
              </div>
              <Searchbar
                className="searchbar-product"
                expandable
                customSearch={true}
                disableButton={!this.$theme.aurora}
                placeholder="Dịch vụ cần tìm ?"
                disableButtonText="Đóng"
                clearButton={true}
                onChange={this.handleInputSearch}
                onClickClear={() => this.hideSearch()}
                onClickDisable={() => this.hideSearch()}
              ></Searchbar>
            </Navbar>
            <div className="page-render">
              <div className="page-shop">
                <div className="page-shop__service">
                  {isSearch === false ? (
                    <div className="page-shop__service-list">
                      {arrService &&
                        arrService.map((item) => (
                          <div
                            className="page-shop__service-item"
                            key={item.ID}
                          >
                            <div className="page-shop__service-item service-about">
                              <div className="service-about__img">
                                <img
                                  src={
                                    SERVER_APP +
                                    "/Upload/image/" +
                                    item.Thumbnail
                                  }
                                  alt={item.Title}
                                />
                              </div>
                              {item.Desc !== "" ? (
                                <div className="service-about__content">
                                  <div className="service-about__content-text">
                                    {ReactHtmlParser(item.Desc)}
                                  </div>
                                  <Button
                                    fill
                                    sheetOpen=".demo-sheet"
                                    className="show-more"
                                  >
                                    Xem tất cả{" "}
                                    <i className="las la-angle-right"></i>
                                  </Button>
                                  <Sheet
                                    className="demo-sheet"
                                    style={{
                                      height: "auto",
                                      "--f7-sheet-bg-color": "#fff",
                                    }}
                                    swipeToClose
                                    backdrop
                                  >
                                    <PageContent>
                                      <div className="page-shop__service-detail">
                                        <h4>{item.Title}</h4>
                                        <div className="content">
                                          {ReactHtmlParser(item.Desc)}
                                        </div>
                                      </div>
                                    </PageContent>
                                  </Sheet>
                                </div>
                              ) : (
                                ""
                              )}
                              <div className="service-about__list">
                                <ul>
                                  {item.lst.map((subitem) => (
                                    <li key={subitem.ID}>
                                      <Link href={"/shop/detail/" + subitem.ID}>
                                        <div className="title">
                                          {subitem.Title}
                                        </div>
                                        <div
                                          className={
                                            "price " +
                                            (checkSale(
                                              subitem.SaleBegin,
                                              subitem.SaleEnd
                                            ) === true
                                              ? "sale"
                                              : "")
                                          }
                                        >
                                          <span className="price-to">
                                            {formatPriceVietnamese(
                                              subitem.PriceProduct
                                            )}
                                            <b>đ</b>
                                          </span>
                                          <span className="price-sale">
                                            {formatPriceVietnamese(
                                              subitem.PriceSale
                                            )}
                                            <b>đ</b>
                                          </span>
                                        </div>
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="page-shop__service-list">
                      <div className="page-shop__service-item">
                        <div className="page-shop__service-item service-about">
                          <div className="service-about__list">
                            <ul>
                              {arrSearch &&
                                arrSearch.map((item) => (
                                  <li key={item.id}>
                                    <Link href={"/shop/detail/" + item.id}>
                                      <div className="title">{item.title}</div>
                                      <div
                                        className={
                                          "price " +
                                          (checkSale(
                                            item.source.SaleBegin,
                                            item.source.SaleEnd
                                          ) === true
                                            ? "sale"
                                            : "")
                                        }
                                      >
                                        <span className="price-to">
                                          {formatPriceVietnamese(
                                            item.source.PriceProduct
                                          )}
                                          <b>đ</b>
                                        </span>
                                        <span className="price-sale">
                                          {formatPriceVietnamese(
                                            item.source.PriceSale
                                          )}
                                          <b>đ</b>
                                        </span>
                                      </div>
                                    </Link>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Toolbar tabbar position="bottom">
              <ToolBarBottom />
            </Toolbar>
          </Page>
        );
    }

    onPageBeforeOut() {
        const self = this;
        // Close opened sheets on page out
        self.$f7.sheet.close();
    }
    onPageBeforeRemove() {
        const self = this;
        // Destroy sheet modal when page removed
        if (self.sheet) self.sheet.destroy();
    }
}