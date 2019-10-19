import React, {
  useState,
  useEffect,
  forwardRef,
  useRef,
  useImperativeHandle,
} from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Text } from 'react-native';

import Constants from '../rsc/utils/Constants';
import Colors from '../rsc/utils/Colors';
import Images from '../rsc/assets/Images';

const Cell = forwardRef((props, ref) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isMine, setIsMine] = useState(Math.random() < 0.2);
  const [neighbors, setNeighbors] = useState(null);

  const cellRef = useRef(ref);
  useImperativeHandle(
    ref,
    () => (
      (cellRef.current = ref),
      {
        isMine,
        isRevealed,
        setIsRevealed,
        setIsMine,
        setNeighbors,
        onReveal,
      }
    ),
    [isMine]
  );

  useEffect(() => {
    if (isRevealed) {
      const { x, y, onReveal, onMine } = props;
      if (isMine) {
        onMine();
      } else {
        onReveal(x, y);
      }
    }
  }, [isRevealed]);

  const onReveal = userInitiated => {
    if (isRevealed || (!userInitiated && isMine)) {
      return;
    }

    setIsRevealed(true);
  };

  const { cell, cellRevealed, cellMined } = styles;
  const { mine } = Images;

  return !isRevealed ? (
    <TouchableOpacity onPress={() => onReveal(true)} ref={cellRef}>
      <View style={cell} />
    </TouchableOpacity>
  ) : (
    <View style={[cell, cellRevealed]} ref={cellRef}>
      {isMine ? (
        <Image source={mine} style={cellMined} resizeMode="contain" />
      ) : (
        <Text>{neighbors}</Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  cell: {
    backgroundColor: Colors.lightGray,
    width: Constants.CELL_SIZE,
    height: Constants.CELL_SIZE,
    borderWidth: 3,
    borderTopColor: 'white',
    borderLeftColor: 'white',
    borderRightColor: Colors.mediumGray,
    borderBottomColor: Colors.mediumGray,
  },
  cellRevealed: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.mediumGray,
  },
  cellMined: {
    width: Constants.CELL_SIZE / 2,
    height: Constants.CELL_SIZE / 2,
  },
});

export default Cell;
