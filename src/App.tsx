import React, { useState } from 'react';
import './App.css';
import * as mobilenet from '@tensorflow-models/mobilenet';
import '@tensorflow/tfjs';
import Tesseract from 'tesseract.js';

function App() {
  const [model, setModel] = useState<mobilenet.MobileNet | null>(null);

  // Load the MobileNet model
  React.useEffect(() => {
    const loadModel = async () => {
      const loadedModel = await mobilenet.load();
      setModel(loadedModel);
    };
    loadModel();
  }, []);

  // Handle image input and model prediction
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];

    if (file && model) {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      img.onload = async () => {
        const predictions = await model.classify(img);
        document.getElementById('result').innerText = JSON.stringify(predictions, null, 2);
      };
    }
    const { data: { text } } = await Tesseract.recognize(file, 'eng');
    document.getElementById('tess').innerText = text;

  };

  return (
    <section>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <div id="result"></div>
      <div>
        <h1>Tesseract Result</h1>
        <div id="tess">

        </div>
      </div>
    </section>
  );
}

export default App;
