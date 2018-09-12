// @flow

import * as React from 'react';
import {
  StyleSheet,
  StretchedImage,
  BlackToAlpha as gradient,
  Touchable,
} from '@kiwicom/mobile-shared';
import { View } from 'react-native';
import { graphql, createFragmentContainer } from '@kiwicom/mobile-relay';
import {
  type NavigationType,
  withNavigation,
} from '@kiwicom/mobile-navigation';
import RNLocalSearch from '@kiwicom/mobile-local-search';
import idx from 'idx';

import FromToRow from './FromToRow';
import DateAndPassengerCount from './DateAndPassengerCount';
import ImageBadges from './ImageBadges';
import CityImage from '../../../components/CityImage';
import BookingDetailContext, {
  type BookingDetail,
} from '../../../context/BookingDetailContext';
import type { CityImage_arrival as ArrivalType } from './__generated__/CityImageContainer_arrival.graphql';
import type { CityImage_departure as DepartureType } from './__generated__/CityImageContainer_departure.graphql';
import type { CityImage_image as ImageType } from './__generated__/CityImageContainer_image.graphql';

type PropsWithContext = {|
  ...Props,
  +setBookingDetail: (booking: BookingDetail) => void,
|};

class CityImageContainer extends React.Component<PropsWithContext> {
  componentDidMount() {
    const region = {
      latitude: 50,
      longitude: 14,
      latitudeDelta: 0.3,
      longitudeDelta: 0.3,
    };
    RNLocalSearch.searchForLocations('Marpek Whisky', region, (err, res) => {
      console.log({ err, res });
    });
  }

  goToDetail = () => {
    const props = this.props;

    const id = idx(props.image, _ => _.id) || '';
    const bookingId = idx(props.image, _ => _.databaseId) || 0;
    const isPastBooking = Boolean(idx(props.image, _ => _.isPastBooking));
    const arrivalCityId = idx(props.arrival, _ => _.cityId) || '';
    const arrivalTime = idx(props.arrival, _ => _.time) || '';
    const departureTime = idx(props.departure, _ => _.time) || '';
    const authToken = idx(props.image, _ => _.authToken) || '';

    this.props.setBookingDetail({
      id,
      bookingId,
      isPastBooking,
      arrivalCityId,
      authToken,
      arrivalTime: new Date(arrivalTime),
      departureTime: new Date(departureTime),
    });

    this.props.navigation.navigate('DetailScreen');
  };

  render = () => (
    <Touchable onPress={this.goToDetail}>
      <View style={styles.container}>
        <CityImage
          style={styles.image}
          url={this.props.image.destinationImageUrl}
        />
        <StretchedImage source={gradient} style={styles.stretchedImage} />
        <View style={[styles.row, styles.padding]}>
          <ImageBadges data={this.props.image} />
        </View>
        <View style={[styles.bottomContainer, styles.padding]}>
          <FromToRow
            departure={this.props.departure}
            arrival={this.props.arrival}
            type={this.props.type}
          />
          <DateAndPassengerCount
            departure={this.props.departure}
            passengerCount={this.props.image.passengerCount}
          />
        </View>
      </View>
    </Touchable>
  );
}

type Props = {|
  +image: ImageType,
  +arrival: ArrivalType,
  +departure: DepartureType,
  +type: 'RETURN' | 'ONE_WAY' | 'MULTICITY',
  +navigation: NavigationType,
|};

const CityImageWithContext = (props: Props) => (
  <BookingDetailContext.Consumer>
    {({ actions: { setBookingDetail } }) => (
      <CityImageContainer {...props} setBookingDetail={setBookingDetail} />
    )}
  </BookingDetailContext.Consumer>
);

export default createFragmentContainer(
  withNavigation(CityImageWithContext),
  graphql`
    fragment CityImageContainer_image on BookingInterface {
      id
      databaseId
      passengerCount
      isPastBooking
      destinationImageUrl(dimensions: _375x165)
      authToken
      ...ImageBadges
    }

    fragment CityImageContainer_arrival on RouteStop {
      ...FromToRow_arrival
      cityId
      time
    }

    fragment CityImageContainer_departure on RouteStop {
      ...DateAndPassengerCount_departure
      ...FromToRow_departure
      time
    }
  `,
);

const styles = StyleSheet.create({
  container: {
    height: 152,
    width: '100%',
    justifyContent: 'space-between',
    borderRadius: 4,
    overflow: 'hidden',
  },
  padding: {
    padding: 10,
  },
  row: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  stretchedImage: {
    width: '100%',
    borderRadius: 4,
  },
  bottomContainer: {
    justifyContent: 'flex-end',
  },
  image: {
    borderRadius: 4,
  },
});
