
import './App.css';
import LanguageBar from './components/Languagebar';
import Navbar from './components/Navbar';
import TypingArea from './components/TypingArea';

function App() {
  
const snippet = `for (int i = 0; i < 10; i++) {\n  cout << i << endl;\n}`;
  return (
   <>
    <Navbar></Navbar>
  <LanguageBar></LanguageBar>
  <TypingArea snippet={snippet}></TypingArea>
   </>
  )
}

export default App;
