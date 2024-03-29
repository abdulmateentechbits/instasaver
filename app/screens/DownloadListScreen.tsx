/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { View, Text, Image, TouchableOpacity ,PermissionsAndroid, Alert} from "react-native"
import { deleteAsync, readDirectoryAsync } from "expo-file-system"
import RNFS from 'react-native-fs';

const thumbnail = require("../../assets/images/Thumbnail.png")
const videoIcon = require("../../assets/images/video_icon.png")
const share = require("../../assets/images/Share-2.png")
const Trashed = require("../../assets/images/Trashed.png")

export const DownloadListScreen: FC = observer(function DownloadListScreen(_props) {
  const [downloadedVideos, setDownloadedVideos] = useState<string[]>([])
  const [deletedFile, setDeletedFile] = useState(null);

  useEffect(() => {
    async function loadDownloadedVideos() {
      try {
        const directory = await readDirectoryAsync(
          "file:///storage/emulated/0/Download/InstaMagnet/",
        )
        const videos = directory.filter((file) => file.endsWith(".mp4") || file.endsWith(".mov"))
        setDownloadedVideos(videos)
      } catch (error) {
        console.log("Error reading directory:", error)
        setDownloadedVideos([])
      }
    }

    loadDownloadedVideos()
  }, [deletedFile])

  
  const handleDeleteVideo = (videoName) => {
    const videoPath = `file:///storage/emulated/0/Download/InstaMagnet/${videoName}`
    Alert.alert(
      'Delete Video',
      `Are you sure you want to delete ${videoName}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await RNFS.unlink(videoPath);
              // remove the deleted item from the state
              setDownloadedVideos((prevVideos) =>
              prevVideos.filter((video) => video !== videoName)
            )
              setDeletedFile(true); // update deletedFile state variable
            } catch (error) {
              console.log('Error deleting file: ', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };
  
  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ fontWeight: "600", fontSize: 18, color: "#3C3360" }}>Download</Text>
        <Text style={{ fontWeight: "400", fontSize: 13, color: "#9590AE", marginLeft: 15 }}>
          { downloadedVideos?.length ? downloadedVideos?.length : 0} Files
        </Text>
      </View>

      {/* Load Local media */}
      {downloadedVideos?.map((item, index) => (
        <View key={index}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 30,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", flex: 5 }}>
              <Image source={videoIcon} />
              <Text
                style={{
                  marginLeft: 10,
                  fontStyle: "normal",
                  fontWeight: "600",
                  fontSize: 14,
                  color: "#3C3360",
                  width:'70%'
                }}
              >
                {item}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flex: 1,
                justifyContent: "space-between",
                marginRight: 20,
              }}
            >
              <TouchableOpacity
                style={{
                  width: 26,
                  height: 26,
                  borderWidth: 1,
                  borderRadius: 6,
                  borderColor: "#9590AE",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image source={share} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: 26,
                  height: 26,
                  borderWidth: 1,
                  borderRadius: 6,
                  borderColor: "#9590AE",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: 10,
                }}
                onPress={()=>handleDeleteVideo(item)}
              >
                <Image source={Trashed} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ height: 196, borderRadius: 12, overflow: "hidden", marginTop: 10 }}>
            <Image source={thumbnail} style={{ height: "100%", resizeMode: "cover" }} />
          </View>
        </View>
      )) || []}
    </View>
  )
})

// @demo remove-file
