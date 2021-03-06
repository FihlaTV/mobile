// @flow strict

import * as React from 'react';
import { graphql, createFragmentContainer } from '@kiwicom/mobile-relay';
import idx from 'idx';

import FlightServicesOneWay from './FlightServicesOneWay';
import FlightServicesReturn from './FlightServicesReturn';
import FlightServicesMulticity from './FlightServicesMulticity';
import type { FlightServices as BookingType } from './__generated__/FlightServices.graphql';

type Props = {|
  +onPress: () => void,
  +isActive: boolean,
  +data: BookingType,
|};

export const FlightServices = (props: Props) => {
  if (idx(props, _ => _.data.isPastBooking)) {
    return null;
  }
  const type = idx(props, _ => _.data.__typename);
  return (
    <React.Fragment>
      {type === 'BookingOneWay' && <FlightServicesOneWay {...props} />}
      {type === 'BookingReturn' && <FlightServicesReturn {...props} />}
      {type === 'BookingMulticity' && <FlightServicesMulticity {...props} />}
    </React.Fragment>
  );
};

export default createFragmentContainer(
  FlightServices,
  graphql`
    fragment FlightServices on BookingInterface {
      __typename
      isPastBooking
      ...FlightServicesOneWay
      ...FlightServicesReturn
      ...FlightServicesMulticity
    }
  `,
);
