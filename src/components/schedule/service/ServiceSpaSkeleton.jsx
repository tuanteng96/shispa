import React from "react";
import Skeleton from "react-loading-skeleton";

export default class ServiceSpaSkeleton extends React.Component {
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
                    <Skeleton duration={1} />
                  </div>
                  <div className="desc">{<Skeleton duration={2} />}</div>
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
