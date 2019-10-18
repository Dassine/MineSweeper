import React from 'react';
import { StyleSheet, View, Button } from 'react-native';

import Colors from '../rsc/utils/Colors';
import Constants from '../rsc/utils/Constants';
import Cell from './Cell';

const Grid = () => {
  grid = Array.apply(null, Array(Constants.GRID_SIZE)).map(() => {
    return Array.apply(null, Array(Constants.GRID_SIZE)).map(() => {
      return null;
    });
  });

  getNeighborCells = (x, y) => {
    let neighborCells = [];
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (
          (i != 0 || j != 0) &&
          (x + i >= 0 && x + i <= Constants.GRID_SIZE - 1) &&
          (y + j >= 0 && y + j <= Constants.GRID_SIZE - 1)
        ) {
          neighborCells.push(grid[x + i][y + j]);
        }
      }
    }
    return neighborCells;
  };

  onReveal = (x, y) => {
    let neighbors = 0;
    let cells = getNeighborCells(x, y);

    cells.filter(elt => {
      if (elt.isMine) {
        neighbors++;
      }
    });

    if (neighbors) {
      grid[x][y].setNeighbors(neighbors);
    } else {
      cells.map(elt => {
        elt.onReveal(false);
      });
    }
  };

  onMine = () => {
    grid.map(elt => {
      elt.map(elt => {
        elt.setIsRevealed(true);
      });
    });
  };

  resetGame = () => {
    grid.map(elt => {
      elt.map(elt => {
        elt.setIsRevealed(false);
        elt.setIsMine(Math.random() < 0.2);
        elt.setNeighbors(null);
      });
    });
  };

  renderGrid = () => {
    return grid.map((elt, rowIndex) => {
      let cellList = grid.map((elt, colIndex) => {
        return (
          <Cell
            key={colIndex}
            x={colIndex}
            y={rowIndex}
            onReveal={onReveal}
            onMine={onMine}
            ref={ref => {
              grid[colIndex][rowIndex] = ref;
            }}
          />
        );
      });
      const { cellContainer } = styles;
      return (
        <View key={rowIndex} style={cellContainer}>
          {cellList}
        </View>
      );
    });
  };

  const { container, gridContainer } = styles;
  return (
    <View style={container}>
      <View style={gridContainer}>{renderGrid()}</View>
      <Button title="Start A New Game " color="black" onPress={resetGame} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridContainer: {
    backgroundColor: Colors.mediumGray,
    flexDirection: 'column',
    width: Constants.GRID_WIDTH,
    height: Constants.GRID_WIDTH,
  },
  cellContainer: {
    flexDirection: 'row',
    width: Constants.GRID_WIDTH,
    height: Constants.CELL_SIZE,
  },
});

export default Grid;
