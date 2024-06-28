import { createStore } from 'redux';

// Définir les types d'action
const UPDATE_POSITION = 'UPDATE_POSITION';

interface UpdatePositionAction {
  type: typeof UPDATE_POSITION;
  payload: { x: number; y: number };
}

type GameActions = UpdatePositionAction;

// Créateurs d'actions
export const updatePosition = (x: number, y: number): UpdatePositionAction => ({
  type: UPDATE_POSITION,
  payload: { x, y },
});

// État initial
interface GameState {
  playerX: number;
  playerY: number;
}

const initialState: GameState = {
  playerX: 400,
  playerY: 500,
};

// Réducteur
const gameReducer = (state = initialState, action: GameActions): GameState => {
  switch (action.type) {
    case UPDATE_POSITION:
      return {
        ...state,
        playerX: action.payload.x,
        playerY: action.payload.y,
      };
    default:
      return state;
  }
};

// Création du store
const store = createStore(gameReducer);

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
