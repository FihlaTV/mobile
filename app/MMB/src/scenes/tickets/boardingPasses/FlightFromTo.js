// @flow strict

import * as React from 'react';
import { View } from 'react-native';
import { graphql, createFragmentContainer } from '@kiwicom/mobile-relay';
import { Translation, DateFormatter } from '@kiwicom/mobile-localization';
import { TextIcon, StyleSheet, Text } from '@kiwicom/mobile-shared';
import idx from 'idx';
import { defaultTokens } from '@kiwicom/mobile-orbit';

import BoardingPassRow from '../components/BoardingPassRow';
import TicketList from './mobileTicket/TicketList';
import DownloadButton from './DownloadButton';
import type { FlightFromTo as RouteStopType } from './__generated__/FlightFromTo.graphql';
import WalletContext, { type Segment } from '../../../context/WalletContext';

type PropsWithContext = {|
  ...Props,
  +addSegment: (segment: Segment) => void,
|};

export class FlightFromTo extends React.Component<PropsWithContext> {
  componentDidMount = () => {
    const id = idx(this.props.data, _ => _.id) || '';
    const airlineLogoUrl = idx(this.props.data, _ => _.airline.logoUrl) || '';
    const flightDate = idx(this.props.data, _ => _.departure.localTime) || null;
    this.props.addSegment({
      id,
      airlineLogoUrl, // TODO: This is not the correct logo. Fix when images have been added to images.kiwi.com
      flightDate,
    });
  };

  render = () => {
    const date = idx(this.props.data, _ => _.departure.localTime);
    const shortDate = date
      ? DateFormatter(new Date(date)).formatToShortDate()
      : '';
    const time = date ? DateFormatter(new Date(date)).formatToTime() : '';
    return (
      <BoardingPassRow
        leftColumn={
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>
              <Translation passThrough={shortDate} />
            </Text>
            <Text style={styles.dateText}>
              <Translation passThrough={time} />
            </Text>
          </View>
        }
        rightColumn={
          <View style={styles.rightColumn}>
            <View style={[styles.row, styles.cityContainer]}>
              <Text style={styles.cityText}>
                <Translation
                  passThrough={idx(
                    this.props.data,
                    _ => _.departure.airport.city.name,
                  )}
                />
              </Text>
              <TextIcon code="C" style={styles.icon} />
              <Text style={styles.cityText}>
                <Translation
                  passThrough={idx(
                    this.props.data,
                    _ => _.arrival.airport.city.name,
                  )}
                />
              </Text>
            </View>
            <View style={styles.buttonContainer}>
              <DownloadButton
                data={idx(this.props.data, _ => _.boardingPass)}
              />
            </View>

            <View style={styles.appleWalletContainer}>
              <TicketList
                segmentId={idx(this.props.data, _ => _.id)}
                data={idx(this.props.data, _ => _.boardingPass)}
              />
            </View>
          </View>
        }
      />
    );
  };
}

type Props = {|
  +data: RouteStopType,
|};

const FlightFromToWithContext = (props: Props) => (
  <WalletContext.Consumer>
    {({ actions: { addSegment } }) => (
      <FlightFromTo {...props} addSegment={addSegment} />
    )}
  </WalletContext.Consumer>
);

export default createFragmentContainer(
  FlightFromToWithContext,
  graphql`
    fragment FlightFromTo on Leg {
      id
      airline {
        logoUrl
      }
      departure {
        localTime
        airport {
          city {
            name
          }
        }
      }
      arrival {
        airport {
          city {
            name
          }
        }
      }
      boardingPass {
        ...DownloadButton
        ...TicketList
      }
    }
  `,
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  dateText: {
    fontSize: 12,
    fontWeight: '600',
    color: defaultTokens.colorTextSecondary,
  },
  dateContainer: {
    marginEnd: 10,
  },
  cityContainer: {
    alignSelf: 'flex-start',
  },
  icon: {
    color: defaultTokens.colorIconSecondary,
    fontSize: 18,
    marginHorizontal: 8,
  },
  cityText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonContainer: {
    marginTop: 15,
  },
  rightColumn: {
    marginEnd: 9,
    flex: 1,
  },
  appleWalletContainer: {
    marginTop: 20,
  },
});
