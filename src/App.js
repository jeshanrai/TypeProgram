
import './App.css';
import LanguageBar from './components/Languagebar';
import Navbar from './components/Navbar';
import TypingArea from './components/TypingArea';
import {BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';

function App() {
  
const snippet = "This is a  test.";
  return (
   <>
    <Navbar></Navbar>
 <Routes>
        <Route path="/" element={
          <>
            <LanguageBar />
            <TypingArea snippet={snippet} />
          </>
        } />
        <Route path="/Customize" element={<h1>Customize</h1>} />
        <Route path="/Learn" element={<h1>Learn</h1>} />
      </Routes>

  
   </>
  )
}

export default App;
