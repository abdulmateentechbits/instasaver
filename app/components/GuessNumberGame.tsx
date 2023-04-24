/* eslint-disable react-native/sort-styles */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-native/no-color-literals */
import React, { useState } from "react"
import { View, Text, TextInput, Button, StyleSheet } from "react-native"

interface GameProps {
  onGameComplete: (score: number) => void
  onCancelGame: () => void
}

const GuessNumberGame: React.FC<GameProps> = ({ onGameComplete, onCancelGame }) => {
  const [secretNumber, setSecretNumber] = useState(Math.floor(Math.random() * 100) + 1)
  const [guess, setGuess] = useState("")
  const [attempts, setAttempts] = useState(0)
  const [message, setMessage] = useState("")

  const cancelGame = () => {
    setGuess("")
    setAttempts(0)
    setMessage("")
    onCancelGame()
  }

  const handleGuess = () => {
    const parsedGuess = parseInt(guess, 10)

    if (isNaN(parsedGuess)) {
      setMessage("Please enter a valid number")
      return
    }

    setAttempts(attempts + 1)

    if (parsedGuess === secretNumber) {
      onGameComplete(attempts + 1)
    } else {
      const remainingAttempts = 6 - attempts
      if (remainingAttempts === 0) {
        setMessage(`You lost! The secret number was ${secretNumber}.`)
        setTimeout(() => {
          setMessage("")
          onGameComplete(-1)
        }, 3000)
      } else {
        setMessage(
          `Your guess is ${
            parsedGuess > secretNumber ? "too high" : "too low"
          }. You have ${remainingAttempts} attempts left.`,
        )
        if (attempts === 0) {
          setMessage(`You have 5 attempts left. You can do it!`)
        } else if (attempts === 3) {
          setMessage(`You have 3 attempts left. Keep going!`)
        }
      }
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.challengeText}>You media is loading, Lets do a challenge</Text>
      <Text style={styles.text}>Guess a number between 1 and 100</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        value={guess}
        onChangeText={setGuess}
      />
      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
        <View>
          <Button title="Cancel" onPress={cancelGame} />
        </View>
        <View style={{ marginLeft: 20 }}>
          <Button title="Guess" onPress={handleGuess} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  challengeText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  container: {
    alignItems: "center",
    borderColor: "rgba(149, 144, 174, 0.97)",
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },
  input: {
    borderColor: "gray",
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 24,
    marginBottom: 20,
    padding: 10,
    textAlign: "center",
    width: 200,
    color: "#fff",
  },
  message: {
    color: "red",
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  text: {
    color: "#fff",
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
})

export default GuessNumberGame
