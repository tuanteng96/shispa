import React from "react";
import Skeleton from "react-loading-skeleton";

export default class ServiceSheetSkeleton extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <React.Fragment>
        {Array(2)
          .fill()
          .map((item, index) => (
            <div className="sheet-service-lst__item" key={index}>
              <h4>
                <Skeleton width={150} count={1} />
              </h4>
              <div className="item-sub">
                {Array(3)
                  .fill()
                  .map((subitem, index) => (
                    <div className="item-sub__box" key={index}>
                      <h5>
                        <Skeleton width={180} count={1} />
                      </h5>
                      <div className="price sale">
                        <span className="price-to">
                          <Skeleton width={40} />
                        </span>
                        <span className="price-sale">
                          <Skeleton width={40} />
                        </span>
                      </div>
                      <div className="icon-succes-animated">
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
      </React.Fragment>
    );
  }
}
