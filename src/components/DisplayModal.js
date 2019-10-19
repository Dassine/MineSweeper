import React, { useEffect, useRef } from 'react';
import { StyleSheet, Modal, View, Text, Button, Animated } from 'react-native';

import Constants from '../rsc/utils/Constants';
import Colors from '../rsc/utils/Colors';

const Box = ({ scale = 1, data, onClose }) => {
  const { text, buttonText, box } = styles;
  return (
    <Animated.View style={[box, { transform: [{ scale }] }]}>
      <Text style={text}>{data}</Text>
      <Button
        title="Retry"
        color="black"
        onPress={onClose}
        titleStyle={buttonText}
      />
    </Animated.View>
  );
};

const usePulse = (startDelay = Constants.PULSE_DELAY) => {
  const scale = useRef(new Animated.Value(1)).current;

  const pulse = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.4,
      }),
      Animated.timing(scale, {
        toValue: 1,
      }),
    ]).start(() => pulse());
  };

  useEffect(() => {
    const timeout = setTimeout(() => pulse(), startDelay);
    return () => clearTimeout(timeout);
  }, []);

  return scale;
};

const DisplayModal = props => {
  const scale = usePulse();

  const { boxContainer } = styles;
  const { data, display } = props;
  return (
    <Modal visible={display} animationType="slide" transparent>
      <View style={boxContainer}>
        <Box scale={scale} data={data} onClose={() => props.onClose()} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  boxContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  box: {
    width: Constants.MODAL_WIDTH,
    height: Constants.MODAL_HEIGHT,
    backgroundColor: 'white',
  },
  text: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: Colors.darkMagenta,
    fontSize: 20,
    margin: 15,
    paddingBottom: 5,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
  },
});

export default DisplayModal;
