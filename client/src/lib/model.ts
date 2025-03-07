import * as tf from '@tensorflow/tfjs';

let model: tf.LayersModel | null = null;

export async function initializeModel() {
  if (!model) {
    model = await tf.loadLayersModel('./my_model/model.json');
  }
  return model;
}

export async function classifyImage(imageElement: HTMLImageElement): Promise<{
  s_aureus: number;
  e_coli: number;
}> {
  const model = await initializeModel();

  // Convert the image to a tensor
  const tfImg = tf.browser.fromPixels(imageElement)
    .resizeBilinear([224, 224]) 
    .expandDims()
    .toFloat()
    .div(255.0);

  // Get predictions
  const predictions = await model.predict(tfImg) as tf.Tensor;
  const probabilities = await predictions.data();

  // Cleanup
  tfImg.dispose();
  predictions.dispose();

  return {
    s_aureus: probabilities[0],
    e_coli: probabilities[1]
  };
}