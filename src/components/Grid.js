import React, { useState, useEffect, useReducer } from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';

import Colors from '../rsc/utils/Colors';
import Constants from '../rsc/utils/Constants';
import Cell from './Cell';
import DisplayModal from './DisplayModal';

//Reducer Hook to count the number of revealed cells
const initialState = 0;
const reducer = (state, action) => {
  switch (action) {
    case 'increment':
      return state + 1;
    case 'reset':
      return 0;
    default:
      throw new Error('Unexpected action');
  }
};

const Grid = () => {
  grid = Array.apply(null, Array(Constants.GRID_SIZE)).map(() => {
    return Array.apply(null, Array(Constants.GRID_SIZE)).map(() => {
      return null;
    });
  });

  let minedCellsTotal = 0;

  //Moday state
  const [display, setDisplay] = useState(false);
  //State and Reducer Hook to count the number of revealed cells and detect Game Over state
  const [revealedCount, dispatch] = useReducer(reducer, initialState);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    //Display "You Lose"
    if (isGameOver) setDisplay(true);
  }, [isGameOver]);

  useEffect(() => {
    //Verify that all unmined cells are revealed and display "You Win"
    if (minedCellsTotal == 0) minedCellsTotal = getMinedCells().length;
    if (
      !isGameOver &&
      minedCellsTotal + revealedCount ==
        Constants.GRID_SIZE * Constants.GRID_SIZE
    )
      setDisplay(true);
  }, [revealedCount]);

  getMinedCells = () => {
    let minedCells = [];
    grid.map(elt => {
      elt.map(elt => {
        if (elt.isMine) {
          minedCells.push(elt);
        }
      });
    });
    return minedCells;
  };

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
    dispatch('increment');
    let minedNeighbors = 0;
    let cells = getNeighborCells(x, y);

    cells.filter(elt => {
      if (elt.isMine) {
        minedNeighbors++;
      }
    });

    //Set Neighbors and reveal cells
    if (minedNeighbors) {
      grid[x][y].setNeighbors(minedNeighbors);
    } else {
      cells.map(elt => {
        elt.setIsRevealed(true);
      });
    }
  };

  onMine = () => {
    // Set GameOver to true and reset the revealed cells count
    if (!isGameOver) {
      dispatch('reset');
      setIsGameOver(true);
    }
    //reveal all cells
    grid.map(elt => {
      elt.map(elt => {
        elt.setIsRevealed(true);
      });
    });
  };

  resetGame = () => {
    //Set GameOver to false and reset the revealed cells count
    dispatch('reset');
    setIsGameOver(false);
    //reset all cells
    grid.map(elt => {
      elt.map(elt => {
        elt.setIsRevealed(false);
        elt.setIsMine(Math.random() < 0.2);
        elt.setNeighbors(null);
      });
    });
  };

  retry = () => {
    //Dismiss the modal and reset the game
    setDisplay(false);
    resetGame();
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

  const { container, gridContainer, text } = styles;
  return (
    <View style={container}>
      <Text style={text}>LDB MineSweeper</Text>
      <View style={gridContainer}>{renderGrid()}</View>
      <Button title="Start A New Game " color="black" onPress={resetGame} />
      <DisplayModal
        data={isGameOver ? 'You Lose' : 'You Win'}
        display={display}
        onClose={retry}
      />
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
  text: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
    fontSize: 24,
    margin: 10,
  },
});

export default Grid;
