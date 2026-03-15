/**
 * Helper functions for generating random values outside of render loops
 * to satisfy React 19 purity rules.
 */

export const generateParticleData = (count) => {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const indices = new Float32Array(count);

  const accentColor = { r: 0.388, g: 0.4, b: 0.945 }; // #6366f1
  const cyanColor = { r: 0.133, g: 0.827, b: 0.933 }; // #22d3ee
  const whiteColor = { r: 1, g: 1, b: 1 }; // #ffffff

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

    const colorChoice = Math.random();
    let color;
    if (colorChoice < 0.4) color = accentColor;
    else if (colorChoice < 0.7) color = cyanColor;
    else color = whiteColor;

    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;

    sizes[i] = Math.random() * 0.15 + 0.05;
    indices[i] = i;
  }

  return { positions, colors, sizes, indices };
};

export const generateLegacyParticleData = (count) => {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  const accentColor = { r: 0.388, g: 0.4, b: 0.945 }; // #6366f1
  const cyanColor = { r: 0.133, g: 0.827, b: 0.933 }; // #22d3ee
  const whiteColor = { r: 1, g: 1, b: 1 }; // #ffffff

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 15;

    const colorChoice = Math.random();
    let color;
    if (colorChoice < 0.4) color = accentColor;
    else if (colorChoice < 0.7) color = cyanColor;
    else color = whiteColor;

    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;

    sizes[i] = Math.random() * 0.08 + 0.02;
  }

  return { positions, colors, sizes };
};
