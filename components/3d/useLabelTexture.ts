"use client";

import { useEffect, useMemo } from "react";
import { CanvasTexture, SRGBColorSpace } from "three";
import { drawGroupGlyph, roundedRectPath } from "./glyphs";

/** Canvas pixels per CSS pixel, for crisp text. */
const SCALE = 2;

const TILE_FONT = 13;
const TILE_LINE = 17;
const TILE_RADIUS = 14;
const ICON_SIZE = 44;
const ICON_TOP = 14;
const MAX_LINE_CHARS = 12;

/** Sizes are in CSS pixels. */
export interface LabelTexture {
  texture: CanvasTexture;
  width: number;
  height: number;
}

export interface TileTextures {
  frame: CanvasTexture;
  content: CanvasTexture;
}

let measureContext: CanvasRenderingContext2D | null = null;

function monoFamily(): string {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue("--font-geist-mono")
    .trim();
  return value.length > 0 ? value : "ui-monospace, monospace";
}

function fontFor(size: number, weight = 500): string {
  return `${weight} ${size}px ${monoFamily()}`;
}

function measureText(text: string, font: string): number {
  measureContext ??= document.createElement("canvas").getContext("2d");
  if (!measureContext) return text.length * 10;
  measureContext.font = font;
  return measureContext.measureText(text).width;
}

function createSurface(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(width * SCALE);
  canvas.height = Math.ceil(height * SCALE);
  const context = canvas.getContext("2d");
  context?.scale(SCALE, SCALE);
  return { canvas, context };
}

function toTexture(canvas: HTMLCanvasElement): CanvasTexture {
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

/** Splits a long name into at most two balanced lines. */
function wrapLabel(text: string): string[] {
  if (text.length <= MAX_LINE_CHARS) return [text];

  const words = text.split(" ");
  let best: string[] = [text];
  let bestLongest = text.length;

  for (let i = 1; i < words.length; i += 1) {
    const left = words.slice(0, i).join(" ");
    const right = words.slice(i).join(" ");
    const longest = Math.max(left.length, right.length);
    if (longest < bestLongest) {
      best = [left, right];
      bestLongest = longest;
    }
  }
  return best;
}

/** Two letters for names without a logo: initials of 2+ words, or the first two letters. */
function monogramOf(label: string): string {
  const words = label.split(/\s+/).filter((word) => word.length > 0);
  if (words.length >= 2) {
    return words
      .slice(0, 3)
      .map((word) => word[0] ?? "")
      .join("")
      .toUpperCase();
  }
  return label.slice(0, 2);
}

/** White artwork on transparent: the material color tints it. */
export function createTileTextures(
  label: string,
  iconPath: string | null,
  width: number,
  height: number,
): TileTextures {
  const frame = createSurface(width, height);
  if (frame.context) {
    roundedRectPath(frame.context, 1.5, 1.5, width - 3, height - 3, TILE_RADIUS);
    frame.context.fillStyle = "rgba(255,255,255,0.08)";
    frame.context.fill();
    frame.context.lineWidth = 2;
    frame.context.strokeStyle = "#ffffff";
    frame.context.stroke();
  }

  const content = createSurface(width, height);
  const context = content.context;
  if (context) {
    context.fillStyle = "#ffffff";
    context.strokeStyle = "#ffffff";

    if (iconPath) {
      context.save();
      context.translate((width - ICON_SIZE) / 2, ICON_TOP);
      context.scale(ICON_SIZE / 24, ICON_SIZE / 24);
      context.fill(new Path2D(iconPath));
      context.restore();
    } else {
      context.lineWidth = 2;
      context.beginPath();
      context.arc(width / 2, ICON_TOP + ICON_SIZE / 2, ICON_SIZE / 2 - 1, 0, Math.PI * 2);
      context.stroke();
      context.font = fontFor(16, 700);
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(monogramOf(label), width / 2, ICON_TOP + ICON_SIZE / 2 + 1);
    }

    const lines = wrapLabel(label);
    context.font = fontFor(TILE_FONT);
    context.textAlign = "center";
    context.textBaseline = "middle";
    const blockTop = ICON_TOP + ICON_SIZE + 10;
    const blockCenter = blockTop + (height - blockTop - 8) / 2;
    lines.forEach((text, index) => {
      const y = blockCenter + (index - (lines.length - 1) / 2) * TILE_LINE;
      context.fillText(text, width / 2, y + 1);
    });
  }

  return { frame: toTexture(frame.canvas), content: toTexture(content.canvas) };
}

export function createGlyphTexture(id: string, size: number): LabelTexture {
  const surface = createSurface(size, size);
  if (surface.context) drawGroupGlyph(surface.context, id, size);
  return { width: size, height: size, texture: toTexture(surface.canvas) };
}

export function createTextTexture(text: string, fontSize: number): LabelTexture {
  const font = fontFor(fontSize);
  const width = Math.ceil(measureText(text, font)) + 6;
  const height = Math.ceil(fontSize * 1.5);

  const surface = createSurface(width, height);
  const context = surface.context;
  if (context) {
    context.fillStyle = "#ffffff";
    context.font = font;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, width / 2, height / 2 + 1);
  }
  return { width, height, texture: toTexture(surface.canvas) };
}

export function useTileTextures(
  label: string,
  iconPath: string | null,
  width: number,
  height: number,
): TileTextures {
  const textures = useMemo(
    () => createTileTextures(label, iconPath, width, height),
    [label, iconPath, width, height],
  );

  useEffect(
    () => () => {
      textures.frame.dispose();
      textures.content.dispose();
    },
    [textures],
  );

  return textures;
}

export function useGlyphTexture(id: string, size: number): LabelTexture {
  const glyph = useMemo(() => createGlyphTexture(id, size), [id, size]);
  useEffect(() => () => glyph.texture.dispose(), [glyph]);
  return glyph;
}

export function useTextTexture(text: string, fontSize: number): LabelTexture {
  const label = useMemo(() => createTextTexture(text, fontSize), [text, fontSize]);
  useEffect(() => () => label.texture.dispose(), [label]);
  return label;
}