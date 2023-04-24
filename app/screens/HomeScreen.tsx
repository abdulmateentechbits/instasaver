import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { View, ViewStyle, TextStyle, TouchableOpacity } from "react-native"
import { AppStackScreenProps } from "../navigators" // @demo remove-current-line
import { Header, Screen } from "app/components"
import { spacing } from "app/theme"
import { colors } from "../theme/colors"

interface HomeScreenProps extends AppStackScreenProps<"Home"> {}

export const HomeScreen: FC<HomeScreenProps> = observer(function HomeScreen(
  _props, // @demo remove-current-line
) {
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
    </Screen>
  )
})
const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.huge,
  paddingHorizontal: spacing.large,
  backgroundColor: colors.background,
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
