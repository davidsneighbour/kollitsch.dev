---
title: getRGBValues
summary: ""

weight: 100
---

* Receives a color as a string and returns the RGB values as dict
* The color can be in the following formats:
  * Hexadecimal: #RRGGBB or RRGGBB
  * short Hexadecimal: #RGB or RGB
* It returns a structure with following values:
  * R: red value (0-255)
  * G: green value (0-255)
  * B: blue value (0-255)
  * Hex: hexadecimal value of the color (with #)

```go-html-template
{{- $hexCodes := partial "func/getRGBValues.html" "f70" -}}

{{- with $hexCodes -}}
  R value: {{- .R -}}
  G value: {{- .G -}}
  B value: {{- .B -}}
  Hex color code: {{- .Hex -}}
{{- end -}}
```
