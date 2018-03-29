import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Pagination from "components/pagination.jsx";
import Ad from "components/admin/ad.jsx";
import {
  throttledDispatch,
  getAds,
  changePoliticalProbability,
  throttledDispatchAny
} from "actions.js";
import { deserialize } from "utils.js";
import Range from "rc-slider/lib/Range";

export class AdsUnconnected extends React.Component {
  componentDidMount() {
    this.props.deserialize(); // gets params from the URL, dispatches actions.
  }

  render() {
    return (
      <div id="ads">
        <input
          id="search"
          placeholder="Search for ads"
          onKeyUp={this.props.onKeyUp}
          search={this.props.search}
        />
        <div className="rangeslider">
          <label htmlFor="range-1a">Political Probability:</label>
          <Range
            defaultValue={[70, 100]}
            onChange={this.props.onSliderChange}
          />
        </div>

        {this.props.pagination ? <Pagination /> : ""}
        {this.props.ads
          .filter(ad => !ad.suppressed)
          .map(ad => (
            <Ad
              ad={ad}
              key={ad.id}
              onSuppressClick={this.props.onSuppressClick}
            />
          ))}
      </div>
    );
  }
}

export const AdsUnrouted = connect(
  ({ ads, search, page, pagination }) => ({
    ads,
    search,
    pagination,
    page
  }),
  dispatch => ({
    deserialize: () => {
      deserialize(dispatch);
      dispatch(getAds());
    },
    onKeyUp: e => {
      e.preventDefault();
      throttledDispatch(
        dispatch,
        e.target.value.length ? e.target.value : null
      );
    },
    onSliderChange: vals => {
      console.log(vals);
      throttledDispatchAny(dispatch, vals, changePoliticalProbability);
    }
  })
)(AdsUnconnected);
const Ads = withRouter(AdsUnrouted);
export default Ads;
