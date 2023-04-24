/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
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
} from "react-native"
import { AppStackScreenProps } from "../navigators" // @demo remove-current-line
import { Header, Screen } from "app/components"
import { spacing } from "app/theme"
import { colors } from "../theme/colors"
import GuessNumberGame from "app/components/GuessNumberGame"
import { getDownloadLink } from "app/utils/apiRequest"
import RNFetchBlob from "rn-fetch-blob"

const downloadIcon = require("../../assets/images/Monochrome.png")
const hyperLink = require("../../assets/images/Outline.png")

interface HomeScreenProps extends AppStackScreenProps<"Home"> {}

export const HomeScreen: FC<HomeScreenProps> = observer(function HomeScreen(
  _props, // @demo remove-current-line
) {
  const [fontSize, setFontSize] = useState(30)
  const [url, setUrl] = useState("")
  const [gameActive, setGameActive] = useState(false)

  useEffect(() => {
    const { width } = Dimensions.get("window")
    const newFontSize = Math.round((width * 30) / 375) // 375 is the width of iPhone 6/7/8 screen
    setFontSize(newFontSize)
  }, [])

  const handleDownload = async () => {
    // handle download logic here

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
      console.log("downloadLink",downloadLink);
      if (downloadLink) {
        const { dirs } = RNFetchBlob.fs
        const fileExt = "." + downloadLink.split(".").pop()
        const fileName = `reel_${new Date().getTime()}_myVideo.mp4`
        const fileDir = `${dirs.DownloadDir}/${fileName}`
        const config = {
          fileCache: true,
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            path: fileDir,
            description: "Downloading reel video...",
          },
        }
        const res = await RNFetchBlob.config(config).fetch("GET", downloadLink)
        alert(`File downloaded: ${res.path()}`)
      } else {
        alert("Error while fetching your link may be your link is private, please try again!")
      }
    } else {
      alert("Storage permission denied")
    }
  }
  const handleGameComplete = () => {
    setGameActive(false)
    // Resume video download here
  }

  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <Header
        titleMode="flex"
        LeftActionComponent={
          <TouchableOpacity>
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
      <View style={{ marginTop: 15 }}>
        {gameActive && <GuessNumberGame onGameComplete={handleGameComplete} />}
      </View>
    </Screen>
  )
})
const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.huge,
  paddingHorizontal: spacing.large,
  backgroundColor: colors.background,
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