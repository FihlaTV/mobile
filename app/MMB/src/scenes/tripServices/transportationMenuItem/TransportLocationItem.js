// @flow strict

import * as React from 'react';
import { graphql, createFragmentContainer } from '@kiwicom/mobile-relay';
import { Alert } from '@kiwicom/mobile-localization';
import idx from 'idx';

import LocationPopupButton from '../LocationPopupButton';
import type { LocationItem as LocationItemType } from './__generated__/TransportLocationItem.graphql';

type Props = {|
  +data: LocationItemType,
  +onPress: ({
    location: { lat: number, lng: number },
    whitelabelURL: string,
  }) => void,
  +whitelabelURL: string,
  +date?: ?string,
  +displayDate: boolean,
|};

class LocationItem extends React.Component<Props> {
  onPress = () => {
    const lat = idx(this.props.data, _ => _.location.lat);
    const lng = idx(this.props.data, _ => _.location.lng);
    if (lat != null && lng != null) {
      const whitelabelURL = this.props.whitelabelURL;
      const date = this.props.date;
      this.props.onPress({ location: { lat, lng }, whitelabelURL, date });
    } else {
      Alert.translatedAlert(null, { id: 'mmb.alert.something_went_wrong' });
    }
  };

  render = () => {
    const location = idx(this.props.data, _ => _.location);
    if (!location) {
      return null;
    }

    return (
      <LocationPopupButton
        whitelabelURL={this.props.whitelabelURL}
        data={this.props.data}
        onPress={this.onPress}
        displayIata={false}
        date={this.props.date}
        displayDate={this.props.displayDate}
      />
    );
  };
}

export default createFragmentContainer(
  LocationItem,
  graphql`
    fragment TransportLocationItem on Location {
      ...LocationPopupButton
      location {
        lat
        lng
      }
    }
  `,
);
