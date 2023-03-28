import {useState} from 'react'

export const useModal = () => {
    const [settingsGame, setSettingsGame] = useState(false)

    function toggleSettingsGame() {
        setSettingsGame(!settingsGame)
    }

    return {
        settingsGame,
        toggleSettingsGame
    }
}
