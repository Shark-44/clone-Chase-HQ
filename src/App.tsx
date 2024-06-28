import './App.css'

import GameCanvas from "./components/GammeCanvas";

function App() {
 
  return (
    <div className="App">
      <header className="App-header">
        <h1>Chase H.Q. Clone</h1>
      </header>
      <GameCanvas width={800} height={600} />
    </div>
  );
}

export default App
