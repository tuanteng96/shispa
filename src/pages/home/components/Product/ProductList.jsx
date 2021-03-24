import React from "react";
import ShopDataService from "../../../../service/shop.service";
import { Col, Row } from "framework7-react";
import { getStockIDStorage } from "../../../../constants/user";
import ProductItem from "../Product/ProductItem";
import SkeletonProduct from "../../components/Product/SkeletonProduct";

export default class ProductList extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
    };
  }

  componentDidMount() {
    this.getDataList(794, "1", 6, "hot", "");
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

        this.setState({
          arrCateList: arrCateList,
          isLoading: false,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  render() {
    const { arrCateList, isLoading } = this.state;
    return (
      <div className="body">
        <Row>
          {!isLoading &&
            arrCateList &&
            arrCateList.map((item, index) => (
              <Col width="50" key={index}>
                <ProductItem item={item} source={item.source} />
              </Col>
            ))}
        </Row>
        {isLoading && <SkeletonProduct />}
      </div>
    );
  }
}
