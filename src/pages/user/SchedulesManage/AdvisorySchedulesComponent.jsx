import React from "react";
import SkeletonCardScheduling from "./SkeletonCardScheduling";
import {
  groupbyDDHHMM2,
  getTimeToCreate,
  getDateToCreate,
} from "../../../constants/format";
import { SERVER_APP } from "../../../constants/config";
import BookDataService from "../../../service/book.service";
import { getUser } from "../../../constants/user";
import moment from "moment";
import "moment/locale/vi";
import { Col, Row } from "framework7-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PageNoData from "../../../components/PageNoData";
moment.locale("vi");


export default class AdvisorySchedulesComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
    };
  }

  componentDidMount() {
    this.getListBooks();
  }

  getListBooks = () => {
    const userInfo = getUser();
    if (!userInfo) return false;
    BookDataService.getCardService(userInfo.ID)
      .then((response) => {
        const data = response.data.data;
        this.setState({
          dataBooks: groupbyDDHHMM2(data.dat_lich_the),
          isLoading: false,
        });
      })
      .catch((er) => console.log(er));
  };

  handleDelete = (item) => {
    const id = item.items[0].ID;
    const _this = this;

    _this.$f7.dialog.confirm("Bạn chắc chắn mình muốn hủy lịch ?", () => {
      _this.$f7.preloader.show();
      BookDataService.bookDelete(id)
        .then((response) => {
          if (response.data.success) {
            _this.$f7.preloader.hide();
            toast.success("Hủy lịch thành công !", {
              position: toast.POSITION.TOP_LEFT,
              autoClose: 3000,
            });
            this.getListBooks();
          }
        })
        .catch((er) => console.log(er));
    });
  };

  converDate = (date) => {
    const dateNew = date.split("/");
    return dateNew[1] + "/" + dateNew[0] + "/" + dateNew[2];
  };
  render() {
    const { dataBooks, isLoading } = this.state;
    return (
      <div className="chedule-manage__lst">
        {isLoading && <SkeletonCardScheduling />}
        {!isLoading &&
          dataBooks &&
          dataBooks.map((item, index) => (
            <div className="item" key={index}>
              <div className="item-date">
                Ngày {moment(this.converDate(item.day)).format("LL")}
              </div>
              <div className="item-lst">
                {item.items &&
                  item.items.map((subitem, subIndex) => (
                    <div className="item-lst__box" key={subIndex}>
                      <div className="time-book">
                        Đặt lúc
                        <div className="time">
                          {getTimeToCreate(subitem.createDate)}
                        </div>
                      </div>
                      <div className="time-wrap">
                        <div className="service-book">
                          <div className="service-book__info">
                            <div className="title">
                              {subitem.service && subitem.service.Title}
                            </div>
                          </div>
                          <div className="service-book__img">
                            <img
                              src={`${SERVER_APP}${
                                subitem.service && subitem.service.Thumbnail_web
                              }`}
                              alt={subitem.service && subitem.service.Title}
                            />
                          </div>
                        </div>
                        <div className="service-time">
                          <Row>
                            <Col width="50">
                              <div className="service-time__item">
                                <div>Ngày đặt lịch</div>
                                <div>{getDateToCreate(subitem.date)}</div>
                              </div>
                            </Col>
                            <Col width="50">
                              <div className="service-time__item">
                                <div>Thời gian</div>
                                <div>{getTimeToCreate(subitem.date)}</div>
                              </div>
                            </Col>
                          </Row>
                        </div>
                        <div className="stock">
                          Đặt lịch tại {subitem.stock.Title}
                          <button
                            onClick={() => this.handleDelete(item)}
                            className="btn-close"
                          >
                            Hủy Lịch
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        {dataBooks && dataBooks.length === 0 ? (
          <PageNoData text="Bạn chưa lịch tư vấn" />
        ) : (
          ""
        )}
      </div>
    );
  }
}
