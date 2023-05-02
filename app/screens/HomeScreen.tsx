/* eslint-disable react-native/split-platform-components */
/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState, useCallback, useRef, useMemo } from "react"
import {
  View,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  Dimensions,
  Text,
  TextInput,
  Image,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
  ScrollView,
  ImageBackground
} from "react-native"
import { AppStackScreenProps } from "../navigators" // @demo remove-current-line
import { Header, Screen } from "app/components"
import { spacing } from "app/theme"
import { colors } from "../theme/colors"
import GuessNumberGame from "app/components/GuessNumberGame"
import { getDownloadLink } from "app/utils/apiRequest"
import RNFetchBlob from "rn-fetch-blob"
import { BottomSheetFlatList, BottomSheetModal } from "@gorhom/bottom-sheet"
import { DownloadListScreen } from "./DownloadListScreen"
import * as VideoThumbnails from 'expo-video-thumbnails';

const downloadIcon = require("../../assets/images/Monochrome.png")
const hyperLink = require("../../assets/images/Outline.png")
const Checked = require("../../assets/images/Checked.png")
const favorite = require("../../assets/images/more_app.png")
const Setting = require("../../assets/images/Setting.png")
const file = require("../../assets/images/file.png")
const lan = require("../../assets/images/lan.png")
const share = require("../../assets/images/share.png")
const bgImg = require("../../assets/images/bgImg.jpg")

interface HomeScreenProps extends AppStackScreenProps<"Home"> {}

const tabs = [
  { title: "Download", icon: Checked, screen: "DownloadScreen" },
  { title: "Settings", icon: Setting, screen: "SettingsScreen" },
  { title: "Favorite", icon: favorite, screen: "FavoriteScreen" },
]

const Tab = ({ icon, onPress, isActive }) => {
  return (
    <TouchableOpacity
      style={[$tab, isActive && { backgroundColor: "powderblue" }]}
      onPress={onPress}
    >
      <Image source={icon} />
    </TouchableOpacity>
  )
}



const BottomSheetTabs = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].screen)
  const renderItem = ({ item, index }) => (
    <Tab
      icon={item.icon}
      onPress={() => setActiveTab(item.screen)}
      isActive={index === activeTab}
    />
  )

  const shareApp = () => {
    console.log("Add logic after app is live on play store")
  }

  return (
    <View
      style={{
        padding: 16,
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }}
    >
      <BottomSheetFlatList
        data={tabs}
        renderItem={renderItem}
        keyExtractor={(item) => item.title}
        horizontal
        contentContainerStyle={$tabContainer}
        showsHorizontalScrollIndicator={false}
      />
      {activeTab === "DownloadScreen" ? (
        <View style={{ flex: 2 }}>
        <ScrollView>
          <DownloadListScreen />
        </ScrollView>
        </View>
      ) : activeTab === "SettingsScreen" ? (
        <View style={{ flex: 2 }}>
          <ScrollView>
            <Text style={{ fontWeight: "600", fontSize: 18, color: "#3C3360" }}>Setting</Text>
            <View style={{ flexDirection: "column" }}>
              <Text style={{ fontWeight: "400", fontSize: 16, color: "#9590AE", marginTop: 30 }}>
                General
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 15 }}>
                <View>
                  <Image source={file} />
                </View>
                <View style={{ marginLeft: 10 }}>
                  <Text style={{ fontWeight: "600", fontSize: 16, color: "#3C3360" }}>
                    Storage Folder
                  </Text>
                  <Text
                    style={{
                      fontStyle: "normal",
                      fontWeight: "400",
                      fontSize: 13,
                      color: "#9590AE",
                    }}
                  >
                    Internal Storage/InstaMagnet
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 17 }}>
                <View>
                  <Image source={lan} />
                </View>
                <View style={{ marginLeft: 10 }}>
                  <Text style={{ fontWeight: "600", fontSize: 16, color: "#3C3360" }}>
                    Default Language
                  </Text>
                  <Text
                    style={{
                      fontStyle: "normal",
                      fontWeight: "400",
                      fontSize: 13,
                      color: "#9590AE",
                    }}
                  >
                    English
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ flexDirection: "column" }}>
              <Text style={{ fontWeight: "400", fontSize: 16, color: "#9590AE", marginTop: 30 }}>
                Advance
              </Text>
              {/* Need to add logic when app is live */}
              <TouchableOpacity onPress={shareApp}>
                <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 15 }}>
                  <View>
                    <Image source={share} />
                  </View>
                  <View style={{ marginLeft: 10 }}>
                    <Text style={{ fontWeight: "600", fontSize: 16, color: "#3C3360" }}>Share</Text>
                    <Text
                      style={{
                        fontStyle: "normal",
                        fontWeight: "400",
                        fontSize: 13,
                        color: "#9590AE",
                      }}
                    >
                      Please share this app with your friends
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      ) : activeTab === "FavoriteScreen" ? (
        <View style={{ flex: 2 }}>
          <ScrollView>
            <Text style={{ fontWeight: "600", fontSize: 18, color: "#3C3360" }}>More Apps</Text>
          </ScrollView>
        </View>
      ) : null}
    </View>
  )
}

export const HomeScreen: FC<HomeScreenProps> = observer(function HomeScreen(
  _props, // @demo remove-current-line
) {
  const [fontSize, setFontSize] = useState(30)
  const [url, setUrl] = useState("")
  const [gameActive, setGameActive] = useState(false)
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  useEffect(() => {
    const { width } = Dimensions.get("window")
    const newFontSize = Math.round((width * 30) / 375) // 375 is the width of iPhone 6/7/8 screen
    setFontSize(newFontSize)
  }, [])

  const handleDownload = async () => {
    // handle download logic here
    if (!url) {
      ToastAndroid.show(`Please enter post link!`, ToastAndroid.SHORT)
      return
    }

    const regex = /^https:\/\/www\.instagram\.com\/reel\/[a-zA-Z0-9_-]{11}/
    if (!regex.test(url)) {
      ToastAndroid.show(`Please enter a valid link!`, ToastAndroid.SHORT)
      return
    }

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: "Storage Permission Required",
        message: "This app needs access to your device storage to download the file",
        buttonPositive: "OK",
      },
    )
    setGameActive(true)

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      const downloadLink = await getDownloadLink(url)
      if (downloadLink) {
        const { dirs } = RNFetchBlob.fs
        const downloadDir = Platform.OS === "ios" ? dirs.DocumentDir : dirs.DownloadDir
        const folderName = "InstaMagnet"
        const filename = decodeURIComponent(downloadLink.split("filename=")[1].split("&")[0])
        let fileName
        if (filename) {
          const words = filename.split(" ")
          const firstTwoWords = words.slice(0, 3).join("_")
          fileName = `${firstTwoWords}.mp4`
        } else {
          fileName = `reel_${new Date().getTime()}.mp4`
        }
        const folderPath = `${downloadDir}/${folderName}`
        const filePath = `${folderPath}/${fileName}`

        // Check if the folder exists, create it if it doesn't
        const isFolderExists = await RNFetchBlob.fs.isDir(folderPath)
        if (!isFolderExists) {
          await RNFetchBlob.fs.mkdir(folderPath)
        }

        const config = {
          fileCache: true,
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            path: filePath,
            description: "Downloading reel video...",
          },
        }

        const res = await RNFetchBlob.config(config).fetch("GET", downloadLink)
        setUrl("")
        ToastAndroid.show(`File downloaded: ${res.path()}`, ToastAndroid.SHORT)
      } else {
        ToastAndroid.show(
          "Error while fetching your link may be your link is private, please try again!",
          ToastAndroid.SHORT,
        )
      }
    } else {
      ToastAndroid.show("Storage permission denied", ToastAndroid.SHORT)
    }
  }
  const handleGameComplete = () => {
    setGameActive(false)
    setUrl("")
    // Resume video download here
  }
  const onCancelGame = () => {
    setGameActive(false)
    setUrl("")
    // Resume video download here
  }

  // variables
  const snapPoints = useMemo(() => ["25%", "69%"], [])

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present()
  }, [])

  return (
    <>
      <Screen
        preset="auto"
        contentContainerStyle={$screenContentContainer}
        safeAreaEdges={["top", "bottom"]}
      >
        <Header
          titleMode="flex"
          LeftActionComponent={
            <TouchableOpacity onPress={handlePresentModalPress}>
              <View style={$customLeftAction}>
                <View style={$childItem} />
                <View style={$childItem} />
                <View style={$childItem} />
                <View style={$childItem} />
              </View>
            </TouchableOpacity>
          }
          safeAreaEdges={[]}
        />
        {/* Title */}
        <View style={{ marginTop: 33 }}>
          <Text
            style={{
              fontWeight: "600",
              fontSize,
              lineHeight: fontSize,
              color: "#F6F6F8",
            }}
          >
            Insta Downloader
          </Text>
        </View>
        {/* Search Bar */}
        <View style={$container}>
          <View style={$inputContainer}>
            <Image source={hyperLink} />
            <TextInput
              style={$input}
              placeholder="Paste Post link here..."
              placeholderTextColor="rgba(149, 144, 174, 0.54)"
              value={url}
              onChangeText={(text) => setUrl(text)}
            />
          </View>
          <TouchableOpacity style={$downloadButton} onPress={handleDownload} disabled={gameActive}>
            <Image source={downloadIcon} />
          </TouchableOpacity>
        </View>
        {/* Below empty space */}
        <ImageBackground source={bgImg} imageStyle={{resizeMode:'cover',borderRadius:12}} style={{ marginTop: 15 }}>
          {gameActive && (
            <GuessNumberGame onGameComplete={handleGameComplete} onCancelGame={onCancelGame} />
          )}
        </ImageBackground>
      </Screen>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        handleComponent={() => (
          <View style={$draggableContainer}>
            <TouchableOpacity onPress={() => bottomSheetModalRef.current?.close()}>
              <View style={$draggableIndicator} />
            </TouchableOpacity>
          </View>
        )}
      >
        <View style={$contentContainer}>
          <BottomSheetTabs />
        </View>
      </BottomSheetModal>
    </>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.huge,
  paddingHorizontal: spacing.large,
  backgroundColor: colors.background,
}
const $tabContainer: ViewStyle = {
  padding: 16,
  backgroundColor: "#fff",
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
}

const $tab: ViewStyle = {
  width: 67,
  height: 80,
  backgroundColor: "#F6F6F8",
  borderRadius: 20,
  justifyContent: "center",
  alignItems: "center",
  marginRight: 25,
}
const $draggableContainer: ViewStyle & TextStyle = {
  alignItems: "center",
}
const $draggableIndicator: ViewStyle = {
  width: 40,
  height: 5,
  borderRadius: 2.5,
  backgroundColor: "#ccc",
  marginTop: 8,
}

const $contentContainer: ViewStyle = {
  flex: 1,
  alignItems: "center",
}
const $container: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  marginVertical: 15,
}
const $inputContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  borderWidth: 1,
  borderColor: "rgba(149, 144, 174, 0.97)",
  borderRadius: 12,
  paddingHorizontal: 14,
  flex: 1,
  marginRight: 10,
}

const $input: ViewStyle & TextStyle = {
  flex: 1,
  marginLeft: 10,
  fontSize: 16,
  fontWeight: "500",
  color: "#ffff",
}

const $downloadButton: ViewStyle = {
  width: 45,
  height: 45,
  backgroundColor: "rgba(129, 97, 250, 0.4)",
  borderWidth: 1,
  borderColor: "rgba(149, 144, 174, 0.97)",
  borderRadius: 12,
  alignItems: "center",
  justifyContent: "center",
}

const $customLeftAction: ViewStyle = {
  width: 45,
  height: 45,
  flexDirection: "row",
  flexWrap: "wrap",
  overflow: "hidden",
  borderWidth: 1,
  borderColor: "rgba(149, 144, 174, 0.97)",
  borderRadius: 12,
  alignItems: "center",
  justifyContent: "center",
  padding: 7,
}
const $childItem: ViewStyle = {
  width: 6,
  height: 6,
  borderRadius: 4,
  borderWidth: 1,
  borderColor: "white",
  margin: 4,
}
