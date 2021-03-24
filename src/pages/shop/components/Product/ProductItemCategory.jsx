import { Link } from "framework7-react";
import React from "react";
import { SERVER_APP } from "../../../../constants/config";
import ReactHtmlParser from "react-html-parser";

export default class ProductItemCategory extends React.Component {
  constructor() {
    super();
    this.state = {
      
    };
    }
    render() {
        const { item } = this.props;
        return (
          <li key={item.ID}>
            <Link href={"/shop/" + item.Link}>
              <div className="image">
                <img
                  src={SERVER_APP + "/Upload/image/" + item.FileName}
                  alt={item.Title}
                />
              </div>
              <div className="text">
                <h3>{item.Title}</h3>
                <div className="text-desc">{ReactHtmlParser(item.Desc)}</div>
              </div>
            </Link>
          </li>
        );
    }
}