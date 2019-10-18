/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react'
import { StyleSheet, View } from 'react-native'

import Grid from './components/Grid'

const App = () => {
  const { container } = styles
  return (
    <View style={container}>
      <Grid />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default App
