"use client";

import React, { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ColorPicker() {
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const [hexColor, setHexColor] = useState("#ff0000");

  useEffect(() => {
    const hslToHex = (h: number, s: number, l: number) => {
      l /= 100;
      const a = (s * Math.min(l, 1 - l)) / 100;
      const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color)
          .toString(16)
          .padStart(2, "0");
      };
      return `#${f(0)}${f(8)}${f(4)}`;
    };

    const newHexColor = hslToHex(hue, saturation, lightness);
    setHexColor(newHexColor);
  }, [hue, saturation, lightness]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Color Picker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="hue-slider">Hue</Label>
            <Slider
              id="hue-slider"
              min={0}
              max={360}
              step={1}
              value={[hue]}
              onValueChange={(value: any) => setHue(value[0])}
              className="[&_[role=slider]]:bg-[hsl(var(--hue),100%,50%)]"
              style={{ "--hue": hue } as React.CSSProperties}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="saturation-slider">Saturation</Label>
            <Slider
              id="saturation-slider"
              min={0}
              max={100}
              step={1}
              value={[saturation]}
              onValueChange={(value: any) => setSaturation(value[0])}
              className="[&_[role=slider]]:bg-[hsl(var(--hue),var(--saturation)%,50%)]"
              style={
                {
                  "--hue": hue,
                  "--saturation": saturation,
                } as React.CSSProperties
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lightness-slider">Lightness</Label>
            <Slider
              id="lightness-slider"
              min={0}
              max={100}
              step={1}
              value={[lightness]}
              onValueChange={(value: any) => setLightness(value[0])}
              className="[&_[role=slider]]:bg-[hsl(var(--hue),100%,var(--lightness)%)]"
              style={
                {
                  "--hue": hue,
                  "--lightness": lightness,
                } as React.CSSProperties
              }
            />
          </div>
          <div className="flex items-center space-x-4">
            <div
              className="w-16 h-16 rounded-md border border-gray-200"
              style={{ backgroundColor: hexColor }}
            ></div>
            <div className="space-y-1">
              <Label htmlFor="hex-color">Hex Color</Label>
              <Input
                id="hex-color"
                value={hexColor}
                readOnly
                className="uppercase"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
