# 🎨 Image Editor (Canvas + JavaScript)

A modern, responsive **Image Editor Web App** built using **HTML, CSS, and JavaScript**, powered by the **Canvas API**.

---

## 📸 Preview

![App Preview](./assets/preview.png)


---

## 🚀 Features

- 🖼️ Upload and edit images in real-time  
- 🎛️ Filters: Brightness, Contrast, Saturation, Hue, Blur, Sepia, Grayscale, Invert, Opacity  
- 🎨 Presets: Original, Vivid, Vintage, Cool, Warm, B&W  
- 🔄 Reset functionality  
- ⬇️ Download edited image  
- 📱 Fully responsive (Mobile + Desktop)

---

## 🧠 How It Works (Canvas Explained)

This project uses the **HTML `<canvas>` element** to edit images inside the browser.

### 🔧 Process:
1. User uploads an image  
2. Image is drawn onto canvas using:
   ```js
   ctx.drawImage(image, 0, 0)
---

## 🌍 Open Source

This project is **open source**, so anyone can use, modify, and improve it.

💡 Contributions are welcome:
- Add new filters or presets  
- Improve UI/UX  
- Fix bugs  
- Optimize performance  
- Add advanced features (crop, rotate, undo/redo)

### 🤝 How to Contribute

1. Fork the repository  
2. Create a new branch  
   ```bash
   git checkout -b feature-name