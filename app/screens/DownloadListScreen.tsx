/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { View, Text, Image, TouchableOpacity } from "react-native"
const thumbnail = require("../../assets/images/Thumbnail.png")
const videoIcon = require("../../assets/images/video_icon.png")
const share = require("../../assets/images/Share-2.png")
const Trashed = require("../../assets/images/Trashed.png")

export const DownloadListScreen: FC = observer(function DownloadListScreen(_props) {
  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ fontWeight: "600", fontSize: 18, color: "#3C3360" }}>Download</Text>
        <Text style={{ fontWeight: "400", fontSize: 13, color: "#9590AE", marginLeft: 15 }}>
         13 Files
        </Text>
      </View>

      {/* Load Local media */}
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((item, index) => (
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
                }}
              >
                Video Title
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
              >
                <Image source={Trashed} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ height: 196, borderRadius: 12, overflow: "hidden", marginTop: 10 }}>
            <Image source={thumbnail} style={{ height: "100%", resizeMode: "cover" }} />
          </View>
        </View>
      ))}
    </View>
  )
})

// @demo remove-file
