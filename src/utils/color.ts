// extract second rgb color from string linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(0, 0, 0) 100%)
export const extractColor = (linear: string) => {
  const color = linear.match(/rgb\((\d+), (\d+), (\d+)\)/g)
  return color ? color[1] : ''
}

// convert rgb to rgba with alpha
export const rgbToRgba = (rgb: string, alpha: number) => rgb.replace(')', `, ${alpha})`).replace('rgb', 'rgba')
