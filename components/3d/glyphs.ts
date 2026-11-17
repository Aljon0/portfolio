export function roundedRectPath(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
  ): void {
    context.beginPath();
    context.moveTo(x + radius, y);
    context.arcTo(x + width, y, x + width, y + height, radius);
    context.arcTo(x + width, y + height, x, y + height, radius);
    context.arcTo(x, y + height, x, y, radius);
    context.arcTo(x, y, x + width, y, radius);
    context.closePath();
  }
  
  function line(
    context: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  ): void {
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
  }
  
  function cylinder(
    context: CanvasRenderingContext2D,
    cx: number,
    top: number,
    rx: number,
    ry: number,
    height: number,
    bands: number,
  ): void {
    context.beginPath();
    context.ellipse(cx, top, rx, ry, 0, 0, Math.PI * 2);
    context.stroke();
  
    line(context, cx - rx, top, cx - rx, top + height);
    line(context, cx + rx, top, cx + rx, top + height);
  
    for (let band = 1; band <= bands; band += 1) {
      context.beginPath();
      context.ellipse(cx, top + (height * band) / bands, rx, ry, 0, 0, Math.PI);
      context.stroke();
    }
  }
  
  /** Draws a white line icon for a group id into a square of `size` px (a 100x100 design). */
  export function drawGroupGlyph(context: CanvasRenderingContext2D, id: string, size: number): void {
    context.save();
    context.scale(size / 100, size / 100);
    context.lineWidth = 5.5;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "#ffffff";
    context.fillStyle = "#ffffff";
  
    switch (id) {
      case "frontend": {
        roundedRectPath(context, 10, 18, 80, 64, 9);
        context.stroke();
        line(context, 10, 34, 90, 34);
        context.beginPath();
        context.arc(21, 26, 2, 0, Math.PI * 2);
        context.fill();
        context.beginPath();
        context.moveTo(40, 50);
        context.lineTo(29, 59);
        context.lineTo(40, 68);
        context.moveTo(60, 50);
        context.lineTo(71, 59);
        context.lineTo(60, 68);
        context.stroke();
        line(context, 54, 47, 46, 71);
        break;
      }
      case "backend": {
        roundedRectPath(context, 6, 26, 56, 52, 9);
        context.stroke();
        line(context, 6, 40, 62, 40);
        context.beginPath();
        context.moveTo(18, 50);
        context.lineTo(28, 58);
        context.lineTo(18, 66);
        context.stroke();
        line(context, 34, 66, 48, 66);
        cylinder(context, 78, 22, 14, 6, 34, 2);
        break;
      }
      case "data": {
        cylinder(context, 50, 22, 30, 11, 56, 2);
        break;
      }
      case "ai": {
        roundedRectPath(context, 28, 28, 44, 44, 7);
        context.stroke();
        roundedRectPath(context, 41, 41, 18, 18, 3);
        context.stroke();
        for (const p of [38, 50, 62]) {
          line(context, p, 28, p, 17);
          line(context, p, 72, p, 83);
          line(context, 28, p, 17, p);
          line(context, 72, p, 83, p);
        }
        break;
      }
      case "automation": {
        context.beginPath();
        context.arc(50, 50, 19, 0, Math.PI * 2);
        context.stroke();
        context.beginPath();
        context.arc(50, 50, 7, 0, Math.PI * 2);
        context.stroke();
        for (let tooth = 0; tooth < 8; tooth += 1) {
          const angle = (tooth * Math.PI) / 4;
          line(
            context,
            50 + Math.cos(angle) * 19,
            50 + Math.sin(angle) * 19,
            50 + Math.cos(angle) * 30,
            50 + Math.sin(angle) * 30,
          );
        }
        break;
      }
      case "infrastructure": {
        roundedRectPath(context, 18, 20, 64, 26, 7);
        context.stroke();
        roundedRectPath(context, 18, 54, 64, 26, 7);
        context.stroke();
        for (const y of [33, 67]) {
          context.beginPath();
          context.arc(30, y, 2.5, 0, Math.PI * 2);
          context.fill();
          line(context, 44, y, 70, y);
        }
        break;
      }
      default: {
        context.beginPath();
        context.arc(50, 50, 28, 0, Math.PI * 2);
        context.stroke();
      }
    }
  
    context.restore();
  }