/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Button
} from 'react-native';

import {
  mediaDevices,
  RTCView
} from 'react-native-webrtc';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const camConstraint = {
  video: {
    frameRate: 30,
    facingMode: { exact: 'user' },
    width: 720,
    height: 480,
    vb: true,
    vbBackgroundImage: require("./assets/1.jpg"),
    vbFrameSkip: 0
  }
}


const Image_Uris = [
  require("./assets/1.jpg"),
  require("./assets/2.jpg"),
  require("./assets/3.jpg"),
  require("./assets/4.jpg"),
  require("./assets/5.jpg"),
  require("./assets/6.png")
]


const App = () => {

  const [stream, setStream] = useState<any>(null);
  const [vbStatus, setVbStatus] = useState<boolean>(false);
  const [vbFrameSkip, setVbFrameSkip] = useState(0);

  useEffect(() => {

    if (!stream) return;

    let vidTracks = stream.getVideoTracks();
    if (vidTracks.length > 0) vidTracks[0]._changeVBStatus(vbStatus);

  }, [vbStatus])


  const startStream = async () => {
    const _stream = await mediaDevices.getUserMedia(camConstraint);
    setStream(_stream);
  }

  const start = async () => {
    try {
      await startStream();
    } catch (error) {
      console.error(error);
      Alert.alert('Failed to start!');
    }
  };

  const stop = async () => {
    if (stream) {
      setStream(null);
    }
  };

  function changeVbImage(imgRequire: any) {
    if (!stream) return;

    let vidTracks = stream.getVideoTracks();
    if (vidTracks.length > 0) vidTracks[0]._changeVBImage(imgRequire);
  }

  function changeVbFrameSkip(vbFrameSkip: number): void {
    let vidTracks = stream.getVideoTracks();
    if (vidTracks.length > 0) vidTracks[0]._changeVBFrameSkip(vbFrameSkip);
    setVbFrameSkip(vbFrameSkip);
  }


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={"blue"}
      />
      <View style={[styles.body, { flex: 1 }]}>
        <View style={[styles.stream, { flex: 1 }]}>
          {stream ?
            (
              <RTCView
                objectFit={'contain'}
                streamURL={stream.toURL()}
                style={[styles.stream, { width: 350, height: 800, alignSelf: "center" }]}
                zOrder={1}
              />
            ) : null
          }
          {
            stream &&
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
              <Text>Frame Skip</Text>
              <Button color={vbFrameSkip == 0 ? "red" : "blue"} title='0' onPress={() => changeVbFrameSkip(0)} />
              <Button color={vbFrameSkip == 3 ? "red" : "blue"} title='3' onPress={() => changeVbFrameSkip(3)} />
              <Button color={vbFrameSkip == 5 ? "red" : "blue"} title='5' onPress={() => changeVbFrameSkip(5)} />
              <Button color={vbFrameSkip == 7 ? "red" : "blue"} title='7' onPress={() => changeVbFrameSkip(7)} />
            </View>
          }
          {
            stream &&
            <ScrollView
              horizontal={true}
              contentContainerStyle={{
                position: "absolute", bottom: 0,
                display: "flex", flexDirection: "row", flexWrap: "nowrap", marginTop: 20
              }}
              persistentScrollbar={true} >

              {
                Image_Uris.map((data, index) => <TouchableOpacity key={index} onPress={() => { changeVbImage(data); }}>
                  <Image key={index} source={data}
                    style={{ width: 100, height: 100, marginHorizontal: 10 }} />
                </TouchableOpacity>)
              }

            </ScrollView>
          }
        </View>
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => stream ? stop() : start()}>
            <View style={[styles.btn, stream ? styles.active : styles.inactive]}>
              <Text style={styles.btnTxt}>{stream ? 'Stop' : 'Start'}</Text>
            </View>
          </TouchableOpacity>
          {stream &&
            <TouchableOpacity onPress={() => {
              if (!stream) return;

              setVbStatus(x => !x);

            }}>
              <View style={[styles.btn, stream ? styles.active : styles.inactive]}>
                <Text style={styles.btnTxt}>{vbStatus ? 'Stop VB' : 'Start VB'}</Text>
              </View>
            </TouchableOpacity>
          }
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  body: { backgroundColor: 'white' },
  stream: { flex: 1, padding: 44 },
  footer: { width: '100%', padding: 30, display: "flex", flexDirection: "row", justifyContent: "space-between" },
  btn: { paddingHorizontal: 50, paddingVertical: 10, borderRadius: 5 },
  btnTxt: { color: Colors.white, textAlign: 'center', fontSize: 20 },
  active: { backgroundColor: 'green' },
  inactive: { backgroundColor: '#454545' }
});


export default App;
