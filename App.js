import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import firebase from 'react-native-firebase';
import RNFS from 'react-native-fs';

import AudioItem from './components/AudioItem';

let TheList=[];
export default class App extends Component {
  constructor() {
    super();
    this.state={
      recordSecs:0,
      currentPositionSec: 0,
      currentDurationSec: 0,
      playTime: '',
      duration: '',
      recordTime:'',
      audiosList:[],
      isRecording: false,
      isPlaying:false
    }
  }
  audioRecorderPlayer = new AudioRecorderPlayer();
  id = Math.random().toString(36).substring(2);
  StorageRef = firebase.storage().ref(this.id);
  database = firebase.database();
  audiosListRef = this.database.ref('audios/').orderByChild('timeCreated');


  onStartRecord = async () => {
    // this.setState({isRecording:true});
    const path = Platform.select({
      ios: 'hello.m4a',
      android: 'storage/emulated/0/Android/data/com.recorderapp/files/hello.mp4',
    });
    const result = await this.audioRecorderPlayer.startRecorder(path);
    this.audioRecorderPlayer.addRecordBackListener((e) => {
      console.log(e);
      this.setState({
        recordSecs: e.current_position,
        recordTime: this.audioRecorderPlayer.mmssss(Math.floor(e.current_position)),
      });
      return;
    });
  }

  onStopRecord = async () => {
    // this.setState({isRecording:false});

    const result = await this.audioRecorderPlayer.stopRecorder();
    this.audioRecorderPlayer.removeRecordBackListener();
    this.setState({
      recordSecs: 0,
    });

      console.log('FILE Read Successfully!');
      this.StorageRef.put('/storage/emulated/0/Android/data/com.recorderapp/files/hello.mp4').then((snapshot)=> {
        console.log(snapshot, 'Uploaded a blob or file!');
          this.database.ref('audios/' + snapshot.metadata.name).set({
            download_url : snapshot.downloadURL,
            timeCreated:snapshot.metadata.timeCreated
          });

      });

  }

  onStartPlay = async () => {
    // this.setState({isPlaying:true});

    console.log('onStartPlay');
    const path = Platform.select({
      ios: 'hello.m4a',
      android: 'storage/emulated/0/Android/data/com.recorderapp/files/hello.mp4',
    });
    const msg = await this.audioRecorderPlayer.startPlayer(path);
    this.audioRecorderPlayer.addPlayBackListener((e) => {
      if (e.current_position === e.duration) {
        console.log('finished');
        this.audioRecorderPlayer.stopPlayer();
      }
      this.setState({
        currentPositionSec: e.current_position,
        currentDurationSec: e.duration,
        playTime: this.audioRecorderPlayer.mmssss(Math.floor(e.current_position)),
        duration: this.audioRecorderPlayer.mmssss(Math.floor(e.duration)),
      });
      return;
    });
  }

  componentDidMount() {
    let audiosList= [];
      this.audiosListRef.on('value', (snapshot)=> {
        if(snapshot) {
          snapshot.forEach((childSnapshot)=> {
            let childData = childSnapshot.val();
            audiosList.push(childData);
          });
          this.setState({audiosList});
        } else {
          console.log('list of data is not here yet!!!!')
        }
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native Recorder!</Text>
        <Icon name="headphones" size={60} color="#900" />
          <AudioItem 
          onStartRecord={this.onStartRecord}
          onStopRecord={this.onStopRecord}
          onStartPlay={this.onStartPlay}
          playTime={this.state.playTime}
          recordTime={this.state.recordTime}
          duration={this.state.duration}
           />
        <FlatList
          data={this.state.audiosList}
          renderItem={({item, index}) => <Text>{item.timeCreated} new Audio #{index} {item.download_url}</Text>}
        />        

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