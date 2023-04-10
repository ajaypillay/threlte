import type { CurrentWritable } from '@threlte/core'
import { buildActions, createState, toCurrentReadable } from './utils'
import { TrackData } from '../Track/TrackData/TrackData'

/**
 * -----------------------------------------------------
 * STATE
 * -----------------------------------------------------
 *
 * To truly isolate state manipulation from consumption,
 * the states in this file only return read-only stores and
 * manipulating the state is only possible through "actions".
 *
 * Some of the actions also implement event emitters because some
 * logic cannot be implemented in the stores alone.
 */

type AppState = {
  readonly state: CurrentWritable<'intro' | 'menu' | 'game'>
  readonly visibility: CurrentWritable<'visible' | 'hidden'>
  readonly debug: CurrentWritable<boolean>
}

type MenuState = {
  readonly state: CurrentWritable<'main' | 'user-tracks' | 'campaign' | 'options' | 'credits'>
}

type GameType = 'time-attack' | 'track-editor'

type GameState = {
  readonly gameType: CurrentWritable<GameType>
  readonly trackData: CurrentWritable<TrackData | undefined>
  readonly paused: CurrentWritable<boolean>
  /**
   * The common current gameplay state.
   * Every game type has its own state, but this is the common one.
   */
  readonly common: {
    readonly time: CurrentWritable<number>
  }
  readonly timeAttack: {
    readonly state: CurrentWritable<'track-intro' | 'count-in' | 'playing' | 'finished'>
  }
  readonly trackEditor: {
    readonly state: CurrentWritable<'editing' | 'validation'>
    readonly editing: {
      readonly view: CurrentWritable<'car' | 'orbit'>
    }
    readonly validation: {
      readonly state: CurrentWritable<'intro' | 'count-in' | 'validation' | 'finished'>
    }
  }
}

/**
 * -----------------------------------------------------
 * App State
 * -----------------------------------------------------
 */
const _appState: AppState = {
  state: createState('intro'),
  visibility: createState('visible'),
  debug: createState(false)
}

/**
 * Immutable app state
 */
export const appState = {
  state: toCurrentReadable(_appState.state),
  visibility: toCurrentReadable(_appState.visibility),
  debug: toCurrentReadable(_appState.debug)
}

/**
 * -----------------------------------------------------
 * Menu State
 * -----------------------------------------------------
 */
const _menuState: MenuState = {
  state: createState('main')
}

/**
 * Immutable menu state
 */
export const menuState = {
  state: toCurrentReadable(_menuState.state)
}

/**
 * -----------------------------------------------------
 * Game State
 * -----------------------------------------------------
 */
const _gameState: GameState = {
  gameType: createState('time-attack'),
  trackData: createState(undefined),
  paused: createState(false),
  common: {
    time: createState(0)
  },
  timeAttack: {
    state: createState('track-intro')
  },
  trackEditor: {
    state: createState('editing'),
    editing: {
      view: createState('orbit')
    },
    validation: {
      state: createState('intro')
    }
  }
}

/**
 * Immutable game state
 */
export const gameState = {
  gameType: toCurrentReadable(_gameState.gameType),
  trackData: toCurrentReadable(_gameState.trackData),
  paused: toCurrentReadable(_gameState.paused),
  common: {
    time: toCurrentReadable(_gameState.common.time)
  },
  timeAttack: {
    state: toCurrentReadable(_gameState.timeAttack.state)
  },
  trackEditor: {
    state: toCurrentReadable(_gameState.trackEditor.state),
    editing: {
      view: toCurrentReadable(_gameState.trackEditor.editing.view)
    },
    validation: {
      state: toCurrentReadable(_gameState.trackEditor.validation.state)
    }
  }
}

export const actions = buildActions(
  {
    /**
     * -----------------------------------------------------
     * App Actions
     * -----------------------------------------------------
     */

    setDebug: (debug: boolean) => {
      _appState.debug.set(debug)
    },

    toggleDebug: () => {
      _appState.debug.set(!_appState.debug.current)
    },

    setVisibility: (visibility: 'visible' | 'hidden') => {
      _appState.visibility.set(visibility)
    },

    /**
     * -----------------------------------------------------
     * Menu Actions
     * -----------------------------------------------------
     */
    goToMainMenu: () => {
      _appState.state.set('menu')
      _menuState.state.set('main')
    },

    goToCampaignMenu: () => {
      _appState.state.set('menu')
      _menuState.state.set('campaign')
    },

    goToUserTracksMenu: () => {
      _appState.state.set('menu')
      _menuState.state.set('user-tracks')
    },

    goToOptionsMenu: () => {
      _appState.state.set('menu')
      _menuState.state.set('options')
    },

    goToCreditsMenu: () => {
      _appState.state.set('menu')
      _menuState.state.set('credits')
    },

    /**
     * -----------------------------------------------------
     * Game Actions
     * -----------------------------------------------------
     *
     * These actions should be called as close to Game.svelte
     * as possible and reasonable.
     */

    loadTrackDataFromServer: async (trackId: string, callback: () => void) => {
      _appState.state.set('game')
      _gameState.trackData.set(undefined)
      const trackData = await TrackData.fromServer(trackId)
      _gameState.trackData.set(trackData)
      callback()
    },

    loadTrackDataFromLocalStorage: (trackId: string, callback: () => void) => {
      _appState.state.set('game')
      _gameState.trackData.set(undefined)
      const trackData = TrackData.fromLocalStorage(trackId)
      _gameState.trackData.set(trackData)
      callback()
    },

    loadEmptyTrackData: (callback: () => void) => {
      _appState.state.set('game')
      const trackData = TrackData.createEmpty()
      _gameState.trackData.set(trackData)
      callback()
    },

    /**
     * ++++++++++++++++++++++++++++++++
     * Timing Actions
     * ++++++++++++++++++++++++++++++++
     */

    resetGameTime: () => {
      _gameState.common.time.set(0)
    },

    /**
     * The time is incremented to prevent accidentally setting it higher in the
     * event of a game pause or other situations.
     * This action does not emit an event!
     */
    incrementGameTime: (time: number) => {
      _gameState.common.time.update((t) => t + time)
      return { debug: false }
    },

    /**
     * ++++++++++++++++++++++++++++++++
     * Time Attack Actions
     * ++++++++++++++++++++++++++++++++
     */
    startTimeAttack: () => {
      _appState.state.set('game')
      _gameState.paused.set(false)
      _gameState.gameType.set('time-attack')
      _gameState.timeAttack.state.set('track-intro')
    },

    timeAttackStartCountIn: () => {
      _gameState.timeAttack.state.set('count-in')
    },

    timeAttackStartPlaying: () => {
      actions.resetGameTime()
      _gameState.timeAttack.state.set('playing')
    },

    timeAttackFinish: () => {
      _gameState.timeAttack.state.set('finished')
    },

    /**
     * After finishing a track, the user may restart the track.
     * We begin *before* the count-in.
     */
    resetTimeAttack: () => {
      _gameState.timeAttack.state.set('track-intro')
      actions.resetGameTime()
    },

    /**
     * While playing the track, the user may soft-reset the track.
     * We begin *during* the count-in, so the game play is not affected.
     */
    softResetTimeAttack: () => {
      // a soft reset can only be done while playing
      // and not while paused
      _gameState.timeAttack.state.set('count-in')
      actions.resetGameTime()
    },

    /**
     * ++++++++++++++++++++++++++++++++
     * Track Editor Actions
     * ++++++++++++++++++++++++++++++++
     */

    startTrackEditor: () => {
      _appState.state.set('game')
      _gameState.paused.set(false)
      _gameState.gameType.set('track-editor')
      _gameState.trackEditor.state.set('editing')
      _gameState.trackEditor.editing.view.set('orbit')
    },

    setTrackEditorView: (view: 'orbit' | 'car') => {
      _gameState.trackEditor.editing.view.set(view)
    },

    startTrackValidation: () => {
      _gameState.trackEditor.state.set('validation')
      _gameState.trackEditor.validation.state.set('intro')
    },

    startTrackValidationCountIn: () => {
      _gameState.trackEditor.validation.state.set('count-in')
    },

    startTrackValidationPlaying: () => {
      _gameState.trackEditor.validation.state.set('validation')
    },

    trackValidationFinished: (authorTime: number) => {
      _gameState.trackEditor.validation.state.set('finished')
      _gameState.trackData.current?.setValidated(true)
      _gameState.trackData.current?.timeAttackTrackTimes.author.set(authorTime)
    },

    cancelTrackValidation: () => {
      actions.startTrackEditor()
    },

    pauseGame: () => {
      _gameState.paused.set(true)
    },

    resumeGame: () => {
      _gameState.paused.set(false)
    },

    toggleGamePaused: () => {
      if (_gameState.paused.current) actions.resumeGame()
      else actions.pauseGame()
    }
  },
  { debug: true }
)

export const printState = () => {
  console.log(
    JSON.stringify(
      {
        appState: appState,
        menuState: menuState,
        gameState: gameState
      },
      null,
      2
    )
  )
}

export const saveStateToLocalStorage = () => {
  console.log('saving state to local storage')
  localStorage.setItem('appState', JSON.stringify(appState))
  localStorage.setItem('menuState', JSON.stringify(menuState))
  localStorage.setItem('gameState', JSON.stringify(gameState))
}

export const loadStateFromLocalStorage = () => {
  console.log('loading state from local storage')
  const loadedAppState = JSON.parse(localStorage.getItem('appState') ?? '')
  const loadedMenuState = JSON.parse(localStorage.getItem('menuState') ?? '')
  const loadedGameState = JSON.parse(localStorage.getItem('gameState') ?? '')

  // recursively set state values. If the value is an object, call this function again,
  // otherwise, set the value on the state at the path the object is at.
  const setStateValue = (state: any, data: any, currentPath = '') => {
    const currentPathParts = currentPath.split('.').filter((p) => p.length)
    const currentData = currentPathParts.reduce((acc, p) => acc[p], data)
    for (const key in currentData) {
      // if (key === 'trackEditor') debugger
      if (data[key] instanceof Object) {
        if (currentPath.length) {
          currentPath += '.' + key
        } else {
          currentPath += key
        }
        setStateValue(state, data, currentPath)
      } else {
        const currentState = currentPathParts.reduce((acc, p) => acc[p], state)
        currentState[key].set(currentData[key])
      }
    }
  }

  setStateValue(_appState, loadedAppState)
  setStateValue(_menuState, loadedMenuState)
  setStateValue(_gameState, loadedGameState)
}
