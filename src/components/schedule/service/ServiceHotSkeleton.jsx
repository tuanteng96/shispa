import React from "react";
import Slider from "react-slick";
import { AiFillCheckCircle } from "react-icons/ai";
import Skeleton from "react-loading-skeleton";


export default class ServiceHotSkeleton extends React.Component {
  constructor() {
    super();
    this.state = {
      width: window.innerWidth,
    };
  }
  componentDidMount() {}
  handStyle = () => {
    const _width = this.state.width - 70;
    return Object.assign({
      width: _width,
    });
  };

  render() {
    const settingService = {
      className: "slider variable-width",
      dots: false,
      arrows: false,
      infinite: true,
      slidesToShow: 1,
      centerPadding: "20px",
      variableWidth: true,
    };
    return (
      <Slider {...settingService}>
        {Array(3)
          .fill()
          .map((item, index) => {
            return (
              <div className="item" key={index} style={this.handStyle()}>
                <Skeleton height={150} />
                <div className="icon">
                  <AiFillCheckCircle />
                </div>
              </div>
            );
          })}
      </Slider>
    );
  }
}
