import React from "react";
import { Page, Link, Navbar, Toolbar, Tabs, Tab, Subnavbar } from "framework7-react";
import { getUser, getPassword } from "../../constants/user";
import UserService from "../../service/user.service";
import ToolBarBottom from "../../components/ToolBarBottom";
import ItemCardService from "../../components/ItemCardService";
import NotificationIcon from "../../components/NotificationIcon";
import SelectStock from '../../components/SelectStock';

export default class extends React.Component {
    constructor() {
        super();
        this.state = {
            isOpenStock: false,
            countSv: 0, // Số lương thẻ
            cardSv: [], // Thẻ dịch vụ
            insuranceSV: [], // Thẻ bảo hành
            excessiveSv: [], // Thẻ hết hạn
        };
    }

    componentDidMount() {
        const infoUser = getUser();
        const infoUsername = infoUser.MobilePhone;
        const infoMemberID = infoUser.ID;
        const infoPassword = getPassword();

        this.getTagService(infoUsername, infoPassword, infoMemberID);
    }
    getTagService = (username, password, memberid) => {
        UserService.getListTagService(username, password, memberid)
            .then(response => {
                const cardService = response.data;
                const countSv = cardService.length;
                const excessiveSv = [];
                const insuranceSV = [];
                const cardSv = [];
                cardService.map(item => {
                    if (item.IsEnd === true) {
                        excessiveSv.push(item);
                    }
                    else if (item.Services[0].IsWarrant === true) {
                        insuranceSV.push(item);
                    }
                    else {
                        cardSv.push(item);
                    }
                });
                this.setState({
                    countSv: countSv,
                    cardSv: cardSv,
                    insuranceSV: insuranceSV,
                    excessiveSv: excessiveSv
                });
            })
            .catch(e => console.log(e));
    }

    openStock = () => {
        this.setState({
            isOpenStock : !this.state.isOpenStock
        });
    }

    render() {
        const {isOpenStock, countSv } = this.state;
        const cardSv = this.state.cardSv && this.state.cardSv;
        const insuranceSV = this.state.insuranceSV && this.state.insuranceSV;
        const excessiveSv = this.state.excessiveSv && this.state.excessiveSv;
        return (
          <Page name="tagservice">
            <Navbar>
              <div className="page-navbar">
                <div className="page-navbar__back">
                  <Link onClick={() => this.openStock()}>
                    <i className="las la-map-marked-alt"></i>
                  </Link>
                </div>
                <div className="page-navbar__title">
                  <span className="title">Thẻ dịch vụ ({countSv})</span>
                </div>
                <div className="page-navbar__noti">
                  <NotificationIcon />
                </div>
              </div>
              <Subnavbar className="cardservice-tab-head">
                <div className="cardservice-title">
                  <Link noLinkClass tabLink="#cardSv" tabLinkActive>
                    Thẻ dịch vụ
                  </Link>
                  <Link noLinkClass tabLink="#insuranceSV">
                    Thẻ bảo hành
                  </Link>
                  <Link noLinkClass tabLink="#excessiveSv">
                    Hết hạn
                  </Link>
                </div>
              </Subnavbar>
            </Navbar>
            <div className="page-render p-0">
              <Tabs>
                <Tab id="cardSv" tabActive>
                  <div className="cardservice-item">
                    {cardSv.map((item, index) => (
                      <ItemCardService key={index} item={item} />
                    ))}
                  </div>
                </Tab>
                <Tab id="insuranceSV">
                  <div className="cardservice-item">
                    {insuranceSV.map((item, index) => (
                      <ItemCardService key={index} item={item} />
                    ))}
                  </div>
                </Tab>
                <Tab id="excessiveSv">
                  <div className="cardservice-item">
                    {excessiveSv.map((item, index) => (
                      <ItemCardService key={index} item={item} />
                    ))}
                  </div>
                </Tab>
              </Tabs>
            </div>
            <Toolbar tabbar position="bottom">
              <ToolBarBottom />
            </Toolbar>
            <SelectStock isOpenStock={isOpenStock} />
          </Page>
        );
    }
}