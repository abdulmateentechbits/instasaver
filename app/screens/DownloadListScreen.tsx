/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { View, Text, Image, TouchableOpacity, Alert } from "react-native"
import { readDirectoryAsync } from "expo-file-system"
import RNFS from "react-native-fs"
import * as VideoThumbnails from "expo-video-thumbnails"
import Share from 'react-native-share';
import { AppStackScreenProps } from "app/navigators"

const thumbnail = require("../../assets/images/Thumbnail.png")
const videoIcon = require("../../assets/images/video_icon.png")
const share = require("../../assets/images/Share-2.png")
const Trashed = require("../../assets/images/Trashed.png")

interface DownloadListProps extends AppStackScreenProps<"Player"> {}

export const DownloadListScreen: FC<DownloadListProps> = observer(function DownloadListScreen(_props) {
  const {navigation} = _props;
  const [downloadedVideos, setDownloadedVideos] = useState<string[]>([])
  const [deletedFile, setDeletedFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function loadDownloadedVideos() {
      setIsLoading(true)
      try {
        const directory = await readDirectoryAsync(
          "file:///storage/emulated/0/Download/InstaMagnet/",
        )
        const videos = directory.filter((file) => file.endsWith(".mp4") || file.endsWith(".mov"))
        const videoThumbnails = []
        for (const video of videos) {
          const videoUri = `file:///storage/emulated/0/Download/InstaMagnet/${video}`
          const thumbnailUri = await generateThumbnail(videoUri)
          videoThumbnails.push({ name: video, thumbnail: thumbnailUri })
        }
        setDownloadedVideos(videoThumbnails)
        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
        console.log("Error reading directory:", error)
        setDownloadedVideos([])
      }
    }

    loadDownloadedVideos()
  }, [deletedFile])

  const generateThumbnail = async (videoUri: string) => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
        time: 15000, // time position to take thumbnail
      })
      return uri
    } catch (e) {
      console.warn(e)
    }
  }

  const handleDeleteVideo = (videoName) => {
    const videoPath = `file:///storage/emulated/0/Download/InstaMagnet/${videoName}`
    Alert.alert(
      "Delete Video",
      `Are you sure you want to delete ${videoName}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              await RNFS.unlink(videoPath)
              // remove the deleted item from the state
              setDownloadedVideos((prevVideos) =>
                prevVideos.filter((video) => video.name !== videoName),
              )
              setDeletedFile(true) // update deletedFile state variable
            } catch (error) {
              console.log("Error deleting file: ", error)
            }
          },
        },
      ],
      { cancelable: false },
    )
  }

  const onShare = async (videoName) => {
    try {
      const shareOptions = {
        activityType: 'com.apple.UIKit.activity.SaveToCameraRoll',
        url: `file:///storage/emulated/0/Download/InstaMagnet/${videoName}`,
      };
      const shareResponse = await Share.open(shareOptions);
      console.log('Share response:', shareResponse);
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ fontWeight: "600", fontSize: 18, color: "#3C3360" }}>Download</Text>
        <Text style={{ fontWeight: "400", fontSize: 13, color: "#9590AE", marginLeft: 15 }}>
          {downloadedVideos?.length ? downloadedVideos?.length : 0} Files
        </Text>
      </View>

      {isLoading ? (
        <View style={{width:300, height:100, borderWidth:1, borderRadius:12, alignItems:'center', justifyContent:'center',marginTop:60}}>
          <Text style={{color:'red', fontSize:19}}>Loading....</Text>
        </View>
      ) : (
        downloadedVideos?.map((item, index) => {
          return (
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
                      width: "70%",
                    }}
                  >
                    {item?.name}
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
                    onPress={()=>onShare(item?.name)}
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
                    onPress={() => handleDeleteVideo(item?.name)}
                  >
                    <Image source={Trashed} />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                style={{ height: 196, borderRadius: 12, overflow: "hidden", marginTop: 10 }}
                onPress={() => console.log("Playing....")}
              >
                <Image
                  source={{ uri: item?.thumbnail }}
                  style={{ height: "100%", resizeMode: "cover" }}
                />
              </TouchableOpacity>
            </View>
          )
        }) || []
      )}
    </View>
  )
})

// @demo remove-file
