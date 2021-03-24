import React from "react";
import bgImage from '../../assets/images/headerbottombgapp.png';
import imgWallet from '../../assets/images/wallet.svg';
import imgLocation from '../../assets/images/location.svg';
import imgOrder from '../../assets/images/order.svg';
import imgDiary from '../../assets/images/diary.svg';
import imgCoupon from '../../assets/images/coupon.svg';
import imgEvaluate from '../../assets/images/evaluate.svg'
import { checkAvt } from "../../constants/format";
import { getUser, getPassword, app_request } from "../../constants/user";
import { Page, Link, Toolbar, Row, Col } from "framework7-react";
import ToolBarBottom from "../../components/ToolBarBottom";
import UserService from "../../service/user.service";
import Skeleton from 'react-loading-skeleton';

export default class extends React.Component {
    constructor() {
        super();
        this.state = {
            memberInfo: []
        };
    }
    componentDidMount() {
        const infoUser = getUser();
        if (!infoUser) return false;
        const username = infoUser.MobilePhone;
        const password = getPassword();
        UserService.getInfo(username, password)
            .then(response => {
                const memberInfo = response.data.info;
                this.setState({
                    memberInfo: memberInfo
                })
            })
            .catch(err => console.log(err))

    }
    signOut = () => {
        const $$this = this;
        $$this.$f7.dialog.confirm('Bạn muống đăng xuất khỏi tài khoản ?', () => {
            localStorage.clear();
            app_request("unsubscribe", "");
            $$this.$f7router.navigate("/");
        });
    }
    render() {
        const member = this.state.memberInfo && this.state.memberInfo;
        return (
            <Page name="profile" noNavbar>
                <div className="profile-bg">
                    <div className="page-login__back">
                        <Link onClick={() => this.$f7router.back()}>
                            <i className="las la-arrow-left"></i>
                        </Link>
                    </div>
                    <div className="name">
                        {member.FullName}
                    </div>
                    <div className="profile-bg__logout">
                        <Link onClick={() => this.signOut()}>
                            <i className="las la-sign-out-alt"></i>
                        </Link>
                    </div>
                    <img src={bgImage} />
                </div>
                <div className="profile-info">
                    <div className="profile-info__avatar">
                        {
                            member.length === 0 || member === undefined ? (
                                <Skeleton circle={true} height={90} width={90} />
                            ) : (
                                    <img src={checkAvt(member.Photo)} />
                                )}

                        <Link noLinkClass href="/detail-profile/"><i className="las la-pen"></i></Link>
                    </div>
                    {
                        member.length === 0 || member === undefined ? (
                            <div className="profile-info__basic">
                                <div className="name"><Skeleton width={100} count={1} /></div>
                                <div className="group"><Skeleton width={120} count={1} /></div>
                            </div>
                        ) : (
                                <div className="profile-info__basic">
                                    <div className="name">{member.FullName}</div>
                                    <div className="group">{member.acc_group > 0 ? (member.MemberGroups[0].Title) : "Thành viên"}</div>
                                </div>
                            )}

                    <div className="profile-info__shortcuts">
                        <div className="profile-info__shortcut">
                            <Row>
                                <Col width="50">
                                    <div className="profile-info__shortcut-item">
                                        <Link noLinkClass href="/detail-profile/">Thông tin cá nhân</Link>
                                    </div>
                                </Col>
                                <Col width="50">
                                    <div className="profile-info__shortcut-item">
                                        <Link noLinkClass href="/barcode/">Check In</Link>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
                <div className="profile-function">
                    <Row>
                        <Col width="33">
                            <Link noLinkClass href="/wallet/">
                                <div className="image">
                                    <img src={imgWallet} />
                                </div>
                                <span>Ví điện tử</span>
                            </Link>
                        </Col>
                        <Col width="33">
                            <Link noLinkClass href="/diary/">
                                <div className="image">
                                    <img src={imgDiary} />
                                </div>
                                <span>Nhật ký</span>
                            </Link>
                        </Col>
                        <Col width="33">
                            <Link noLinkClass href="/order/">
                                <div className="image">
                                    <img src={imgOrder} />
                                </div>
                                <span>Đơn hàng</span>
                            </Link>
                        </Col>
                        <Col width="33">
                            <Link noLinkClass href="/voucher/">
                                <div className="image">
                                    <img src={imgCoupon} />
                                </div>
                                <span>Mã giảm giá</span>
                            </Link>
                        </Col>
                        <Col width="33">
                            <Link noLinkClass href="/rating/">
                                <div className="image">
                                    <img src={imgEvaluate} />
                                </div>
                                <span>Đánh giá</span>
                            </Link>
                        </Col>
                        <Col width="33">
                            <Link noLinkClass href="/maps/">
                                <div className="image">
                                    <img src={imgLocation} />
                                </div>
                                <span>Liên hệ</span>
                            </Link>
                        </Col>
                    </Row>
                </div>
                <Toolbar tabbar position="bottom">
                    <ToolBarBottom />
                </Toolbar>
            </Page>
        )
    }
}