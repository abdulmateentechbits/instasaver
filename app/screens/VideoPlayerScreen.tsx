import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { ViewStyle } from "react-native"
import { Screen } from "../components"
import { AppStackScreenProps } from "../navigators"
import { spacing } from "../theme"

interface VideoPlayerScreenProps extends AppStackScreenProps<"Player"> {}

export const VideoPlayerScreen: FC<VideoPlayerScreenProps> = observer(function VideoPlayerScreen(_props) {
  const {navigation, route} = _props;
  
  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.huge,
  paddingHorizontal: spacing.large,
}


const $container:ViewStyle = {
  flex: 1,
  backgroundColor: "#fff",
  justifyContent: "center",
  alignItems: "center",
}
const $video:ViewStyle= {
  flex: 1,
  alignSelf: "stretch",
}
const $buttons:ViewStyle= {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  marginTop: 20,
}





// @demo remove-file
