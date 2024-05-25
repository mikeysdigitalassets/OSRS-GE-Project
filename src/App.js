
import './App.css';
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";

function App() {
  return (
    <div className="d-flex" id="wrapper">
    {/* Sidebar */}
    <Sidebar />
    
    {/* Page Content */}
    <div id="page-content-wrapper">
      <Header />
      <MainContent />
    </div>
  </div>
);
}


export default App;
