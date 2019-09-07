import React, { createRef, PureComponent, Fragment } from 'react';
import { View, FlatList, ScrollView } from '@youi/react-native-youi';

import PropTypes from 'prop-types';

import { ACModal, ACTimeslotHeader, ACTimeslotRow } from './subcomponents';

import {
  ACTimeslotDefaultWidth,
  ACDefaultHeight,
} from '../../../../styles';

class ACTimeslots extends PureComponent {
  static propTypes = {
    timeslots: PropTypes.array.isRequired,
    channels: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      grid: {
        width: this.props.timeslots.length * ACTimeslotDefaultWidth,
      },
    };

    this.viewRef = createRef();
    this.listRef = createRef();

    this.timer = null;
  }

  scrollTo = (x, offset) => {
    this.viewRef.value.scrollTo({ animated: true, x });
    this.listRef.value.scrollToOffset({ animated: true, offset });
  }

  hideModal = () => {
    this.setState({ showModal: false });
  }

  showModal = (data) => {
    clearTimeout(this.timer);

    this.setState({ showModal: true, data });

    this.timer = setTimeout(this.hideModal, 5000);
  }

  renderTimeslotRow = (data) => {
    const { item, index } = data;

    return (
      <ACTimeslotRow contents={item.contents} grid={this.state.grid} row={index} onFocus={this.props.onFocus}/>
    );
  }

  renderModal = () => {
    if (!this.state.showModal) return null;

    return (
      <ACModal
        data={this.state.data}
        style={{
          backgroundColor: 'black',
          borderColor: '#4DB8FF',
          borderWidth: 3,
          position: 'absolute',
          top: ACDefaultHeight * 2,
          width: '100%',
        }} />
    );
  }

  render = () => {
    const { channels, timeslots } = this.props;
    
    return (
      <Fragment>
        <ScrollView
          horizontal
          ref={this.viewRef}
          scrollEnabled={false}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <ACTimeslotHeader timeslots={timeslots} />
            <FlatList
              ref={this.listRef}
              scrollEnabled={false}
              data={channels}
              keyExtractor={(data, index) => '' + index}
              renderItem={this.renderTimeslotRow}
              decelerationRate='fast'
              snapToAlignment='start'
              snapToInterval={ACDefaultHeight}
              windowSize={20}
            />
          </View>
        </ScrollView>
        {this.renderModal()}
      </Fragment>
    );
  }
};

export default ACTimeslots;
