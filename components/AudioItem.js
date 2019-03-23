import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


export default class AudioItem extends Component {
  constructor() {
    super();
  }
 
  render() {
    return (
      <View style={styles.container}>
        <Icon name="microphone" size={30} color="#900"
        onPress={()=>this.props.onStartRecord()} />
        <Text>{this.props.recordTime}</Text>
        <Icon name="stop" size={30} color="#900"
        onPress={()=>this.props.onStopRecord()} />
        <Text>{this.props.playTime}</Text>
        <Text>{this.props.duration}</Text>
        <Icon name="play" size={30} color="#900"
        onPress={()=>this.props.onStartPlay()} />
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
