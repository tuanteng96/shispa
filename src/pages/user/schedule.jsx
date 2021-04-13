import React from "react";
import { Page, Link, Navbar, Toolbar, Sheet, Row, Col } from "framework7-react";
import ScheduleSpa from "../../components/schedule/ScheduleSpa";
import ScheduleService from "../../components/schedule/ScheduleService";
import ScheduleSuccess from "../../components/schedule/ScheduleSuccess";
import BooksIcon from "../../components/BooksIcon";
import ServiceSheetSkeleton from "../../components/schedule/service/ServiceSheetSkeleton";
import { TiLocation, TiTime, TiCalendarOutline, TiHeart } from "react-icons/ti";
import { getUser } from "../../constants/user";
import { BiCheckDouble } from "react-icons/bi";
import BookDataService from "../../service/book.service";
import { toast } from "react-toastify";
import ToolBarBottom from "../../components/ToolBarBottom";
import { IoCloseOutline } from "react-icons/io5";
import moment from "moment";
import "moment/locale/vi";
import { checkSale, formatPriceVietnamese } from "../../constants/format";
import { SERVER_APP } from "../../constants/config";
moment.locale("vi");

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      steps: [
        {
          label: "Thời gian",
          component: (
            <ScheduleSpa handleTime={(item) => this.handleTime(item)} />
          ),
          exitValidation: false,
        },
        {
          label: "Dịch vụ",
          component: (
            <ScheduleService
              handleService={(item) => this.handleService(item)}
              handleDataService={(item, data, loading) =>
                this.handleDataService(item, data, loading)
              }
            />
          ),
        },
        {
          label: "Hoàn tất",
          component: <ScheduleSuccess />,
        },
      ],
      onFinish: false,
      activeStep: 0,
      selectedService: {
        ID: 0,
        subitemID: 0,
      },
      isLoadingStep1: false,
      isLoading: false,
      isLoadingSheet: true,
      sheetOpened: false,
      sheetServiceOpened: false,
    };
  }
  componentDidMount() {}

  handleDataService = (item, data, loading) => {
    this.setState({
      sheetServiceOpened: true,
      itemAdvisory: item,
    });
    if (loading) return false;
    this.setState({
      lstAdvisory: data,
      isLoadingSheet: false,
    });
  };

  closeSheetService = () => {
    this.setState({
      sheetServiceOpened: false,
      isLoadingSheet: true,
    });
  };

  handleStepChange = (active) => {
    const { activeStep } = this.state;
    if (activeStep < active) return false;
    if (activeStep === 2) return false;
    this.setState({
      activeStep: active,
    });
  };

  nextStep = () => {
    if (this.state.activeStep < this.state.steps.length - 1) {
      this.setState({ activeStep: this.state.activeStep + 1 });
    }
  };

  previousStep = () => {
    if (this.state.activeStep > 0) {
      this.setState({ activeStep: this.state.activeStep - 1 });
    }
  };

  handleTime = (item) => {
    this.setState({
      itemStepTime: item,
    });
  };

  handleService = (item) => {
    this.setState({
      itemBooks: item,
      selectedService: {
        ID: 0,
        subitemID: 0,
      },
    });
  };
  handleNote = (evt) => {
    const { value } = evt.target;
    this.setState({
      serviceNote: value,
    });
  };
  nextService = () => {
    this.setState({
      isLoadingStep1: true,
    });
    setTimeout(() => {
      this.setState({
        isLoadingStep1: false,
      });
      this.nextStep();
    }, 1000);
  };
  nextSuccessService = () => {
    this.setState({
      sheetOpened: true,
    });
  };

  submitBooks = () => {
    const { itemStepTime, serviceNote, itemBooks } = this.state;
    const infoUser = getUser();
    const self = this;
    if (!infoUser) {
      return false;
    }

    const date = itemStepTime.date + " " + itemStepTime.time;

    const itemBooksList = [];
    if (itemBooks[0].Prod) {
      itemBooks.map((item, index) => {
        const itemBook = {};
        itemBook.stock_id = itemStepTime && itemStepTime.stock;
        itemBook.service_id = item.Prod.ID;
        itemBook.desc = serviceNote ? serviceNote : "Không có ghi chú .";
        itemBook.date = date;
        itemBooksList.push(itemBook);
      });
    } else {
      itemBooks.map((item, index) => {
        const itemBook = {};
        itemBook.stock_id = itemStepTime && itemStepTime.stock;
        itemBook.service_id = item.ServiceID;
        itemBook.desc = serviceNote ? serviceNote : "Không có ghi chú .";
        itemBook.date = date;
        itemBooksList.push(itemBook);
      });
    }

    const data = {
      memberid: infoUser.ID,
      books: itemBooksList,
    };

    this.setState({
      isLoading: true,
    });

    BookDataService.postBook(data)
      .then((response) => {
        const rt = response.data.data;
        if (rt.errors) {
          toast.error(rt.errors[0], {
            position: toast.POSITION.TOP_LEFT,
            autoClose: 3000,
          });
          this.setState({
            isLoading: false,
            sheetOpened: false,
          });
        } else {
          setTimeout(() => {
            self.$f7.preloader.hide();
            toast.success("Đặt lịch thành công !", {
              position: toast.POSITION.TOP_LEFT,
              autoClose: 3000,
            });

            this.setState({
              isLoading: false,
              sheetOpened: false,
              itemBooks: null,
            });
            this.nextStep();
          }, 1000);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  closeSheet = () => {
    this.setState({
      sheetOpened: false,
    });
  };

  closeSerivePosition = () => {
    this.setState({
      itemBooks: null,
      selectedService: {
        ID: 0,
        subitemID: 0,
      },
    });
  };

  handleItemService = (item, subitem) => {
    const selectedData = {};
    selectedData.ID = item.ID;
    selectedData.subitemID = subitem.ID;

    subitem.ServiceNew = true;
    subitem.ServiceID = subitem.ID;
    subitem.Titles = subitem.Title;

    this.setState({
      selectedService: selectedData,
      itemBooks: [subitem],
    });
  };

  controlsStep = () => {
    const { itemStepTime, isLoadingStep1, itemBooks } = this.state;
    
    switch (this.state.activeStep) {
      case 0:
        return (
          <div className="schedule-toolbar">
            <button
              type="button"
              className={`btn-submit-order btn-submit-order ${
                (itemStepTime && !itemStepTime["time"]) ||
                (itemStepTime && isNaN(itemStepTime["stock"])) ||
                !itemStepTime
                  ? "btn-no-click"
                  : ""
              } ${!itemStepTime && "btn-no-click"} ${
                isLoadingStep1 && "loading"
              }`}
              onClick={() => this.nextService()}
            >
              <span>Chọn dịch vụ</span>
              <div className="loading-icon">
                <div className="loading-icon__item item-1"></div>
                <div className="loading-icon__item item-2"></div>
                <div className="loading-icon__item item-3"></div>
                <div className="loading-icon__item item-4"></div>
              </div>
            </button>
          </div>
        );
        break;
      case 1:
        return (
          <div className="schedule-toolbar">
            <button
              type="button"
              className={`btn-submit-order btn-submit-order 
              ${!itemBooks && "btn-no-click"}`}
              onClick={() => this.nextSuccessService()}
            >
              <span>Đặt lịch ngay</span>
              <div className="loading-icon">
                <div className="loading-icon__item item-1"></div>
                <div className="loading-icon__item item-2"></div>
                <div className="loading-icon__item item-3"></div>
                <div className="loading-icon__item item-4"></div>
              </div>
            </button>
          </div>
        );
      default:
        return <ToolBarBottom />;
        break;
    }
  };

  render() {
    const {
      activeStep,
      steps,
      isLoading,
      isLoadingSheet,
      sheetOpened,
      itemStepTime,
      itemBooks,
      sheetServiceOpened,
      itemAdvisory,
      lstAdvisory,
      selectedService,
    } = this.state;

    const stepIndicators =
      steps &&
      steps.map((step, i) => {
        return (
          <div
            key={i}
            className={`page-schedule__step-item ${
              activeStep === i && "active"
            }`}
            onClick={() => this.handleStepChange(i)}
          >
            <div className="number">{i + 1}</div>
            {i !== steps.length && (
              <div className="text">
                <span>{step.label}</span>
              </div>
            )}
          </div>
        );
      });
    return (
      <Page name="schedule">
        <Navbar>
          <div className="page-navbar">
            <div className="page-navbar__back">
              <Link onClick={() => this.$f7router.back()}>
                <i className="las la-angle-left"></i>
              </Link>
            </div>
            <div className="page-navbar__title">
              <span className="title">Đặt lịch</span>
            </div>
            <div className="page-navbar__noti">
              <BooksIcon />
            </div>
          </div>
        </Navbar>
        <div className="page-schedule">
          <div className="page-schedule__step">{stepIndicators}</div>
          {steps[activeStep].component}
        </div>
        <Sheet
          className="sheet-swipe-product sheet-swipe-service"
          style={{ height: "auto", "--f7-sheet-bg-color": "#fff" }}
          opened={sheetOpened}
          onSheetClosed={() => this.closeSheet()}
          swipeToClose
          swipeToStep
          backdrop
        >
          <div className="sheet-modal-swipe-step">
            <div className="sheet-modal-swipe__close"></div>
            <div className="sheet-swipe-product__content sheet-swipe-service__content">
              <div className="sheet-pay-head sheet-service-header">
                Xác nhận thông tin
              </div>
              <div className="sheet-pay-body sheet-service-body">
                <div className="sheet-service-body__content">
                  <div className="location">
                    <div className="icon">
                      <TiLocation /> Cơ sở
                      <span>{itemStepTime && itemStepTime.nameStock}</span>
                    </div>
                  </div>
                  <div className="time">
                    <Row>
                      <Col width="50">
                        <div className="time-box">
                          <div className="icon">
                            <TiCalendarOutline />
                            Ngày
                          </div>
                          <div className="text">
                            {itemStepTime && itemStepTime.date}
                          </div>
                        </div>
                      </Col>
                      <Col width="50">
                        <div className="time-box">
                          <div className="icon">
                            <TiTime />
                            Giờ
                          </div>
                          <div className="text">
                            {itemStepTime && itemStepTime.time}
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <div className="service">
                    <div className="icon">
                      <TiHeart />
                      Dịch vụ đã chọn
                    </div>
                    {itemBooks &&
                      itemBooks.map((item, index) => (
                        <div className="text" key={index}>
                          {item.Titles}
                          <BiCheckDouble />
                        </div>
                      ))}
                  </div>
                </div>
                <div className="sheet-service-body__note">
                  <textarea
                    onChange={this.handleNote}
                    placeholder="Cho chúng tôi biết lưu ý thêm của bạn"
                  ></textarea>
                </div>
                <div className="sheet-pay-body__btn">
                  <button
                    className={
                      "page-btn-order btn-submit-order " +
                      (isLoading ? "loading" : "")
                    }
                    onClick={() => this.submitBooks()}
                  >
                    <span>Đặt Lịch</span>
                    <div className="loading-icon">
                      <div className="loading-icon__item item-1"></div>
                      <div className="loading-icon__item item-2"></div>
                      <div className="loading-icon__item item-3"></div>
                      <div className="loading-icon__item item-4"></div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Sheet>

        <div
          className={`page-schedule--order ${
            itemBooks && itemBooks[0].ServiceNew > 0 ? "show" : ""
          }`}
        >
          <div className="item">
            <div className="image">
              <img
                src={`
                  ${SERVER_APP}/Upload/image/${
                  itemBooks && itemBooks[0].Thumbnail
                }
                `}
                alt={itemBooks && itemBooks[0].Title}
              />
            </div>
            <div className="text">
              <div className="text-title">
                {itemBooks && itemBooks[0].Title}
              </div>
              <div
                className={
                  "text-price " +
                  (checkSale(
                    itemBooks && itemBooks[0].SaleBegin,
                    itemBooks && itemBooks[0].SaleEnd
                  ) === true
                    ? "sale"
                    : "")
                }
              >
                <span className="price-to">
                  {formatPriceVietnamese(
                    itemBooks && itemBooks[0].PriceProduct
                  )}
                  <b>đ</b>
                </span>
                <span className="price-sale">
                  {formatPriceVietnamese(itemBooks && itemBooks[0].PriceSale)}
                  <b>đ</b>
                </span>
              </div>
            </div>
            <div className="close" onClick={() => this.closeSerivePosition()}>
              <IoCloseOutline />
            </div>
          </div>
        </div>

        <Sheet
          className="sheet-swipe-product sheet-swipe-service"
          style={{ height: "auto", "--f7-sheet-bg-color": "#fff" }}
          opened={sheetServiceOpened}
          onSheetClosed={() => this.closeSheetService()}
          swipeToClose
          swipeToStep
          backdrop
        >
          <div className="sheet-modal-swipe-step">
            <div className="sheet-modal-swipe__close"></div>
            <div className="sheet-swipe-product__content sheet-swipe-service__content">
              <div className="sheet-pay-head sheet-service-header">
                {itemAdvisory && itemAdvisory.Title}
                <div className="close" onClick={() => this.closeSheetService()}>
                  <IoCloseOutline />
                </div>
              </div>
              <div className="sheet-service-lst">
                {isLoadingSheet && <ServiceSheetSkeleton />}
                {!isLoadingSheet &&
                  lstAdvisory &&
                  lstAdvisory.map((item, index) => (
                    <div className="sheet-service-lst__item" key={index}>
                      <h4>
                        <div className="title">{item.Title}</div>
                        <div className="count">
                          ( <span>{item.lst && item.lst.length}</span> dịch vụ )
                        </div>
                      </h4>
                      <div className="item-sub">
                        {item.lst &&
                          item.lst.map((subitem, index) => (
                            <div
                              className="item-sub__box"
                              key={index}
                              onClick={() =>
                                this.handleItemService(item, subitem)
                              }
                            >
                              <h5>{subitem.Title}</h5>
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
                                  {formatPriceVietnamese(subitem.PriceProduct)}
                                  <b>đ</b>
                                </span>
                                <span className="price-sale">
                                  {formatPriceVietnamese(subitem.PriceSale)}
                                  <b>đ</b>
                                </span>
                              </div>
                              <div
                                className={`icon-succes-animated ${
                                  selectedService.ID === item.ID &&
                                  selectedService.subitemID === subitem.ID
                                    ? "active"
                                    : ""
                                }`}
                              >
                                <span className="icon-line line-tip"></span>
                                <span className="icon-line line-long"></span>
                                <div className="icon-circle"></div>
                                <div className="icon-fix"></div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                {!isLoadingSheet && lstAdvisory && lstAdvisory.length === 0 && (
                  <div className="text-empty">Không có dịch vụ</div>
                )}
              </div>
            </div>
          </div>
        </Sheet>

        <Toolbar tabbar position="bottom">
          {this.controlsStep()}
        </Toolbar>
      </Page>
    );
  }
}
