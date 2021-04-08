import React from "react";
import PropTypes from "prop-types";
import { Link } from "framework7-react";
import { getUser } from "../constants/user";

PrivateNav.propTypes = {
  // auth: PropTypes.object.isRequired
};

function PrivateNav({ roles, text, icon, className, href }) {
  const infoUser = getUser();
  const userRoles = infoUser.GroupTitles;
  const hasRole = roles.some((role) => userRoles.includes(role));
  if (hasRole) {
    return (
      <Link noLinkClass href={href} className={className}>
        <i className={icon}></i>
        <span>{text}</span>
      </Link>
    );
  } else {
    return null;
  }
}

export default PrivateNav;
