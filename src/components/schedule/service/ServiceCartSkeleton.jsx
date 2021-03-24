import React from "react";
import Skeleton from "react-loading-skeleton";

export default class ServiceCartSkeleton extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <div className="service-me__box">
        <div className="service-me__list">
          {Array(3)
            .fill()
            .map((item, index) => (
              <div className="item" key={index}>
                <div className="item-info">
                  <div className="title">
                    <Skeleton count={1} />
                  </div>
                  <div className="count">
                    Còn
                    <div className="count-number">
                      <Skeleton width={8} count={1} />
                    </div>
                    buổi
                  </div>
                  <div className="price">
                    <div className="price-number">
                      <Skeleton width={15} count={1} />
                    </div>
                    <div className="price-vnd">VNĐ</div>
                  </div>
                </div>
                <div className="item-image">
                  <Skeleton width={65} height={65} />
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }
}
