import React from "react";
import { Page, Link, Navbar, Toolbar, Tabs, Tab, Row, Col, Subnavbar } from "framework7-react";
import UserService from '../../service/user.service';
import { getUser } from "../../constants/user";
import { formatDateSv, checkDateDiff } from '../../constants/format';
import OutVoucher from "../../assets/images/outvoucher.svg";
import NotificationIcon from "../../components/NotificationIcon";
import moment from 'moment';
import 'moment/locale/vi';
moment.locale('vi');

export default class extends React.Component {
    constructor() {
        super();
        this.state = {
            voucherMe: [],
            VoucherAll: [],
            VoucherAff: []
        }
    }
    componentDidMount() {
        this.getVoucher();
    }
    getVoucher = () => {
        const infoUser = getUser();
        if (!infoUser) return false;
        const memberid = infoUser.ID;
        UserService.getVoucher(memberid)
            .then(response => {
                const voucher = response.data.data;
                this.setState({
                    voucherMe: voucher.me,
                    VoucherAll: voucher.all,
                    VoucherAff: voucher.aff
                })
            })
            .catch(e => console.log(e));
    }

    loadMore(done) {
        const self = this;
        setTimeout(() => {
            self.getVoucher();
            done();
        }, 1000);
    }

    render() {
        const { voucherMe, VoucherAll, VoucherAff } = this.state;
        return (
          <Page
            noToolbar
            name="voucher"
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
                  <span className="title">Mã giảm giá</span>
                </div>
                <div className="page-navbar__noti">
                  <NotificationIcon />
                </div>
              </div>
              <Subnavbar className="cardservice-tab-head">
                <div className="cardservice-title">
                  <Link noLinkClass tabLink="#tome" tabLinkActive>
                    Cho bạn
                  </Link>
                  <Link noLinkClass tabLink="#toall">
                    Áp dụng chung
                  </Link>
                  <Link noLinkClass tabLink="#toaffiliate">
                    Affiliate
                  </Link>
                </div>
              </Subnavbar>
            </Navbar>

            <div className="page-render p-0 page-voucher">
              <Tabs>
                <Tab id="tome" tabActive>
                  <div className="page-voucher__list">
                    {voucherMe && voucherMe.length > 0 ? (
                      voucherMe.map((item, index) => (
                        <div className="page-voucher__list-item" key={index}>
                          <div className="voucher-icon">
                            <div className="voucher-icon__text">
                              <div className="date">
                                <span>{formatDateSv(item.BeginDate)}</span>
                                <p>-</p>
                                <span>{formatDateSv(item.EndDate)}</span>
                              </div>
                            </div>
                            <div className="voucher-icon__line"></div>
                          </div>
                          <div className="voucher-text">
                            <div className="code">
                              <span>Mã</span>
                              <span>{item.Code}</span>
                            </div>
                            <ul>
                              <li>
                                <span>Ưu đãi</span>
                                <span>{item.Discount}%</span>
                              </li>
                              <li>
                                HSD : Còn {checkDateDiff(item.EndDate)} ngày{" "}
                              </li>
                            </ul>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="page-voucher__out">
                        <img src={OutVoucher} alt="Không có mã giảm giá" />
                        <div className="text">Bạn chưa có mã giảm giá nào.</div>
                      </div>
                    )}
                  </div>
                </Tab>
                <Tab id="toall">
                  <div className="page-voucher__list">
                    {VoucherAll && VoucherAll.length > 0 ? (
                      VoucherAll.map((item, index) => (
                        <div className="page-voucher__list-item" key={index}>
                          <div className="voucher-icon">
                            <div className="voucher-icon__text">
                              <div className="date">
                                <span>{formatDateSv(item.BeginDate)}</span>
                                <p>-</p>
                                <span>{formatDateSv(item.EndDate)}</span>
                              </div>
                            </div>
                            <div className="voucher-icon__line"></div>
                          </div>
                          <div className="voucher-text">
                            <div className="code">
                              <span>Mã</span>
                              <span>{item.Code}</span>
                            </div>
                            <ul>
                              <li>
                                <span>Ưu đãi</span>
                                <span>{item.Discount}%</span>
                              </li>
                              <li>
                                HSD : Còn {checkDateDiff(item.EndDate)} ngày{" "}
                              </li>
                            </ul>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="page-voucher__out">
                        <img src={OutVoucher} alt="Không có mã giảm giá" />
                        <div className="text">Bạn chưa có mã giảm giá nào.</div>
                      </div>
                    )}
                  </div>
                </Tab>
                <Tab id="toaffiliate">
                  <div className="page-voucher__list">
                    {VoucherAff && VoucherAff.length > 0 ? (
                      VoucherAff.map((item, index) => (
                        <div className="page-voucher__list-item" key={index}>
                          <div className="voucher-icon">
                            <div className="voucher-icon__text">
                              <div className="date">
                                <span>{formatDateSv(item.BeginDate)}</span>
                                <p>-</p>
                                <span>{formatDateSv(item.EndDate)}</span>
                              </div>
                            </div>
                            <div className="voucher-icon__line"></div>
                          </div>
                          <div className="voucher-text">
                            <div className="code">
                              <span>Mã</span>
                              <span>{item.Code}</span>
                            </div>
                            <ul>
                              <li>
                                <span>Ưu đãi</span>
                                <span>{item.Discount}%</span>
                              </li>
                              <li>
                                HSD : Còn {checkDateDiff(item.EndDate)} ngày{" "}
                              </li>
                            </ul>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="page-voucher__out">
                        <img src={OutVoucher} alt="Không có mã giảm giá" />
                        <div className="text">Bạn chưa có mã giảm giá nào.</div>
                      </div>
                    )}
                  </div>
                </Tab>
              </Tabs>
            </div>
          </Page>
        );
    }
}