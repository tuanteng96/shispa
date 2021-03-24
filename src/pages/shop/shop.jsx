import React from "react";
import { Page, Link, Toolbar, Navbar } from "framework7-react";
import AdvDataService from "../../service/adv.service";
import NotificationIcon from "../../components/NotificationIcon";
import ToolBarBottom from "../../components/ToolBarBottom";
import SelectStock from "../../components/SelectStock";
import ProductItemCategory from "./components/Product/ProductItemCategory";
import SkeletonItemCategory from "./components/Product/SkeletonItemCategory";

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      arrCateAdv: [],
      isLoading: true,
      isOpenStock: false,
    };
  }

  componentDidMount() {
    this.getMenuShop();
  }

  getMenuShop = () => {
    AdvDataService.getMenuShop()
      .then((response) => {
        const arrCateAdv = response.data.data;
        this.setState({
          arrCateAdv: arrCateAdv,
          isLoading: false,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  openStock = () => {
    this.setState({
      isOpenStock: !this.state.isOpenStock,
    });
  };

  render() {
    const { arrCateAdv, isLoading } = this.state;
    return (
      <Page name="shop">
        <Navbar>
          <div className="page-navbar">
            <div className="page-navbar__back">
              <Link onClick={() => this.openStock()}>
                <i className="las la-map-marked-alt"></i>
              </Link>
            </div>
            <div className="page-navbar__title">
              <span className="title">Mua hàng</span>
            </div>
            <div className="page-navbar__noti">
              <NotificationIcon />
            </div>
          </div>
        </Navbar>
        <div className="page-render p-0">
          <div className="page-shop">
            <div className="page-shop__category">
              {!isLoading && (
                <ul>
                  {arrCateAdv &&
                    arrCateAdv.map((item, index) => (
                      <ProductItemCategory key={index} item={item} />
                    ))}
                </ul>
              )}
              {isLoading && <SkeletonItemCategory />}
            </div>
          </div>
        </div>
        <Toolbar tabbar position="bottom">
          <ToolBarBottom />
        </Toolbar>
        <SelectStock isOpenStock={this.state.isOpenStock} />
      </Page>
    );
  }
}
