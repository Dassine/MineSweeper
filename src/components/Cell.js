import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity, Image, Text } from 'react-native'

import Constants from '../rsc/utils/Constants'
import Colors from '../rsc/utils/Colors'
import Images from '../rsc/assets/Images'

class Cell extends Component {
  state = {
    isRevealed: false,
    isMine: Math.random() < 0.2,
    neighbors: null
  }

  revealCell = () => {
    const { isRevealed } = this.state

    if (isRevealed) {
      return
    }

    this.setState({
      isRevealed: true
    })
  }

  onReveal = userInitiated => {
    const { isRevealed, isMine } = this.state
    const { x, y, onReveal, onMine } = this.props

    if (isRevealed || (!userInitiated && isMine)) {
      return
    }

    this.setState(
      {
        isRevealed: true
      },
      () => {
        if (isMine) {
          onMine()
        } else {
          onReveal(x, y)
        }
      }
    )
  }

  onReset = () => {
    this.setState({
      isRevealed: false,
      isMine: Math.random() < 0.2,
      neighbors: null
    })
  }

  render () {
    const { cell, cellRevealed, cellMined } = styles
    const { isRevealed, isMine, neighbors } = this.state
    const { mine } = Images

    return !isRevealed ? (
      <TouchableOpacity onPress={() => this.onReveal(true)}>
        <View style={cell} />
      </TouchableOpacity>
    ) : (
      <View style={[cell, cellRevealed]}>
        {isMine ? (
          <Image source={mine} style={cellMined} resizeMode='contain' />
        ) : (
          <Text>{neighbors}</Text>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  cell: {
    backgroundColor: Colors.lightGray,
    width: Constants.CELL_SIZE,
    height: Constants.CELL_SIZE,
    borderWidth: 3,
    borderTopColor: 'white',
    borderLeftColor: 'white',
    borderRightColor: Colors.mediumGray,
    borderBottomColor: Colors.mediumGray
  },
  cellRevealed: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.mediumGray
  },
  cellMined: {
    width: Constants.CELL_SIZE / 2,
    height: Constants.CELL_SIZE / 2
  }
})

export default Cell
