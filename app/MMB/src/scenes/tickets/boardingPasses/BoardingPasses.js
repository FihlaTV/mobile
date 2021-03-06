// @flow strict

import * as React from 'react';
import { View } from 'react-native';
import { Translation } from '@kiwicom/mobile-localization';
import { SimpleCard, StyleSheet, TextIcon } from '@kiwicom/mobile-shared';
import { createFragmentContainer, graphql } from '@kiwicom/mobile-relay';

import TicketHeader from '../components/TicketHeader';
import type { BoardingPasses as BoardingPassesType } from './__generated__/BoardingPasses.graphql';
import BoardingPassReturn from './BoardingPassReturn';
import BoardingPassOneWay from './BoardingPassOneWay';
import BoardingPassMultiCity from './BoardingPassMultiCity';

type Props = {|
  +data: BoardingPassesType,
|};

const BoardingPasses = (props: Props) => (
  <SimpleCard>
    <View style={styles.header}>
      <TicketHeader
        icon={<TextIcon code="6" />}
        title={<Translation id="mmb.boarding_passes.boarding_pass" />}
      />
    </View>
    {props.data.__typename === 'BookingReturn' && (
      <BoardingPassReturn data={props.data} />
    )}
    {props.data.__typename === 'BookingOneWay' && (
      <BoardingPassOneWay data={props.data} />
    )}
    {props.data.__typename === 'BookingMulticity' && (
      <BoardingPassMultiCity data={props.data} />
    )}
  </SimpleCard>
);

const styles = StyleSheet.create({
  header: {
    marginBottom: 28,
    paddingTop: 4,
  },
});

export default createFragmentContainer(
  BoardingPasses,
  graphql`
    fragment BoardingPasses on Node {
      __typename
      ... on BookingReturn {
        ...BoardingPassReturn
      }
      ... on BookingOneWay {
        ...BoardingPassOneWay
      }
      ... on BookingMulticity {
        ...BoardingPassMultiCity
      }
    }
  `,
);
