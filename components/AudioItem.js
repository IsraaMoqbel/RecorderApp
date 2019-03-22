import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button} from 'react-native';


export default class AudioItem extends Component {
  constructor() {
    super();
  }
 
  render() {
    return (
      <View style={styles.container}>
        <Button
          onPress={()=>this.props.onStartRecord()}
          title="Recoed"/>
        <Text>{this.props.recordTime}</Text>
        <Button
          onPress={()=>this.props.onStopRecord()}
          title="Stop"/>
        <Text>{this.props.playTime}</Text>
        <Text>{this.props.duration}</Text>
        <Button
          onPress={()=>this.props.onStartPlay()}
          title="Play"/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
