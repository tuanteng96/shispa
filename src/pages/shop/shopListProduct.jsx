import React from "react";
import { SERVER_APP } from "./../../constants/config";
import { formatPriceVietnamese, checkSale } from "../../constants/format";
import _ from "lodash";
import {
  Page,
  Link,
  Toolbar,
  Navbar,
  Row,
  Col,
  Subnavbar,
  Searchbar,
} from "framework7-react";
import { getStockIDStorage } from "../../constants/user";
import ShopDataService from "./../../service/shop.service";
import ReactHtmlParser from "react-html-parser";
import ToolBarBottom from "../../components/ToolBarBottom";

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      dataNull: false,
      itemView: 8, // Số item hiển thị trên 1 Page
      arrCateList: [],
      countCateList: "",
      totalCateList: "",
      titlePage: "",
      showPreloader: false,
      allowInfinite: true,
      parentCateID: "",
      CateID: "",
      CateIDall: 662,
    };

    this.delayedCallback = _.debounce(this.inputCallback, 400);
  }

  getDataList = (ID, pi, ps, tag, keys) => {
    //ID Cate
    //Trang hiện tại
    //Số sản phẩm trên trang
    // Tag
    //keys Từ khóa tìm kiếm

    let stockid = getStockIDStorage();
    if (!stockid) {
      stockid = 0;
    }

    ShopDataService.getList(ID, pi, ps, tag, keys, stockid)
      .then((response) => {
        const arrCateList = response.data.data.lst;
        const countCateList = response.data.data.pcount;
        const totalCateList = response.data.data.total;
        const piCateList = response.data.data.pi;

        this.setState({
          arrCateList: arrCateList,
          countCateList: countCateList,
          totalCateList: totalCateList,
          piCateList: piCateList,
        });
        if (arrCateList.length === 0) {
          this.setState({
            showPreloader: false,
            dataNull: true,
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
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
      const parentCateID = this.$f7route.params.parentId;
      const CateID = this.$f7route.params.cateId;
      const itemView = this.state.itemView;

      this.setState({
        parentCateID: parentCateID,
        CateID: CateID,
      });

      if (CateID === "hot") {
        this.setState({
          titlePage: "Hôm nay Sale gì ?",
          isTag: "hot",
        });
        this.getDataList(CateID, "1", itemView, "hot", "");
      } else {
        this.getDataList(CateID, "1", itemView, "", "");
        this.getTitleCate();
      }
    });
  }
  loadMore = () => {
    const self = this;
    const isState = self.state;
    const CateID = isState.keySearch
      ? isState.CateIDall
      : this.$f7route.params.cateId;
    const itemView = isState.itemView; // Tổng số item trên 1 page

    const tag = isState.isTag && !isState.keySearch ? isState.isTag : "";
    const keys = isState.keySearch ? isState.keySearch : "";

    if (!self.state.allowInfinite) return;
    self.setState({
      allowInfinite: false,
      showPreloader: true,
    });
    setTimeout(() => {
      if (isState.totalCateList <= isState.arrCateList.length) {
        self.setState({ showPreloader: false });
        return;
      }

      ShopDataService.getList(
        CateID,
        isState.piCateList + 1,
        itemView,
        tag,
        keys
      )
        .then((response) => {
          const arrCateList = response.data.data.lst;

          var arrCateListNew = isState.arrCateList;
          for (let item in arrCateList) {
            arrCateListNew.push(arrCateList[item]);
          }

          self.setState({
            arrCateList: arrCateListNew,
            piCateList: isState.piCateList + 1,
            allowInfinite: true,
          });
        })
        .catch((e) => {
          console.log(e);
        });
    }, 1000);
  };

  loadRefresh(done) {
    setTimeout(() => {
      const CateID = this.$f7route.params.cateId;
      const itemView = this.state.itemView;

      if (CateID === "hot") {
        this.setState({
          titlePage: "Hôm nay Sale gì ?",
          isTag: "hot",
        });
        this.getDataList(CateID, "1", itemView, "hot", "");
      } else {
        this.getDataList(CateID, "1", itemView, "", "");
        this.getTitleCate();
      }
      this.setState({
        allowInfinite: true,
        showPreloader: true,
      });
      done();
    }, 1000);
  }
  inputCallback = (value) => {
    const key = value;
    const itemView = this.state.itemView;
    this.getDataList(662, "1", itemView, "", key);
  };
  handleInputSearch = (event) => {
    const key = event.target.value;
    event.persist();
    this.delayedCallback(key);
  };

  hideSearch = () => {
    const CateID = this.$f7route.params.cateId;
    const itemView = this.state.itemView;

    if (CateID === "hot") {
      this.getDataList(CateID, "1", itemView, "hot", "");
    } else {
      this.getDataList(CateID, "1", itemView, "", "");
    }
    this.setState({
      showPreloader: false,
      dataNull: false,
    });
  };

  render() {
    const arrCateList = this.state.arrCateList;
    return (
      <Page
        name="shop-List"
        infinite
        ptr
        infiniteDistance={50}
        infinitePreloader={this.state.showPreloader}
        onInfinite={() => this.loadMore()}
        onPtrRefresh={this.loadRefresh.bind(this)}
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
            placeholder="Bạn cần tìm ?"
            disableButtonText="Đóng"
            clearButton={true}
            onChange={this.handleInputSearch}
            onClickClear={() => this.hideSearch()}
            onClickDisable={() => this.hideSearch()}
          ></Searchbar>
        </Navbar>
        <div className="page-render no-bg">
          <div className="page-shop no-bg">
            <div className="page-shop__list">
              <Row>
                {arrCateList &&
                  arrCateList.map((item, index) => (
                    <Col width="50" key={index}>
                      <a
                        href={"/shop/detail/" + item.id}
                        className="page-shop__list-item"
                      >
                        <div className="page-shop__list-img">
                          <img
                            src={SERVER_APP + "/Upload/image/" + item.photo}
                            alt={item.title}
                          />
                        </div>
                        <div className="page-shop__list-text">
                          <h3>{item.title}</h3>
                          <div
                            className={
                              "page-shop__list-price " +
                              (checkSale(
                                item.source.SaleBegin,
                                item.source.SaleEnd
                              ) === true
                                ? "sale"
                                : "")
                            }
                          >
                            <span className="price">
                              <b>₫</b>
                              {formatPriceVietnamese(item.price)}
                            </span>
                            <span className="price-sale">
                              <b>₫</b>
                              {formatPriceVietnamese(item.pricesale)}
                            </span>
                          </div>
                        </div>
                      </a>
                    </Col>
                  ))}
              </Row>
            </div>
          </div>
        </div>
        <Toolbar tabbar position="bottom">
          <ToolBarBottom />
        </Toolbar>
      </Page>
    );
  }
}
