import React, { useState, useEffect } from 'react';

const App = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [calculations, setCalculations] = useState([]);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async () => {
    const response = await fetch('http://localhost:5000/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input }),
    });
    const data = await response.json();
    setResult(data.result);
    fetchCalculations(); // Fetch new calculations after a new one is added
  };

  const fetchCalculations = async () => {
    const response = await fetch('http://localhost:5000/calculations');
    const data = await response.json();
    setCalculations(data);
  };

  useEffect(() => {
    fetchCalculations();
  }, []);

  return (
    <div>
      <h1>Simple Calculator</h1>
      <input
        type="text"
        value={input}
        onChange={handleChange}
        placeholder="Enter your expression"
      />
      <button onClick={handleSubmit}>Calculate</button>
      {result && <h2>Result: {result}</h2>}
      <h2>Past Calculations</h2>
      <ul>
        {calculations.map((calc, index) => (
          <li key={index}>
            {calc.expression} = {calc.result}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
