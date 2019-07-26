import React from 'react';
import { majCities, UScities } from '../../utils';

import { connect } from 'react-redux';
import { getHotels, selectedHotels } from '../../store/reducers/hotel';
import DateRangePicker from 'react-daterange-picker';
import 'react-daterange-picker/dist/css/react-calendar.css';
import moment from 'moment';

class HotelSearch extends React.Component {
  constructor() {
    super();
    this.state = {
      Departing: '',
      Returning: '',
      DestinLoc: 'New York',
      value: moment.range(moment(), moment().add(7, 'days')),
      isOpen: false
    };
  }

  onToggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  handleChangeDepart = date => {
    this.setState({
      Departing: date
    });
  };

  onSelect = (value, states) => {
    this.setState({
      value,
      Departing: moment(value.start).format('YYYY-MM-DD'),
      Returning: moment(value.end).format('YYYY-MM-DD'),
      states,
      isOpen: !this.state.isOpen
    });
  };

  handleChangeReturn = date => {
    this.setState({
      Returning: date
    });
  };

  handleChange = evt => {
    this.setState({
      [evt.target.name]: evt.target.value
    });
  };

  async SearchHotels(evt) {
    evt.preventDefault();
    let { city } = this.state;
    var hotList = await this.props.searchHotels(UScities[city]);
    this.setState({});
  }

  renderSelectionValue = () => {
    return (
      <div className="date-select-hotel" onClick={this.onToggle}>
        <div
          style={{
            margin: '5%'
          }}
        >
          <small>Departing:</small>
          <label>
            <i className="fas fa-calendar-alt" />
            {this.state.value.start.format('MM/DD/YYYY')}
          </label>
        </div>
        <div
          style={{
            margin: '5%'
          }}
        >
          <small>Returning:</small>
          <label>
            <i className="fas fa-calendar-alt" />
            {this.state.value.end.format('MM/DD/YYYY')}
          </label>
        </div>
      </div>
    );
  };

  render() {
    const { DestinLoc, Departing, Returning } = this.state;
    return (
      <div className="flight-container">
        <div className="form-container">
          <form
            className="flight-hotel-form"
            style={{ margin: '0 -16pxs' }}
            onSubmit={this.SearchHotels}
          >
            <div className="select-container">
              <i className="fas fa-map-marker-alt" />
              <select
                name="DestinLoc"
                onChange={this.handleChange}
                value={this.state.DestinLoc}
                className="selectFlight"
              >
                <option value="" disabled selected>
                  Select a city
                </option>
                {majCities.map(cty => {
                  return (
                    <option key={cty} value={cty}>
                      {cty}
                    </option>
                  );
                })}
              </select>
            </div>

            <div style={{ width: '50%' }}>
              <div>{this.renderSelectionValue()}</div>
              {this.state.isOpen && (
                <DateRangePicker
                  value={this.state.value}
                  onSelect={this.onSelect}
                  singleDateRange={true}
                  minimumDate={moment()}
                />
              )}
            </div>

            <div>
              <p style={{ backgroundColor: 'white' }}>
                <i className="fas fa-search" />
                <button
                  className="w3-button w3-white"
                  type="submit"
                  onClick={this.SearchHotels}
                  disabled={!(Departing && Returning)}
                >
                  Find Hotels
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  hotels: state.hotel.allHotels
});

const mapDispatchToProps = dispatch => ({
  searchHotels: city => dispatch(getHotels(city))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HotelSearch);
