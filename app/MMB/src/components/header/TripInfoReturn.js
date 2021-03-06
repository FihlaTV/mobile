// @flow

import * as React from 'react';
import { View } from 'react-native';
import { graphql, createFragmentContainer } from '@kiwicom/mobile-relay';
import { Translation } from '@kiwicom/mobile-localization';
import { Text, StyleSheet } from '@kiwicom/mobile-shared';
import idx from 'idx';
import { defaultTokens } from '@kiwicom/mobile-orbit';

import ColorStrip from './ColorStrip';
import TripCities from './TripCities';
import TripTimes from './TripTimes';
import type { TripInfoReturn as TripInfoReturnType } from './__generated__/TripInfoReturn.graphql';

type Props = {|
  +data: TripInfoReturnType,
|};

function TripInfoReturn(props: Props) {
  const data = idx(props, _ => _.data);
  const outbound = idx(data, _ => _.outbound);
  const inbound = idx(data, _ => _.inbound);

  return (
    <View style={styleSheet.row}>
      <ColorStrip />
      <View style={styleSheet.content}>
        <TripCities data={outbound} type="RETURN" />

        <Text style={styleSheet.title}>
          <Translation id="mmb.trip_info.return.departure" />
        </Text>
        <TripTimes data={outbound} />

        <Text style={styleSheet.title}>
          <Translation id="mmb.trip_info.return.return" />
        </Text>
        <TripTimes data={inbound} />
      </View>
    </View>
  );
}

export default createFragmentContainer(
  TripInfoReturn,
  graphql`
    fragment TripInfoReturn on BookingReturn {
      outbound {
        ...TripCities
        ...TripTimes
      }
      inbound {
        ...TripTimes
      }
    }
  `,
);

const styleSheet = StyleSheet.create({
  title: {
    color: defaultTokens.colorTextSecondary,
    marginTop: 11,
    marginBottom: 2,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 10,
  },
});
