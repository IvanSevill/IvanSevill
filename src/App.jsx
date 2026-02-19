import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Education from './components/Education';
import Projects from './components/Projects';
import Contact from './components/Contact';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Experience />
        <Education />
        <Projects />
        <Contact />
      </main>
      <footer className="py-6 text-center text-sm text-gray-500 border-t border-white/10 mt-10">
        © {new Date().getFullYear()} Iván Jesús Sevillano Plaza. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
